import  jwt  from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utility/dataUri.js";
import { Post } from "../models/postModel.js";

export const register = async(req,res)=>{
    try{
        const {username,email,password,phoneNumber} = req.body;
        if(!username || !phoneNumber || !email || !password ){
            return res.status(401).json({
                message:"Something is missing , please check !",
                success:false
            });
        } 
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"Email already exists please try another email",
                success:false
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            phoneNumber,
            password : hashedPassword
        });

        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })

    }catch(error){
        console.log(error);
        
    }
}


export const login = async (req,res)=>{
try{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(401).json({
            message:"Something is missing , please check",
            success:false
        });
    }
    let user = await User.findOne({email});
    if(!user){
       return res.status(401).json({
            message:"Incorrect email and password",
            success:false
        });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
        return res.status(401).json({
            message:"Incorrect email or password",
            success:false
        });
    }
// populate each post if in the post array
const populatedPosts = await Promise.all( // sari id me se ek user ki post nikalne k liye promise.all 
user.posts.map(async (postId)=>{
    const post = await Post.findById(postId);
    if(post.author.equals(user._id)){
        return post;
    }
    return null;
})
)

    user={
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePhoto:user.profilePhoto,
        bio:user.bio,
        followers:user.followers,
        following:user.following,
        posts:populatedPosts,
    }

    const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
    return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
        message:`Welcome  back ${user.username}`,
        success:true,
        user
    });

}catch(error){
    console.log(error);
}
}


export const logout = async (_,res)=>{
    try{
        return res.cookie("token","",{maxAge:0}).json({
            message:'logged out successfully ',
            success:true
        });
    }catch(error){
        console.log(error);
        
    }
}


export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
  }
};


export const editProfile  = async(req,res)=>{
    try {
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePhoto = req.file;
        let cloudResponse;

        if(profilePhoto){
            const fileUri = getDataUri(profilePhoto);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found',
                success:false
            })
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePhoto) user.profilePhoto = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message:'profile updated ',
            success:true,
            user
        });

    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers = async(req,res)=>{
    try{
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message:'Currently do not have any users',
            });
        }
          return res.status(200).json({
                success:true,
                users:suggestedUsers
            });
    }catch(error){
        console.log(error);
    }
}
export const followOrUnfollow = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const targetUserId = req.params.id;

    // ❌ Cannot follow yourself
    if (loggedInUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const targetUser = await User.findById(targetUserId);

    if (!loggedInUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ IMPORTANT FIX (ObjectId safe check)
    const isFollowing = loggedInUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      // 🔴 UNFOLLOW
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: loggedInUserId } }
        ),
      ]);

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
        type: "unfollow",
      });

    } else {
      // 🔵 FOLLOW
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: loggedInUserId } }
        ),
      ]);

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
        type: "follow",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};