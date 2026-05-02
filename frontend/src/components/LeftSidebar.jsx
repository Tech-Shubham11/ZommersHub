 
import {
Home,
LogOut,
MessageCircle,
PlusSquare,
Search,
Bell,
User
} from "lucide-react";

import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "sonner";
import {useDispatch,useSelector} from "react-redux";

import {Avatar,AvatarImage,AvatarFallback} from "./ui/avatar";
import CreatePost from "./CreatePost";
import {setAuthUser} from "../redux/authslice";
import {setPosts,setSelectedPost} from "../redux/postslice";

function LeftSidebar(){

const navigate=useNavigate();
const dispatch=useDispatch();

const {user}=useSelector((store)=>store.auth);

const [open,setOpen]=useState(false);
const [active,setActive]=useState("Home");


const logoutHandler=async()=>{
try{
const res=await axios.get(
"http://localhost:5000/api/v1/user/logout",
{withCredentials:true}
);

if(res.data.success){
dispatch(setAuthUser(null));
dispatch(setSelectedPost(null));
dispatch(setPosts([]));

toast.success(res.data.message);

navigate("/login");
}
}catch(error){
toast.error("Logout Failed");
}
};



const sidebarHandler=(type)=>{

setActive(type);

switch(type){

case "Create":
setOpen(true);
break;

case "Profile":
navigate(`/profile/${user?._id}`);
break;

case "Home":
navigate("/");
break;

case "Message":
navigate("/chat");
break;

case "Search":
navigate("/search");
break;

case "Explore":
navigate("/profile");
break;

default:
break;

}

};


const menuItems=[
{
icon:<Home size={21}/>,
text:"Home"
},
{
icon:<Search size={21}/>,
text:"Search"
},
{
icon:<PlusSquare size={21}/>,
text:"Create"
},
{
icon:<MessageCircle size={21}/>,
text:"Message"
},

{
icon:(
<Avatar className="w-7 h-7 ring-2 ring-white shadow">
<AvatarImage src={user?.profilePhoto}/>
<AvatarFallback>
{user?.username?.charAt(0)?.toUpperCase()}
</AvatarFallback>
</Avatar>
),
text:"Profile"
}
];



return(
<>
{/* DESKTOP PREMIUM SIDEBAR */}
<aside className="
hidden md:flex
fixed
left-0
top-0
h-screen
w-[290px]
bg-white/80
backdrop-blur-2xl
border-r
shadow-xl
flex-col
justify-between
px-6
py-7
">

<div>

{/* Logo */}
<div className="
mb-10
rounded-3xl
p-5
bg-gradient-to-r
from-indigo-600
via-violet-600
to-purple-600
text-white
shadow-2xl
">

<h1 className="text-2xl font-black tracking-tight">
Zoomers-Hub
</h1>

<p className="text-sm opacity-90 mt-1">
Creative Community Platform
</p>

</div>



{/* MENU */}
<div className="space-y-3">

{menuItems.map((item,index)=>(

<button
key={index}
onClick={()=>sidebarHandler(item.text)}
className={`
w-full
flex
items-center
gap-4
px-5
py-4
rounded-2xl
transition-all
duration-300
group

${active===item.text
?"bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
:"hover:bg-gray-100 text-gray-700 hover:translate-x-1"
}
`}
>

<div className={`
${active===item.text
?"scale-110"
:"group-hover:scale-110"}
transition
`}>
{item.icon}
</div>

<span className="font-semibold text-[15px]">
{item.text}
</span>

</button>

))}

</div>

</div>

</aside>





{/* MOBILE FLOATING NAV */}
<div className="
md:hidden
fixed
bottom-4
left-1/2
-translate-x-1/2
w-[92%]
z-50
">

<div className="
bg-white/90
backdrop-blur-2xl
shadow-2xl
rounded-3xl
px-4
py-3
border
flex
justify-between
items-center
">

{menuItems.slice(0,5).map((item,index)=>(

<button
key={index}
onClick={()=>sidebarHandler(item.text)}
className={`
w-12
h-12
rounded-2xl
flex
items-center
justify-center
transition

${active===item.text
?"bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110"
:"text-gray-600 hover:bg-gray-100"
}
`}
>
{item.icon}
</button>

))}

</div>

</div>


<CreatePost
open={open}
setOpen={setOpen}
/>

</>
);

}

export default LeftSidebar;