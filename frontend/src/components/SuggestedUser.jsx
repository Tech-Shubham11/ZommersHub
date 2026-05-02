import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

function SuggestedUser({ user }) {
  return (
    <div className="
      bg-white
      border
      rounded-2xl
      p-4
      flex items-center gap-4
      shadow-sm
      hover:shadow-md
      hover:-translate-y-1
      transition
    ">

      <Link to={`/profile/${user?._id}`}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.profilePhoto} />
          <AvatarFallback>
            {user?.username?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${user?._id}`}
          className="font-semibold text-sm block truncate hover:text-indigo-600"
        >
          {user?.username}
        </Link>

        <p className="text-gray-500 text-xs truncate">
          {user?.bio || "No bio available"}
        </p>
      </div>

    </div>
  );
}

export default SuggestedUser;

