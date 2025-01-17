import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected group
  const [messages, setMessages] = useState([]); // Messages in the current chat
  const [newMessage, setNewMessage] = useState(""); // New message input
  const token = localStorage.getItem("token"); // User's token for authorization

  useEffect(() => {
    // Fetch groups on component load
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

  const handleJoinGroup = async (groupId) => {
    // Join the group
    try {
      await axios.post(
        `http://localhost:3000/api/groups/join/${groupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const group = groups.find((g) => g._id === groupId);
      setSelectedGroup(group);
      alert("Successfully joined the group!");
    } catch (error) {
      alert(error.response?.data?.message || "Error joining the group");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    // Leave the group
    try {
      await axios.post(
        `http://localhost:3000/api/groups/leave/${groupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedGroup(null);
      alert("You have left the group.");
    } catch (error) {
      alert(error.response?.data?.message || "Error leaving the group");
    }
  };

  const fetchMessages = async (groupId) => {
    // Fetch messages for the selected group
    try {
      const response = await axios.get(
        `http://localhost:3000/api/groups/messages/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleSendMessage = async () => {
    // Send a new message
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/groups/messages/${selectedGroup._id}`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending the message");
    }
  };

  useEffect(() => {
    // Fetch messages when a group is selected
    if (selectedGroup) fetchMessages(selectedGroup._id);
  }, [selectedGroup]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for Groups */}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{group.name}</span>
              {!selectedGroup || selectedGroup._id !== group._id ? (
                <button
                  onClick={() => handleJoinGroup(group._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Join
                </button>
              ) : (
                <span style={{ color: "green" }}>Joined</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat UI */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        {selectedGroup ? (
          <>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2>{selectedGroup.name}</h2>
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
                Leave Room
              </button>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection:
                        msg.senderId === "currentUserId"
                          ? "row-reverse"
                          : "row",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor:
                          msg.senderId === "currentUserId" ? "#4caf50" : "#ddd",
                        color:
                          msg.senderId === "currentUserId" ? "#fff" : "#000",
                        borderRadius: "10px",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#999" }}>
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>

            {/* Message Input */}
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px 0 0 5px",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0 5px 5px 0",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Join a group to start chatting.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
