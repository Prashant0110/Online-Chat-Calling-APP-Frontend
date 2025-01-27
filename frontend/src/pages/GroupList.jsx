import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupList = ({ onChatSelect, groups, handleJoinGroup, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingGroupId, setProcessingGroupId] = useState(null);

  const handleLeaveGroup = async (groupId) => {
    setProcessingGroupId(groupId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/groups/leave/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the group's joined status locally
      const updatedGroups = groups.map((group) =>
        group._id === groupId ? { ...group, isJoined: false } : group
      );
      onChatSelect(null); // Deselect the group if the user leaves it
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to leave the group");
    } finally {
      setProcessingGroupId(null);
    }
  };

  const handleGroupSelect = (groupId) => {
    console.log("Group selected:", groupId); // Debugging log
    onChatSelect(groupId); // Call the function passed from Dashboard
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ul className="space-y-4">
      {groups.map((group) => (
        <li
          key={group._id}
          className="flex justify-between items-center p-4 bg-gray-200 rounded-md shadow hover:bg-gray-300"
        >
          <div>
            <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.description}</p>
          </div>
          <div className="flex space-x-2">
            {group.isJoined ? (
              <>
                <button
                  onClick={() => handleGroupSelect(group._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Chat
                </button>
                <button
                  onClick={() => handleLeaveGroup(group._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Leave
                </button>
              </>
            ) : (
              <button
                onClick={() => handleJoinGroup(group._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Join
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
