import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  MoreHorizontal,
  SendHorizonal,
  MessageCircle,
  Heart,
  Sparkles
} from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postslice";

function CommentDialog({ open, setOpen }) {

const { selectedPost, posts } = useSelector((store)=>store.post);
const dispatch = useDispatch();

const [text,setText] = useState("");
const [comment,setComment] = useState([]);

useEffect(()=>{
  if(selectedPost){
    setComment(selectedPost.comments || []);
  }
},[selectedPost]);


// SEND COMMENT
const sendMessageHandler = async ()=>{
  if(!text.trim()) return;

  try{
    const res = await axios.post(
      `https://zommershub.onrender.com/api/v1/post/${selectedPost._id}/comment`,
      { text },
      { withCredentials:true }
    );

    if(res.data.success){

      const updatedComments = [
        ...comment,
        res.data.comment
      ];

      const updatedPosts = posts.map((p)=>
        p._id===selectedPost._id
        ? {...p,comments:updatedComments}
        : p
      );

      dispatch(setPosts(updatedPosts));
      setComment(updatedComments);
      setText("");

      toast.success("Comment added");

    }

  }catch(error){
    console.log(error);
    toast.error("Failed to add comment");
  }
};



return (
<Dialog open={open}>
<DialogContent
  onInteractOutside={()=>setOpen(false)}
  className="
    p-0
    overflow-hidden
    border-0
    w-full
    max-w-3xl
    h-[90vh]
    rounded-2xl
    bg-white
    flex flex-col
  "
>

{/* HEADER */}
<div className="border-b px-5 py-4 flex justify-between items-center">

<div className="flex items-center gap-3">
<Avatar className="w-10 h-10">
  <AvatarImage src={selectedPost?.author?.profilePhoto}/>
  <AvatarFallback>
    {selectedPost?.author?.username?.[0]?.toUpperCase()}
  </AvatarFallback>
</Avatar>

<div>
  <p className="font-semibold text-sm">
    {selectedPost?.author?.username}
  </p>
  <p className="text-xs text-gray-400">
    Public discussion
  </p>
</div>
</div>

<div className="flex items-center gap-4 text-sm text-gray-500">
  <div className="flex items-center gap-1">
    <Heart size={16}/> {comment.length}
  </div>
  <button className="p-2 hover:bg-gray-100 rounded-full">
    <MoreHorizontal/>
  </button>
</div>

</div>



{/* SCROLLABLE COMMENTS */}
<div className="
flex-1
overflow-y-auto
px-4 md:px-6
py-4
space-y-3
bg-gray-50
">

{comment.length > 0 ? (

comment.map((c)=>(
  <Comment key={c._id} comment={c}/>
))

):(

<div className="h-full flex items-center justify-center text-center">
  <div>
    <MessageCircle className="mx-auto mb-3 text-indigo-500"/>
    <p className="font-semibold">No comments yet</p>
    <p className="text-gray-400 text-sm">
      Start the conversation
    </p>
  </div>
</div>

)}

</div>



{/* STICKY INPUT (FIXED ISSUE) */}
<div className="
border-t
bg-white
p-3
sticky bottom-0
">

<div className="
flex items-center gap-2
bg-gray-100
rounded-full
px-3 py-2
">

<Avatar className="w-8 h-8">
  <AvatarImage src={selectedPost?.author?.profilePhoto}/>
</Avatar>

<input
  type="text"
  value={text}
  placeholder="Write a comment..."
  onChange={(e)=>setText(e.target.value)}
  onKeyDown={(e)=>{
    if(e.key==="Enter"){
      sendMessageHandler();
    }
  }}
  className="
  flex-1
  bg-transparent
  outline-none
  text-sm
  "
/>

<Button
  disabled={!text.trim()}
  onClick={sendMessageHandler}
  className="
  rounded-full
  h-10
  px-4
  bg-indigo-600
  hover:bg-indigo-700
  "
>
<SendHorizonal className="w-4 h-4"/>
</Button>

</div>

</div>

</DialogContent>
</Dialog>
);

}

export default CommentDialog;


