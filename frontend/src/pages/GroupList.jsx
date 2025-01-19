import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupList = ({ onChatSelect }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingGroupId, setProcessingGroupId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token"); // Authentication Token
        const { data } = await axios.get(
          "http://localhost:3000/api/groups/getgroup",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send Auth Token to get groups
            },
          }
        );

        // Store groups in the state
        setGroups(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load groups");
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const updateGroupMembership = (groupId, isJoining) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group._id === groupId ? { ...group, isJoined: isJoining } : group
      )
    );
  };

  const handleGroupAction = async (groupId, action) => {
    setProcessingGroupId(groupId);
    try {
      const token = localStorage.getItem("token"); // Auth token

      const endpoint =
        action === "join"
          ? `http://localhost:3000/api/groups/join/${groupId}`
          : `http://localhost:3000/api/groups/leave/${groupId}`;

      // Send Auth token in the header to perform action on the group
      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send Auth Token
          },
        }
      );

      updateGroupMembership(groupId, action === "join");
      alert(`You have ${action === "join" ? "joined" : "left"} the group`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} the group`);
    } finally {
      setProcessingGroupId(null);
    }
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ul className="space-y-2">
      {groups.map((group) => (
        <li
          key={group._id} // Use group._id for unique key
          className="flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-sm"
        >
          <div>
            <h3 className="font-bold">{group.name}</h3>
            <p className="text-gray-600 text-sm">{group.description}</p>
          </div>
          <div className="flex space-x-2">
            {group.isJoined ? (
              <>
                <button
                  onClick={() => handleGroupAction(group._id, "leave")}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                  disabled={processingGroupId === group._id}
                >
                  {processingGroupId === group._id ? "Processing..." : "Leave"}
                </button>
                <button
                  onClick={() => onChatSelect(group._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Chat
                </button>
              </>
            ) : (
              <button
                onClick={() => handleGroupAction(group._id, "join")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={processingGroupId === group._id}
              >
                {processingGroupId === group._id ? "Processing..." : "Join"}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
