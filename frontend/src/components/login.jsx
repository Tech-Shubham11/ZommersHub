import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
Loader2,
Mail,
Lock,
ShieldCheck,
Zap,
ArrowRight
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authslice";
import bgImage from "../image/wallpaper.jpg";

function Login() {

const navigate=useNavigate();
const dispatch=useDispatch();

const {user}=useSelector(
(store)=>store.auth
);

const [input,setInput]=useState({
email:"",
password:""
});

const [loading,setLoading]=useState(false);

const handleChange=(e)=>{
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
"https://zommershub.onrender.com/api/v1/user/login",
input,
{withCredentials:true}
);

if(res.data.success){
dispatch(
setAuthUser(res.data.user)
);

toast.success(res.data.message);
navigate("/");
}

}catch(error){
toast.error(
error?.response?.data?.message ||
"Server not reachable"
);
}
finally{
setLoading(false);
}
};


useEffect(()=>{
if(user){
navigate("/");
}
},[user,navigate]);


return(
<div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">

{/* LEFT BRAND PANEL */}
<div className="hidden lg:flex relative overflow-hidden">

<img
src={bgImage}
alt="bg"
className="absolute inset-0 w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-indigo-950/70 to-blue-700/60"/>

<div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">

<div>
<div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
<Zap className="w-5 h-5"/>
<span className="font-medium">
Powering Modern Commerce
</span>
</div>
</div>


<div className="max-w-xl">
<h1 className="text-6xl font-black leading-tight mb-6">
Zommers-Hub
<span className="block text-2xl text-gray-400">
For Gen-z
</span>
</h1>

<p className="text-lg text-white/80 leading-relaxed">
Grow your skills , discuss your start-up ,
and build your Strong Network
with one powerful platform.
</p>


<div className="grid grid-cols-2 gap-5 mt-10">

<div className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-3xl">
<ShieldCheck className="mb-4"/>
<h3 className="font-bold mb-2">
Secure Access
</h3>
<p className="text-sm text-white/70">
Enterprise-grade protection
</p>
</div>


<div className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-3xl">
<Zap className="mb-4"/>
<h3 className="font-bold mb-2">
Fast Performance
</h3>
<p className="text-sm text-white/70">
Lightning fast workflow
</p>
</div>

</div>

</div>


<p className="text-white/50 text-sm">
© 2026 ZommersHub
</p>

</div>

</div>




{/* RIGHT LOGIN PANEL */}
<div className="flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-blue-50">

<form
onSubmit={handleSubmit}
className="
w-full
max-w-md
bg-white/80
backdrop-blur-2xl
border
border-white
shadow-[0_20px_70px_rgba(0,0,0,.08)]
rounded-[32px]
p-8 md:p-10
"
>

<div className="mb-8 text-center">

<div className="
mx-auto
w-16
h-16
rounded-3xl
bg-gradient-to-r
from-blue-600
to-indigo-600
flex
items-center
justify-center
shadow-lg
mb-5
">

<ShieldCheck className="text-white"/>

</div>

<h2 className="text-4xl font-black mb-3">
Welcome Back
</h2>

<p className="text-gray-500">
Login to continue growing your store
</p>

</div>




<div className="space-y-5">

<div>
<label className="text-sm font-semibold mb-2 block">
Email Address
</label>

<div className="relative">
<Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400"/>

<Input
type="email"
name="email"
value={input.email}
onChange={handleChange}
placeholder="Enter email"
required
className="
pl-12
h-14
rounded-2xl
border-gray-200
focus:ring-2
focus:ring-blue-500
"
/>
</div>
</div>




<div>
<label className="text-sm font-semibold mb-2 block">
Password
</label>

<div className="relative">
<Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400"/>

<Input
type="password"
name="password"
value={input.password}
onChange={handleChange}
placeholder="Enter password"
required
className="
pl-12
h-14
rounded-2xl
border-gray-200
focus:ring-2
focus:ring-blue-500
"
/>
</div>
</div>


{/* <div className="flex justify-end">
<Link
to="/forgot-password"
className="text-sm text-blue-600 font-medium"
>
Forgot Password?
</Link>
</div> */}


<Button
type="submit"
disabled={loading}
className="
w-full
h-14
rounded-2xl
text-base
font-semibold
bg-gradient-to-r
from-blue-600
to-indigo-600
hover:opacity-95
shadow-lg
"
>

{loading ? (
<>
<Loader2 className="mr-2 h-5 w-5 animate-spin"/>
Logging in...
</>
):(
<>
Login Now
<ArrowRight className="ml-2 w-4 h-4"/>
</>
)}

</Button>


</div>



<div className="relative my-7">
<div className="border-t"/>
<span className="
absolute
left-1/2
-translate-x-1/2
-top-3
bg-white
px-4
text-sm
text-gray-400
">
or
</span>
</div>


<p className="text-center text-sm text-gray-500">
Don’t have an account?{" "}
<Link
to="/signup"
className="font-semibold text-blue-600 hover:underline"
>
Create Account
</Link>
</p>

</form>

</div>

</div>
);

}

export default Login;