import React from "react";
import { useSelector } from "react-redux";
import SuggestedUser from "./SuggestedUser";
import { Search as SearchIcon } from "lucide-react";

function Search() {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">

      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b lg:ml-75 px-2 py-2">

    <div className="bg-white/80 backdrop-blur-xl border shadow-lg rounded-3xl p-5">

            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">
                Suggested for you
              </h2>

              <button className="text-sm text-indigo-600 hover:underline">
                See all
              </button>
            </div>

      </div>
      </div>

      {/* ===== SCROLLABLE USER LIST ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        <div className="max-w-3xl mx-auto space-y-4">

          {suggestedUsers?.length > 0 ? (
            suggestedUsers.map((user) => (
              <SuggestedUser key={user._id} user={user} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              No users found
            </div>
          )}

        </div>

      </div>

    </div>
  

  )
}

export default Search;
