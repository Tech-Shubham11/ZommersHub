import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // ✅ Only update if message belongs to current chat
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        dispatch(setMessage((prev) => [...prev, newMessage]));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser, dispatch]);
};

export default useGetRTM;