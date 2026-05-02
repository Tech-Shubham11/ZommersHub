import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
} from "./ui/select";

import {
Loader2,
Camera,
User2,
Sparkles,
ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authslice";
import axios from "axios";

function EditProfile() {

const imageRef = useRef();

const [loading,setLoading]=useState(false);

const {user}=useSelector(
(store)=>store.auth
);

const [input,setInput]=useState({
profilePhoto:null,
bio:user?.bio || "",
gender:user?.gender || ""
});

const dispatch=useDispatch();
const navigate=useNavigate();


const fileChangeHandler=(e)=>{
const file=e.target.files?.[0];
if(file){
setInput({
...input,
profilePhoto:file
});
}
};


const selectChangeHandler=(value)=>{
setInput({
...input,
gender:value
});
};



const editProfileHandler=async()=>{

const formData=new FormData();

formData.append(
"bio",
input.bio
);

formData.append(
"gender",
input.gender
);

if(input.profilePhoto){
formData.append(
"profilePhoto",
input.profilePhoto
);
}

try{

setLoading(true);

const res=await axios.post(
"https://zommershub.onrender.com/api/v1/user/profile/edit",
formData,
{
withCredentials:true
}
);

if(res.data.success){

const updatedUser={
...user,
bio:res.data.user?.bio,
gender:res.data.user?.gender,
profilePhoto:res.data.user?.profilePhoto
};

dispatch(
setAuthUser(updatedUser)
);

toast.success(
res.data.message
);

navigate(
`/profile/${user?._id}`
);

}

}catch(error){
toast.error(
error?.response?.data?.message ||
"Update failed"
);
}
finally{
setLoading(false);
}

};



return(

<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

{/* TOP HERO */}
<div className="h-56 md:h-72 rounded-b-[40px] bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 shadow-xl relative overflow-hidden">

<div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]"/>

<div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between relative z-10">

<div className="text-white">
<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-4">
<Sparkles className="w-4 h-4"/>
Profile Studio
</div>

</div>

<div className="hidden lg:block">
<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
<ShieldCheck className="w-16 h-16 text-white mb-4"/>
<p className="text-white font-semibold">
Secure profile customization
</p>
</div>
</div>

</div>
</div>



<div className="max-w-6xl mx-auto px-4 md:px-8 -mt-20 pb-16">

<div className="grid lg:grid-cols-3 gap-8">

{/* LEFT PROFILE CARD */}
<div className="lg:col-span-1">

<div className="bg-white rounded-[32px] shadow-xl border p-8 sticky top-8">

<div className="flex flex-col items-center text-center">

<div className="relative">

<Avatar className="w-32 h-32 ring-4 ring-indigo-100 shadow-lg">
<AvatarImage
src={
input.profilePhoto
?URL.createObjectURL(
input.profilePhoto
)
:user?.profilePhoto
}
/>

<AvatarFallback>
{user?.username?.[0]}
</AvatarFallback>
</Avatar>

<button
onClick={()=>
imageRef.current.click()
}
className="
absolute
bottom-2
right-2
bg-indigo-600
text-white
p-3
rounded-full
shadow-lg
hover:scale-105
transition
"
>
<Camera className="w-5 h-5"/>
</button>

</div>


<input
ref={imageRef}
type="file"
accept="image/*"
onChange={fileChangeHandler}
className="hidden"
/>

<h2 className="mt-5 text-2xl font-bold">
{user?.username}
</h2>

<p className="text-gray-500 mt-2">
{input.bio || "Add a short bio"}
</p>


<div className="grid grid-cols-2 gap-4 w-full mt-8">

<div className="rounded-2xl bg-slate-50 p-4">
<p className="text-xs text-gray-500">
Gender
</p>
<p className="font-semibold mt-1 capitalize">
{input.gender || "N/A"}
</p>
</div>

<div className="rounded-2xl bg-slate-50 p-4">
<p className="text-xs text-gray-500">
Status
</p>
<p className="font-semibold mt-1 text-green-600">
Active
</p>
</div>

</div>

<Button
onClick={()=>
imageRef.current.click()
}
className="
w-full
mt-8
rounded-2xl
h-12
bg-indigo-600
hover:bg-indigo-700
"
>
Change Profile Photo
</Button>

</div>

</div>

</div>



{/* RIGHT FORM */}
<div className="lg:col-span-2">

<div className="bg-white rounded-[32px] shadow-xl border p-6 md:p-10">

<div className="flex items-center gap-3 mb-8">
<div className="p-3 rounded-2xl bg-indigo-50">
<User2 className="w-6 h-6 text-indigo-600"/>
</div>

<div>
<h2 className="text-3xl font-bold">
Personal Details
</h2>

<p className="text-gray-500">
Update your public profile info
</p>
</div>

</div>



<div className="space-y-8">

<div>
<label className="font-semibold block mb-3">
Bio
</label>

<Textarea
value={input.bio}
onChange={(e)=>
setInput({
...input,
bio:e.target.value
})
}
placeholder="Write something meaningful about yourself..."
className="
min-h-[180px]
rounded-3xl
border-2
focus:border-indigo-500
p-5
text-base
resize-none
"
/>

</div>



<div>
<label className="font-semibold block mb-3">
Gender
</label>

<Select
value={input.gender}
onValueChange={selectChangeHandler}
>

<SelectTrigger className="h-14 rounded-2xl">
<SelectValue placeholder="Select gender"/>
</SelectTrigger>

<SelectContent>
<SelectGroup>
<SelectItem value="male">
Male
</SelectItem>

<SelectItem value="female">
Female
</SelectItem>

<SelectItem value="other">
Other
</SelectItem>
</SelectGroup>
</SelectContent>

</Select>

</div>


<div className="
pt-6
flex
flex-col-reverse
sm:flex-row
justify-end
gap-4
">

<Button
variant="outline"
className="rounded-2xl h-12 px-8"
onClick={()=>navigate(-1)}
>
Cancel
</Button>


<Button
onClick={editProfileHandler}
disabled={loading}
className="
rounded-2xl
h-12
px-10
bg-indigo-600
hover:bg-indigo-700
shadow-lg
"
>

{loading ?(
<>
<Loader2 className="mr-2 h-4 animate-spin"/>
Saving...
</>
):(
"Save Changes"
)}

</Button>

</div>

</div>

</div>

</div>

</div>

</div>

</div>

);

}

export default EditProfile;

