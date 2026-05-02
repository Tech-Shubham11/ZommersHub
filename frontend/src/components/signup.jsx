import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
Loader2,
ArrowRight,
ShieldCheck,
Sparkles,
Phone,
Mail,
Lock,
User
} from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import bgImagee from "../image/wallpaper.jpg";

function Signup(){

const [input,setInput]=useState({
username:"",
email:"",
phoneNumber:"",
password:""
});

const [loading,setLoading]=useState(false);

const {user}=useSelector(
(store)=>store.auth
);

const navigate=useNavigate();

const getData=(e)=>{
setInput({
...input,
[e.target.name]:e.target.value
});
};

const handleSubmit=async(e)=>{
e.preventDefault();

try{
setLoading(true);

const res=await axios.post(
"https://zommershub.onrender.com/api/v1/user/register",
input,
{
withCredentials:true
}
);

if(res.data.success){
toast.success(res.data.message);

navigate("/");

setInput({
username:"",
email:"",
phoneNumber:"",
password:""
});
}

}catch(error){
toast.error(
error.response?.data?.message ||
"Server not reachable"
)
}
finally{
setLoading(false)
}
};

useEffect(()=>{
if(user){
navigate("/")
}
},[user,navigate]);


return(
<div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">


{/* LEFT BRAND SECTION */}
<div className="hidden lg:flex relative overflow-hidden">

<img
src={bgImagee}
alt=""
className="absolute inset-0 h-full w-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-black/70 to-blue-900/70"/>

<div className="relative z-10 p-14 flex flex-col justify-between text-white w-full">

<div>

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/20 backdrop-blur-md bg-white/10">
<Sparkles className="w-5 h-5"/>
<span className="font-medium">
Grow Your Online Store Faster
</span>
</div>

<h1 className="text-6xl leading-tight font-black mt-8 max-w-xl">
Launch.
Scale.
Sell smarter.
</h1>

<p className="text-lg text-slate-200 mt-6 max-w-xl leading-relaxed">
Join thousands of businesses using ZommersHub
to manage products, customers and sales beautifully.
</p>


<div className="grid grid-cols-2 gap-5 mt-12">

<div className="rounded-3xl bg-white/10 backdrop-blur-xl p-6 border border-white/10">
<h3 className="text-4xl font-bold">
10k+
</h3>
<p className="mt-2 text-slate-300">
Active Sellers
</p>
</div>

<div className="rounded-3xl bg-white/10 backdrop-blur-xl p-6 border border-white/10">
<h3 className="text-4xl font-bold">
98%
</h3>
<p className="mt-2 text-slate-300">
Success Rate
</p>
</div>

</div>

</div>


<div className="flex gap-6 text-sm text-slate-300">
<div className="flex items-center gap-2">
<ShieldCheck className="w-5 h-5"/>
Secure Platform
</div>

<div className="flex items-center gap-2">
<Sparkles className="w-5 h-5"/>
Premium Experience
</div>
</div>

</div>

</div>





{/* RIGHT FORM SECTION */}
<div className="flex items-center justify-center px-5 py-10 bg-gradient-to-br from-slate-50 to-indigo-50">

<div className="w-full max-w-md">

{/* Mobile Brand */}
<div className="text-center mb-8 lg:hidden">
<h1 className="text-3xl font-black">
<span>Zommers</span>
<span className="text-indigo-600">
Hub
</span>
</h1>
</div>


<form
onSubmit={handleSubmit}
className="
bg-white
rounded-[32px]
shadow-2xl
border
p-8 md:p-10
space-y-6
"
>

<div className="text-center">
<div className="inline-flex p-4 rounded-2xl bg-indigo-50 mb-5">
<Sparkles className="text-indigo-600"/>
</div>

<h2 className="text-4xl font-black">
Create Account
</h2>

<p className="text-slate-500 mt-3">
Start your journey in seconds
</p>

</div>



{/* username */}
<div className="space-y-2">
<label className="font-medium">
Username
</label>

<div className="relative">
<User className="absolute left-4 top-4 w-5 h-5 text-slate-400"/>

<Input
name="username"
value={input.username}
onChange={getData}
required
placeholder="John Doe"
className="pl-12 h-14 rounded-2xl border-slate-200"
/>
</div>
</div>




{/* phone */}
<div className="space-y-2">
<label className="font-medium">
Phone Number
</label>

<div className="relative">
<Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400"/>

<Input
name="phoneNumber"
value={input.phoneNumber}
onChange={getData}
required
placeholder="+91 9876543210"
className="pl-12 h-14 rounded-2xl"
/>
</div>
</div>




{/* email */}
<div className="space-y-2">
<label className="font-medium">
Email
</label>

<div className="relative">
<Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400"/>

<Input
type="email"
name="email"
value={input.email}
onChange={getData}
required
placeholder="your@email.com"
className="pl-12 h-14 rounded-2xl"
/>
</div>
</div>




{/* password */}
<div className="space-y-2">
<label className="font-medium">
Password
</label>

<div className="relative">
<Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400"/>

<Input
type="password"
name="password"
value={input.password}
onChange={getData}
required
placeholder="Create password"
className="pl-12 h-14 rounded-2xl"
/>
</div>
</div>




<Button
type="submit"
disabled={loading}
className="
w-full
h-14
rounded-2xl
text-base
font-semibold
bg-black
hover:bg-slate-900
"
>
{loading ?(
<div className="flex items-center gap-2">
<Loader2 className="w-5 h-5 animate-spin"/>
Creating Account...
</div>
):(
<div className="flex items-center gap-2">
Create Account
<ArrowRight className="w-5 h-5"/>
</div>
)}
</Button>



<div className="text-center text-sm text-slate-500">
Already have an account?{" "}
<Link
to="/login"
className="font-semibold text-indigo-600 hover:underline"
>
Login
</Link>
</div>


<div className="grid grid-cols-3 gap-3 pt-4">

<div className="rounded-2xl bg-slate-50 p-3 text-center text-sm font-medium">
Fast
</div>

<div className="rounded-2xl bg-slate-50 p-3 text-center text-sm font-medium">
Secure
</div>

<div className="rounded-2xl bg-slate-50 p-3 text-center text-sm font-medium">
Trusted
</div>

</div>

</form>

</div>

</div>

</div>
)

}

export default Signup;