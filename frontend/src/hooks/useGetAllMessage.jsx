import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    // ✅ Stop if no selected user
    if (!selectedUser?._id) return;

    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setMessage(res.data.messages));
        }
      } catch (error) {
        console.error(
          error.response?.data?.message || error.message
        );
      }
    };

    fetchAllMessage();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessage;