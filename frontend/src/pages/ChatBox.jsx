import React from "react";

const ChatBox = ({ messages, selectedGroup, handleLeaveGroup }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
          Leave Group
        </button>
      </div>

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
                  msg.senderId === "currentUserId" ? "row-reverse" : "row",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  backgroundColor:
                    msg.senderId === "currentUserId" ? "#4caf50" : "#ddd",
                  color: msg.senderId === "currentUserId" ? "#fff" : "#000",
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
    </div>
  );
};

export default ChatBox;
