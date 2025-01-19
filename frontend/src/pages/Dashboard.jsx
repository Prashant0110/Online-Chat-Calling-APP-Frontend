import React, { useState } from "react";
import GroupList from "./GroupList";
import CreateGroup from "./CreateGroup";
import Chatbox from "./ChatBox";

const Dashboard = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleOpenChat = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
        <GroupList onChatSelect={handleOpenChat} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedGroupId ? (
          <Chatbox groupId={selectedGroupId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a group to start chatting</p>
          </div>
        )}
        {/* Floating Create Group Button */}
        <div className="fixed bottom-4 right-4">
          <CreateGroup />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
