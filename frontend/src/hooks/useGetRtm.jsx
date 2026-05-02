
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/chatSlice";


const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
const { messages } = useSelector((store) => store.chat);
  useEffect(() => {
   socket?.on('newMessage',(newMessage)=>{
    dispatch(setMessage([...messages,newMessage]));
   })
   return()=>{
    socket?.off('newMessage');
   }
  },[messages,setMessage]);
}
export default useGetRTM;