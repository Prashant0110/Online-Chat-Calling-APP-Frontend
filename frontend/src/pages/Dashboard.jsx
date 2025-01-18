import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupsList from "./GroupList";
import ChatBox from "./ChatBox";
import MessageInput from "./MessaageInput";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

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

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const group = groups.find((g) => g._id === groupId);
      setSelectedGroup(group);
      alert("Successfully joined the group!");
    } catch (error) {
      alert(error.response?.data?.message || "Error joining the group");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/groups/leave/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedGroup(null);
      alert("You have left the group.");
    } catch (error) {
      alert(error.response?.data?.message || "Error leaving the group");
    }
  };

  const fetchMessages = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chats/getchat/${groupId}`,
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
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/chats/sendchat`,
        { text: newMessage, groupId: selectedGroup._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending the message");
    }
  };

  useEffect(() => {
    if (selectedGroup) fetchMessages(selectedGroup._id);
  }, [selectedGroup]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <GroupsList
        groups={groups}
        selectedGroup={selectedGroup}
        handleJoinGroup={handleJoinGroup}
      />
      {selectedGroup ? (
        <div style={{ flex: 1 }}>
          <ChatBox
            messages={messages}
            selectedGroup={selectedGroup}
            handleLeaveGroup={handleLeaveGroup}
          />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Join a group to start chatting.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
