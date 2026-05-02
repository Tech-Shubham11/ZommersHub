import React,{useState} from "react";
import axios from "axios";
import {
Dialog,
DialogTrigger,
DialogContent,
DialogTitle,
DialogDescription
} from "./ui/dialog";

import {Button} from "./ui/button";
import {Avatar,AvatarImage,AvatarFallback} from "./ui/avatar";
import {Badge} from "./ui/badge";

import {
MessageCircle,
Send,
Bookmark,
MoreHorizontal,
Trash2
} from "lucide-react";

import {FaHeart,FaRegHeart} from "react-icons/fa";

import CommentDialog from "./CommentDialog.jsx";

import {useDispatch,useSelector} from "react-redux";
import {toast} from "sonner";
import {setPosts,setSelectedPost} from "../redux/postslice.js";
import {Link} from "react-router-dom";

function Post({post}){

const {user}=useSelector(store=>store.auth);
const {posts}=useSelector(store=>store.post);

const dispatch=useDispatch();

const [openComment,setOpenComment]=useState(false);
const [openDelete,setOpenDelete]=useState(false);

const liked=post?.likes?.includes(user?._id);



const likeOrDislikeHandler=async()=>{
try{

const action=liked?"dislike":"like";

const res=await axios.get(
`https://zommershub.onrender.com/api/v1/post/${post?._id}/${action}`,
{withCredentials:true}
);

if(res.data.success){

const updatedPosts=posts.map(p=>
p._id===post._id
?{
...p,
likes:liked
? p.likes.filter(id=>id!==user?._id)
:[...p.likes,user?._id]
}
:p
)

dispatch(setPosts(updatedPosts))
}

}catch(error){
toast.error("Action failed")
}
};



const deletePostHandler=async()=>{
try{

const res=await axios.delete(
`https://zommershub.onrender.com/api/v1/post/delete/${post?._id}`,
{withCredentials:true}
)

if(res.data.success){

dispatch(
setPosts(
posts.filter(
p=>p._id!==post._id
)
)
)

toast.success(res.data.message)
setOpenDelete(false)
}

}catch(error){
toast.error("Delete failed")
}
};



const bookmarkHandler=async()=>{
try{

const res=await axios.get(
`https://zommershub.onrender.com/api/v1/post/${post?._id}/bookmark`,
{withCredentials:true}
)

if(res.data.success){
toast.success(res.data.message)
}

}catch(err){
console.log(err)
}
};



return(
<div className="w-full max-w-xl mx-auto px-3 md:px-0 py-6">

<div className="
bg-white/80
backdrop-blur-xl
rounded-[32px]
border
shadow-xl
overflow-hidden
hover:shadow-2xl
transition
duration-300
">


{/* HEADER */}
<div className="px-6 pt-5 pb-4 flex justify-between items-center">

<div className="flex items-center gap-4">

<Link to={`/profile/${post?.author?._id}`}>
<Avatar className="w-14 h-14 ring-4 ring-indigo-100">
<AvatarImage src={post?.author?.profilePhoto}/>
<AvatarFallback>
{post?.author?.username?.charAt(0)}
</AvatarFallback>
</Avatar>
</Link>

<div>
<Link to={`/profile/${post?.author?._id}`}>
<h2 className="font-bold text-lg">
{post?.author?.username}
</h2>
</Link>

<div className="flex gap-2 mt-1">

<Badge className="rounded-full px-3">
Creator
</Badge>

{user?._id===post?.author?._id&&(
<Badge
variant="secondary"
className="rounded-full"
>
Author
</Badge>
)}

</div>

</div>

</div>



{user?._id===post?.author?._id&&(
<Dialog open={openDelete} onOpenChange={setOpenDelete}>

<DialogTrigger asChild>

<button className="
p-3 rounded-full
hover:bg-gray-100
transition
">
<MoreHorizontal/>
</button>

</DialogTrigger>


<DialogContent className="rounded-3xl">
<DialogTitle>
Delete this post?
</DialogTitle>

<DialogDescription>
This action cannot be undone.
</DialogDescription>

<div className="flex gap-3 mt-6">
<Button
variant="outline"
className="flex-1"
onClick={()=>setOpenDelete(false)}
>
Cancel
</Button>

<Button
onClick={deletePostHandler}
variant="destructive"
className="flex-1"
>
<Trash2 className="w-4 h-4 mr-2"/>
Delete
</Button>

</div>

</DialogContent>

</Dialog>
)}

</div>



{/* CAPTION TOP */}
{post?.caption &&(
<div className="px-6 pb-4">
<p className="text-gray-700 leading-7">
{/* <span className="font-semibold mr-2">
{post?.author?.username}
</span> */}
{post?.caption}
</p>
</div>
)}



{/* IMAGE */}
<div className="px-4">
<div className="
rounded-[28px]
overflow-hidden
bg-gradient-to-br
from-slate-100
to-slate-200
">

<img
src={post?.image}
alt="post"
className="
w-full
max-h-[700px]
object-cover
hover:scale-[1.02]
transition
duration-500
"
/>

</div>
</div>




{/* FLOAT ACTION BAR */}
<div className="px-6 py-5">

<div className="
bg-slate-50
rounded-3xl
px-5 py-4
flex items-center justify-between
shadow-inner
">

<div className="flex items-center gap-6">

<button
onClick={likeOrDislikeHandler}
className="flex items-center gap-2"
>
{liked ? (
<FaHeart
size={24}
className="text-red-500"
/>
):(
<FaRegHeart size={24}/>
)}

<span className="font-medium">
{post?.likes?.length || 0}
</span>
</button>



<button
onClick={()=>{
dispatch(setSelectedPost(post));
setOpenComment(true)
}}
className="flex items-center gap-2"
>
<MessageCircle size={23}/>
<span>
{post?.comments?.length||0}
</span>
</button>


<button>
<Send size={22}/>
</button>

</div>



<button
onClick={bookmarkHandler}
className="
p-3
rounded-2xl
hover:bg-white
transition
"
>
<Bookmark size={22}/>
</button>

</div>

</div>




{/* COMMENT CTA */}
{post?.comments?.length>0&&(
<div className="px-6 pb-6">

<button
onClick={()=>{
dispatch(setSelectedPost(post));
setOpenComment(true)
}}
className="
text-indigo-600
font-medium
hover:underline
"
>
View all {post.comments.length} comments
</button>

</div>
)}

</div>


<CommentDialog
open={openComment}
setOpen={setOpenComment}
/>

</div>
)

}

export default Post;


