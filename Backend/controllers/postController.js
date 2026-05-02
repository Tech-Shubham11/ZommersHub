import sharp from 'sharp';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import { Comment } from '../models/commentModel.js';
import cloudinary from "../utility/cloudinary.js";
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // ✅ STEP 1: Create Post
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // ✅ STEP 2: Add post ID to user.posts array
    const user = await User.findById(authorId);
    user.posts.push(post._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Post created",
      post,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Post creation failed",
    });
  }
};

// feed wali post
export const getAllPost = async (req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({path:'author',select:'username  profilePhoto'}).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'profilePhoto'
            }
        });
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}


//id wali post
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePhoto" })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username profilePhoto",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    console.log(error);
  }
};

//liked vlogin here
export const likePost = async(req,res)=>{
    try {
        const likeKrneWala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'post not found' , success:false});

        //like logic start 
        await post.updateOne({$addToSet:{likes: likeKrneWala}});
        await post.save();

        // implement socket.io for real time notification
        const user = await User.findById(likeKrneWala).select('username profilePhoto');
        const postOwnerId = post.author.toString();
        if(postOwnerId!=likeKrneWala){
            // emit a notification event
            const notification ={
                type:'like',
                userId:likeKrneWala,
                userDetails:user,
                postId,
                message:'Your post was liked '
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }
        return res.status(200).json({message:'Post liked ',success:true  })

    } catch (error) {
        console.log(error);
    }
}

// dislike post here
export const dislikePost = async(req,res)=>{
    try {
        const likeKrneWala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'post not found' , success:false});

         //like logic start 
        await post.updateOne({$pull:{likes: likeKrneWala}});
        await post.save();

        // implement socket.io for real time notification
          // implement socket.io for real time notification
        const user = await User.findById(likeKrneWala).select('username profilePhoto');
        const postOwnerId = post.author.toString();
        if(postOwnerId!=likeKrneWala){
            // emit a notification event
            const notification ={
                type:'dislike',
                userId:likeKrneWala,
                userDetails:user,
                postId,
                message:'Your post was liked '
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({message:'Post disliked ',success:true })

    } catch (error) {
        console.log(error);
    }
}

// adding comment in post 
export const addComment = async (req,res)=>{
    try {
        const postId = req.params.id;
        const commentKrneWala = req.id;
        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!text) return res.status(400).json({message:'Comment will required' ,success:false});

        const comment = await Comment.create({
            text,
            author:commentKrneWala,
            post:postId
        })
        await comment.populate({
            path:'author',
            select:"username , profilePhoto"
        })
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:"Comment Added",
            comment,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

//feed wale sare post k comment 
export const getCommentsOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author','username  profilePhoto');
        if(!comments) return res.status(404).json({message:"No comment in this post",success:false});
        return res.status(200).json({success:true,comments});
    } catch (error) {
        console.log(error);
    }
}

// user delete post 
export const deletePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'post not found',success:false});

        //check if the logged in user is the owner or not of this post
        if(post.author.toString()!= authorId) return res.status(403).json({message:'unauthorized user'});

       // delete post 
        await Post.findByIdAndDelete(postId);

        //remove the post id from the users post
        let user = await User.findById(authorId);
       user.posts = user.posts.filter(id=>id.toString()!=postId) // array hai id remove or update krna hai isme filter laga skte hai 
       await user.save();

       //delete associated comments
       await Comment.deleteMany({post:postId});
       return res.status(200).json({message:'Post deleted',success:true})

    } catch (error) {
        console.log(error);
    }
}

//bookmark post here
export const bookmarkPost = async (req,res)=>{
try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:"post not found ",success:false});

    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id)){
        //allreadt bookmark -> remove bookmark 
        await user.updateOne({$pull:{bookmarks:post._id}});
        await user.save();
        return res.status(200).json({type:'unsaved', message:"Post removed from bookmarked",success:true});

    }else{
        await user.updateOne({$addToSet:{bookmarks:post._id}});
        await user.save();
        return res.status(200).json({type:'saved',message:"Post bookmarked",success:true});
    }
} catch (error) {
    console.log(error);
}
}