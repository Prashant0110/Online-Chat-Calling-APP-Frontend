import React from "react";

const MessageInput = ({ content, setContent, handleSendMessage }) => {
  return (
    <form onSubmit={handleSendMessage} className="flex items-center mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Type your message"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
