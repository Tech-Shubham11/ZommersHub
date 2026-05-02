import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, MoreHorizontal } from "lucide-react";

function Comment({ comment }) {
  return (
    <div className="w-full py-2">
      <div className="rounded-2xl border bg-white shadow-sm p-4 hover:shadow-md transition">

        <div className="flex gap-3">

          {/* Avatar */}
          <Link to={`/profile/${comment?.author?._id}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={comment?.author?.profilePhoto}/>
              <AvatarFallback>
                {comment?.author?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Content */}
          <div className="flex-1">

            <div className="flex justify-between items-center">
              {/* <Link
                to={`/profile/${comment?.author?._id}`}
                className="font-semibold text-sm hover:text-indigo-600"
              >
                @{comment?.author?.username}
              </Link> */}

              {/* <MoreHorizontal size={16}/>
            

            <p className="text-xs text-gray-400 mt-1">
              2 min ago
            </p> */}
</div>
            <p className="mt-2 text-sm text-gray-800 break-words">
              {comment?.text}
            </p>

            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <button className="flex gap-1 items-center hover:text-red-500">
                <Heart size={14}/> Like
              </button>
              <button className="hover:text-indigo-600">
                Reply
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Comment;