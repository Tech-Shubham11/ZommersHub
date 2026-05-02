import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  Heart,
  MessageCircle,
  Grid3X3,
  Bookmark,
  UserPlus,
  MessageSquare,
  Settings
} from "lucide-react";

import axios from "axios";
import { toast } from "sonner";

import {
  setAuthUser,
  setUserProfile,
  setSelectedUser
} from "../redux/authslice";

import Navbar from "./Navbar";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);

  const profileData = userProfile || {};
  const isOwn = id === user?._id;

  const isFollowing = user?.following?.some(
    (f) => f.toString() === id?.toString()
  );

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://zommershub.onrender.com/api/v1/user/profile/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // ================= FIXED DATA =================
  const posts =
    profileData?.posts ||
    profileData?.post ||
    [];

  const bookmarks = profileData?.bookmarks || [];

  const displayPosts =
    activeTab === "posts" ? posts : bookmarks;

  // ================= FOLLOW HANDLER =================
  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `https://zommershub.onrender.com/api/v1/user/follow/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // update logged user
        const updatedFollowing = isFollowing
          ? user.following.filter(
              (f) => f.toString() !== id.toString()
            )
          : [...(user.following || []), id];

        dispatch(
          setAuthUser({
            ...user,
            following: updatedFollowing
          })
        );

        // update viewed profile instantly
        const updatedFollowers = isFollowing
          ? (profileData?.followers || []).filter(
              (f) => f.toString() !== user._id.toString()
            )
          : [...(profileData?.followers || []), user._id];

        dispatch(
          setUserProfile({
            ...profileData,
            followers: updatedFollowers
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Action failed");
    }
  };

  // ================= MESSAGE =================
  const messageHandler = () => {
    dispatch(setSelectedUser(profileData));
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gray-50 md:ml-[22%]">

      <Navbar />

      {/* COVER */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-[40px]" />

      {/* PROFILE CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-24">

        <div className="bg-white shadow-xl rounded-3xl p-6 md:p-10">

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            <Avatar className="h-28 w-28 md:h-36 md:w-36">
              <AvatarImage src={profileData?.profilePhoto} />
              <AvatarFallback>
                {profileData?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">

              <h1 className="text-2xl md:text-4xl font-bold">
                {profileData?.username}
              </h1>

              <p className="text-gray-500 mt-2">
                {profileData?.bio || "No bio available"}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-4 flex-wrap justify-center md:justify-start">

                {isOwn ? (
                  <Link to="/account/edit">
                    <Button>
                      <Settings size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button
                      onClick={handleFollow}
                      className={
                        isFollowing
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }
                    >
                      <UserPlus size={16} className="mr-2" />
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={messageHandler}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </Button>
                  </>
                )}

              </div>

              {/* STATS */}
              <div className="flex gap-8 mt-6 justify-center md:justify-start">

                <div>
                  <h2 className="font-bold">{posts.length}</h2>
                  <p className="text-gray-500 text-sm">Posts</p>
                </div>

                <div>
                  <h2 className="font-bold">
                    {profileData?.followers?.length || 0}
                  </h2>
                  <p className="text-gray-500 text-sm">Followers</p>
                </div>

                <div>
                  <h2 className="font-bold">
                    {profileData?.following?.length || 0}
                  </h2>
                  <p className="text-gray-500 text-sm">Following</p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="sticky top-0 z-10 bg-white border-b mt-8">

        <div className="flex justify-center gap-10">

          <button
            onClick={() => setActiveTab("posts")}
            className={`py-4 flex items-center gap-2 font-semibold border-b-2 ${
              activeTab === "posts"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            <Grid3X3 size={18}/> Posts
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`py-4 flex items-center gap-2 font-semibold border-b-2 ${
              activeTab === "bookmarks"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            <Bookmark size={18}/> Saved
          </button>

        </div>
      </div>

      {/* ================= POSTS GRID ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

            {displayPosts.map((post) => (
              <div
                key={post._id}
                className="group relative rounded-2xl overflow-hidden"
              >

                <img
                  src={post?.imageUrl || post?.image}
                  alt=""
                  className="w-full aspect-square object-cover group-hover:scale-110 transition"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white">

                  <div className="flex gap-1 items-center">
                    <Heart size={18}/> {post?.likes?.length || 0}
                  </div>

                  <div className="flex gap-1 items-center">
                    <MessageCircle size={18}/> {post?.comments?.length || 0}
                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold">
              {activeTab === "posts"
                ? "No Posts Yet"
                : "No Saved Posts"}
            </h2>
          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;