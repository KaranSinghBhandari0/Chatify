import { X, EllipsisVertical, Trash  } from "lucide-react";
import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser, clearChat } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.image || "/avatar.png"} alt={selectedUser.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.username}</h3>
            <p className="text-xs text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* dopdown button */}
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" className="p-1 focus:outline-none" >
              <EllipsisVertical className="h-6 w-5" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <p onClick={()=> clearChat()}> Clear Chat <Trash className="h-4 w-4" /> </p>
                <p> Block </p>
                <p> Report </p>
              </li>
            </ul>
          </div>

          {/* close btn */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
        
      </div>
    </div>
)};