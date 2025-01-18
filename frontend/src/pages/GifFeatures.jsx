import React from "react";

const GifPicker = ({ onGifSelect }) => {
  const gifs = [
    "https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif",
    "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  ];

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
      {gifs.map((gif) => (
        <img
          key={gif}
          src={gif}
          alt="GIF"
          style={{ height: "50px", cursor: "pointer" }}
          onClick={() => onGifSelect(gif)}
        />
      ))}
    </div>
  );
};

export default GifPicker;
