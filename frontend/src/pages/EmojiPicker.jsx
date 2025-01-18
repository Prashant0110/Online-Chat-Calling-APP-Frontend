import React from "react";

const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🙌", "😭", "🔥"];

  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        padding: "10px",
        backgroundColor: "#f1f1f1",
        borderRadius: "5px",
      }}
    >
      {emojis.map((emoji) => (
        <span
          key={emoji}
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiPicker;
