import { useContext, useEffect, useState } from "react";
import { Menu, Users } from "lucide-react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton";
import SearchModal from "./SearchModal";

export default function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useContext(ChatContext);
  const { user, onlineUsers } = useContext(AuthContext);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchModal , setSearchModal] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  // exculde curr user 
  const filteredUsers = showOnlineOnly 
    ? users.filter((u) => onlineUsers.includes(u._id) && u._id !== user._id) 
    : users.filter((u) => u._id !== user._id);

  if(isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <Users className="size-6 hidden lg:block" />
          <span className="font-medium hidden lg:block">Contacts</span>
          <div className="dropdown">
            <div tabIndex={0} role="button">
            <Menu className="size-6" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow">
              <li><a onClick={()=> setSearchModal(true)} >add new friend</a></li>
              <li><a onClick={()=> setSearchModal(true)}>Search a user</a></li>
            </ul>
          </div>
        </div>

        <SearchModal searchModal={searchModal} setSearchModal={setSearchModal} />

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.image || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <p className="text-xs text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};