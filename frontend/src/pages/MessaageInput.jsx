import React from "react";

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
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
  );
};

export default MessageInput;
