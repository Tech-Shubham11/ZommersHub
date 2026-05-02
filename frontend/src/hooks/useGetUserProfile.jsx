import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://zommershub.onrender.com/api/v1/user/profile/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          // 🔥 IMPORTANT FIX HERE
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, dispatch]);
};

export default useGetUserProfile;