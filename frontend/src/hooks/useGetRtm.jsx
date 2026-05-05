import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // ✅ IMPORTANT: use functional update to avoid stale state
      dispatch(setMessage((prev) => [...prev, newMessage]));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, dispatch]); // ✅ FIXED dependencies
};

export default useGetRTM;