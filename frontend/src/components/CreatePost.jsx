import React, { useRef, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

import {
Loader2,
ImagePlus,
Sparkles,
X,
Upload,
Wand2,
ArrowLeft
} from "lucide-react";

import { toast } from "sonner";
import { useDispatch,useSelector } from "react-redux";
import { setPosts } from "../redux/postslice";
import { readFileAsDataURL } from "../lib/utils";


function CreatePost({open,setOpen}){

const imageRef=useRef();

const [file,setFile]=useState(null);
const [caption,setCaption]=useState("");
const [imagePreview,setImagePreview]=useState("");
const [loading,setLoading]=useState(false);

const {posts}=useSelector(store=>store.post);
const dispatch=useDispatch();


// FILE CHANGE
const fileChangeHandler=async(e)=>{
const selected=e.target.files?.[0];

if(selected){
setFile(selected);
const dataUrl=await readFileAsDataURL(selected);
setImagePreview(dataUrl);
}
};


// REMOVE IMAGE
const removeImage=()=>{
setFile(null);
setImagePreview("");
};


// CREATE POST
const createPostHandle=async()=>{

if(!file){
toast.error("Please select image");
return;
}

const formData=new FormData();
formData.append("caption",caption);
formData.append("image",file);

try{

setLoading(true);

const res=await axios.post(
"http://localhost:5000/api/v1/post/addpost",
formData,
{ withCredentials:true }
);

if(res?.data?.success){

dispatch(setPosts([res.data.post,...posts]));

toast.success("Post Published");

setCaption("");
setFile(null);
setImagePreview("");
setOpen(false);
}

}catch(error){
console.log(error);
toast.error("Failed to create post");
}
finally{
setLoading(false);
}

};


return(

<Dialog open={open}>
<DialogContent
onInteractOutside={()=>setOpen(false)}
className="
p-0
border-0
overflow-hidden
max-w-2xl
w-full
h-[90vh]
flex flex-col
rounded-[24px]
shadow-2xl
bg-white
"
>

{/* 🔥 HEADER WITH BACK BUTTON */}
<div className="
flex items-center justify-between
px-5 py-4
border-b
bg-white
sticky top-0 z-20
">

{/* LEFT SIDE */}
<div className="flex items-center gap-3">

<button
onClick={()=>setOpen(false)}
className="
h-10 w-10
rounded-full
bg-gray-100
flex items-center justify-center
hover:bg-gray-200
transition
"
>
<ArrowLeft size={18}/>
</button>

<div>
<p className="font-semibold text-sm">
Create Post
</p>
<p className="text-xs text-gray-400">
Share something new
</p>
</div>

</div>

{/* RIGHT SIDE */}
<button
onClick={()=>setOpen(false)}
className="
h-10 w-10
rounded-full
hover:bg-gray-100
flex items-center justify-center
"
>
<X/>
</button>

</div>



{/* SCROLLABLE BODY */}
<div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">


{/* Caption */}
<div className="space-y-3">

<div className="flex justify-between">
<label className="font-semibold">Caption</label>
<span className="text-sm text-gray-400">
{caption.length}/2200
</span>
</div>

<Textarea
value={caption}
onChange={(e)=>setCaption(e.target.value)}
placeholder="Write something engaging..."
className="min-h-[120px] rounded-xl"
/>

</div>



{/* Upload */}
{!imagePreview && (
<div
onClick={()=>imageRef.current.click()}
className="
border-2 border-dashed
rounded-xl
p-10 text-center
cursor-pointer
hover:bg-gray-50
transition
"
>
<ImagePlus className="mx-auto mb-4"/>
<p className="font-medium">Upload Image</p>
<p className="text-sm text-gray-400">
Click to select file
</p>
</div>
)}



{/* Preview */}
{imagePreview &&(
<div className="space-y-4">

<div className="relative rounded-xl overflow-hidden">
<img src={imagePreview} className="w-full max-h-[400px] object-cover"/>

<button
onClick={removeImage}
className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full"
>
<X size={16}/>
</button>
</div>

<div className="flex gap-3">

<Button
onClick={()=>imageRef.current.click()}
variant="outline"
className="flex-1"
>
Change
</Button>

<Button
onClick={createPostHandle}
disabled={loading}
className="flex-1 bg-indigo-600 hover:bg-indigo-700"
>
{loading ? "Publishing..." : "Publish"}
</Button>

</div>

</div>
)}


<input
ref={imageRef}
type="file"
accept="image/*"
className="hidden"
onChange={fileChangeHandler}
/>

</div>

</DialogContent>
</Dialog>

);

}

export default CreatePost;
