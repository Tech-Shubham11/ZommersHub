import Chatpage from "./components/Chatpage.jsx";
import EditProfile from "./components/EditProfile.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/login.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Profile from "./components/profile.jsx";
import Signup from "./components/signup.jsx";

import { io } from "socket.io-client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice.js";
import { setChatUser } from "./redux/chatSlice.js";
import Search from "./components/Search.jsx";
import { setLikeNotification } from "./redux/rtnSlice.js";
import ProtectedRouted from "./components/protectedRouted.jsx";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRouted><MainLayout/></ProtectedRouted>  ,
    children: [
      {
        path: "/",
        element:<ProtectedRouted><Home/></ProtectedRouted> ,
      },
      {
        path: "/profile/:id",
        element:<ProtectedRouted><Profile/></ProtectedRouted> ,
      },
      {
        path: "/account/edit",
        element:<ProtectedRouted><EditProfile/></ProtectedRouted> ,
      },
      {
        path: "/chat",
        element: <ProtectedRouted><Chatpage/></ProtectedRouted>,
      },{
        path: "/search",
        element:<ProtectedRouted><Search/></ProtectedRouted> ,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setChatUser(onlineUsers)); // ✅ FIXED
      });

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;


