import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupList from "./GroupList";
import ChatBox from "./ChatBox";
import PremiumPage from "./PremiumPage";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showPremiumPage, setShowPremiumPage] = useState(false);
  const token = localStorage.getItem("token");
  let userId = null;

  // Extract user ID from token
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    userId = payload.id; // Assuming user ID is stored under 'id'
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/groups/getgroup",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGroups(response.data);
        console.log("Fetched Groups:", response.data); // Debugging log
      } catch (error) {
        console.error("Error fetching groups:", error.message);
      }
    };

    fetchGroups();
  }, [token]);

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const group = groups.find((g) => g._id === groupId);
      setSelectedGroup(group);
      console.log("Joined Group:", group); // Debugging log
      alert("Successfully joined the group!");
    } catch (error) {
      alert(error.response?.data?.message || "Error joining the group");
    }
  };

  const handleOpenChat = (groupId) => {
    const group = groups.find((g) => g._id === groupId);
    setSelectedGroup(group);
    console.log("Opened Chat for Group:", group); // Debugging log
  };

  const handleStartCall = () => {
    setShowPremiumPage(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Your Groups
        </h2>
        <GroupList
          onChatSelect={handleOpenChat}
          groups={groups}
          handleJoinGroup={handleJoinGroup}
          userId={userId}
        />
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <ChatBox groupId={selectedGroup._id} onStartCall={handleStartCall} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a group to start chatting</p>
          </div>
        )}
      </div>

      {/* Premium Page for Payment */}
      {showPremiumPage && (
        <PremiumPage onClose={() => setShowPremiumPage(false)} />
      )}
    </div>
  );
};

export default Dashboard;
