import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useSocket from "../services/useSocket"; // Import the custom hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";

const ChatBox = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const socket = useSocket(groupId); // Use the custom hook

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/chats/getchat/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for typing events
    socket.on("typing", ({ username }) => {
      if (username !== localStorage.getItem("username")) {
        setIsTyping(true);
        setTypingUser(username);
      }
    });

    // Listen for stop typing events
    socket.on("stop-typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [groupId, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/chats/sendchat",
        { content, groupId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      socket.emit("sendMessage", response.data);
      setContent("");
      setIsTyping(false);
      socket.emit("stop-typing", groupId);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit("typing", {
        groupId,
        username: localStorage.getItem("username"),
      });

      setTimeout(() => socket.emit("stop-typing", groupId), 3000);
      setIsTyping(true);
    }
  };

  const handleStartCall = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/chats/call",
        { groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response from call endpoint:", response); // Log the response

      if (response.status === 200) {
        // Redirect to Stripe Checkout
        const stripe = window.Stripe("your_stripe_public_key"); // Replace with your Stripe public key
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId, // Assuming you return a sessionId from your backend
        });

        if (error) {
          alert(error.message);
        }
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "You need a premium account to make calls."
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === localStorage.getItem("userId")
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {!(message.sender._id === localStorage.getItem("userId")) && (
              <span className="text-sm text-gray-600 font-semibold mr-2">
                {message.sender.username}
              </span>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg shadow ${
                message.sender._id === localStorage.getItem("userId")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <p className="text-sm italic text-gray-500">
            {typingUser || "Someone"} is typing...
          </p>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message..."
          className="flex-grow p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />

        <button
          type="submit"
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {/* Call Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleStartCall}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faPhone} /> Call
        </button>
        <button
          onClick={handleStartCall}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faVideo} /> Video Call
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
