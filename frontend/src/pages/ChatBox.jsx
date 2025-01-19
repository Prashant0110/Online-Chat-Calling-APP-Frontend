import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbox = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chats/getchat/${groupId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chats/sendchat",
        {
          content,
          groupId,
        }
      );
      setMessages([...messages, response.data]);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <div key={message._id} className="flex items-center space-x-2">
            <div className="font-semibold text-sm">
              {message.sender.username}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
