import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userId, setUserId] = useState(""); // Replace with your authenticated user's ID
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage or another source

  // Set the userId (if available in localStorage or token payload)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserId(user._id);
  }, []);

  // Fetch all groups
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
      } catch (error) {
        console.error("Error fetching groups:", error.message);
      }
    };

    fetchGroups();
  }, [token]);

  // Join a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/groups/join/${groupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Joined the group successfully");
      setSelectedGroup(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error joining group");
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/groups/leave/${groupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Left the group successfully");
      setSelectedGroup(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error leaving group");
    }
  };

  // Create a new group
  const handleCreateGroup = async () => {
    if (!groupName) {
      alert("Group name is required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/groups/creategroup",
        {
          name: groupName,
          description: groupDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Group created successfully!");
      setGroups([...groups, response.data]); // Update group list with the new group
      setGroupName("");
      setGroupDescription("");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating group");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid #ddd",
          padding: "1rem",
        }}
      >
        <h3>Groups</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {groups.map((group) => (
            <li
              key={group._id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() => setSelectedGroup(group)}
            >
              {group.name}
            </li>
          ))}
        </ul>

        {/* Create Group Form */}
        <div style={{ marginTop: "1rem" }}>
          <h4>Create Group</h4>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ddd",
            }}
          />
          <textarea
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ddd",
            }}
          ></textarea>
          <button
            onClick={handleCreateGroup}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Chatbox */}
      <div style={{ flex: 1, padding: "1rem" }}>
        {selectedGroup ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <h2>{selectedGroup.name}</h2>
            <p>{selectedGroup.description || "No description available"}</p>
            <div style={{ marginTop: "1rem" }}>
              {selectedGroup.members.some((member) => member._id === userId) ? (
                <button
                  onClick={() => handleLeaveGroup(selectedGroup._id)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Leave Group
                </button>
              ) : (
                <button
                  onClick={() => handleJoinGroup(selectedGroup._id)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Select a group to view its details and chat.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
