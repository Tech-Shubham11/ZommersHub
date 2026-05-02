import React, { useState } from "react";
import axios from "axios";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setPosts, setSelectedPost } from "../redux/postslice";
import { setAuthUser } from "../redux/authslice";
import { toast } from "sonner";

function Navbar() {

const dispatch = useDispatch();
const navigate = useNavigate();

const [mobileMenu,setMobileMenu]=useState(false);
const [showLogoutModal,setShowLogoutModal]=useState(false);


// LOGOUT
const logoutHandler = async () => {
try{
  const res = await axios.get(
    "https://zommershub.onrender.com/api/v1/user/logout",
    { withCredentials:true }
  );

  if(res.data.success){
    dispatch(setAuthUser(null));
    dispatch(setSelectedPost(null));
    dispatch(setPosts([]));

    toast.success(res.data.message);
    navigate("/login");
  }

}catch(error){
  toast.error("Logout failed");
}
};


return (
<>
<nav className="
sticky top-0 z-50
w-full
bg-white/90 backdrop-blur-xl
border-b
">

<div className="
max-w-7xl mx-auto
px-4 md:px-8
h-16 md:h-20
flex items-center justify-between
">

{/* LEFT */}
<div className="flex items-center gap-3">

<button
onClick={()=>setMobileMenu(!mobileMenu)}
className="md:hidden p-2 rounded-lg hover:bg-gray-100"
>
{mobileMenu ? <X/> : <Menu/>}
</button>

<h1 className="
text-xl md:text-2xl font-bold
cursor-pointer
">
<span>Zoomers</span>
<span className="text-blue-600">Hub</span>
</h1>

</div>


{/* RIGHT */}
<div className="flex items-center gap-2 md:gap-4">

{/* NOTIFICATION */}
<button className="
relative p-2 rounded-lg
hover:bg-gray-100
">
<Bell className="w-5 h-5"/>

<span className="
absolute top-1 right-1
w-2 h-2 bg-red-500 rounded-full
"/>
</button>

{/* LOGOUT */}
<button
onClick={()=>setShowLogoutModal(true)}
className="
flex items-center gap-2
px-3 md:px-4 py-2
rounded-xl
bg-red-500 text-white
text-sm font-medium
hover:bg-red-600
transition
"
>
<LogOut className="w-4 h-4"/>
<span className="hidden md:block">
Logout
</span>
</button>

</div>

</div>


</nav>



{/* LOGOUT MODAL */}
{showLogoutModal && (
<div className="
fixed inset-0
bg-black/50
flex items-center justify-center
z-[100]
p-4
">

<div className="
bg-white
w-full max-w-sm
rounded-2xl
p-6 text-center
">

<LogOut className="mx-auto mb-4 text-red-500"/>

<h2 className="text-lg font-semibold mb-2">
Logout Account?
</h2>

<p className="text-gray-500 text-sm mb-6">
Are you sure you want to logout?
</p>

<div className="flex gap-3">

<button
onClick={()=>setShowLogoutModal(false)}
className="
flex-1 py-2
rounded-lg border
"
>
Cancel
</button>

<button
onClick={()=>{
setShowLogoutModal(false);
logoutHandler();
}}
className="
flex-1 py-2
rounded-lg
bg-red-500 text-white
"
>
Logout
</button>

</div>

</div>

</div>
)}

</>
);

}

export default Navbar;