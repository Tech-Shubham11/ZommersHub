import axios from "axios";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import { setSuggestedUsers } from "../redux/authslice";

const useGetSuggestedUsers = ()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSuggestedUser = async()=>{
            try {
                const res = await axios.get('http://localhost:5000/api/v1/user/suggested',{withCredentials:true});
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error); 
            }
        }
        fetchSuggestedUser();
    },[]);
}
export default useGetSuggestedUsers;