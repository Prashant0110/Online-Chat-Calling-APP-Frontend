import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useSocket from "../services/useSocket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import Peer from "peerjs";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLISHABLE_KEY"); // Replace with your Stripe publishable key

const ChatBox = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [peer, setPeer] = useState(null); // Peer instance
  const [call, setCall] = useState(null); // Current call instance
  const [localStream, setLocalStream] = useState(null); // Local media stream
  const [isPremiumUser, setIsPremiumUser] = useState(false); // Track premium status

  const ringTone = new Audio(
    "/mp3/arash-broken-angel-ringtone-sad-ringtone-720p-00-61932-63588.mp3"
  );

  const socket = useSocket(groupId);

  // Fetch messages when the component mounts or groupId changes
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
        console.error(
          "Error fetching messages:",
          error.response?.data || error.message
        );
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

    // Listen for callUser events
    socket.on("callUser", ({ peerId }) => {
      ringTone.play(); // Play ringtone when a call is received
      const acceptCall = window.confirm(
        "Incoming call! Do you want to accept?"
      );
      if (acceptCall) {
        // Answer the call with the local stream
        const incomingCall = peer.call(peerId, localStream);
        incomingCall.on("stream", (remoteStream) => {
          const videoElement = document.getElementById("remoteVideo");
          videoElement.srcObject = remoteStream; // Display remote stream
          videoElement.classList.remove("hidden"); // Make sure the video is visible
        });
      }
    });

    // Clean up socket listeners
    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("callUser");
    };
  }, [groupId, socket]);

  // Initialize Peer.js
  useEffect(() => {
    const peerInstance = new Peer(); // Create a new Peer instance
    setPeer(peerInstance);

    peerInstance.on("open", (id) => {
      console.log("Peer ID:", id); // Log the peer ID for debugging
    });

    peerInstance.on("call", (incomingCall) => {
      const acceptCall = window.confirm(
        "Incoming call! Do you want to accept?"
      );
      if (acceptCall) {
        incomingCall.answer(localStream);
        incomingCall.on("stream", (remoteStream) => {
          const videoElement = document.getElementById("remoteVideo");
          videoElement.srcObject = remoteStream;
          videoElement.classList.remove("hidden");
        });
      } else {
        incomingCall.close();
      }
    });

    return () => {
      peerInstance.destroy(); // Clean up the peer instance on unmount
    };
  }, [localStream]);

  // Check if the user is a premium user
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/user/is-premium",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsPremiumUser(response.data.isPremium);
      } catch (error) {
        console.error(
          "Error checking premium status:",
          error.response?.data || error.message
        );
      }
    };

    checkPremiumStatus();
  }, []);

  // Handle Stripe payment
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const token = localStorage.getItem("token");

      // Create a Stripe Checkout session
      const response = await axios.post(
        "http://localhost:3000/api/stripe/create-checkout-session",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sessionId = response.data.sessionId;

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error(
        "Error processing payment:",
        error.response?.data || error.message
      );
      alert("Failed to process payment.");
    }
  };

  // Start a video call
  const handleStartCall = async () => {
    if (!isPremiumUser) {
      handlePayment(); // Redirect to Stripe payment if not a premium user
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Display local stream
      const localVideoElement = document.getElementById("localVideo");
      localVideoElement.srcObject = stream;
      localVideoElement.classList.remove("hidden");

      // Notify other group members about the call
      socket.emit("callUser", {
        groupId,
        userId: localStorage.getItem("userId"),
        peerId: peer.id,
      });

      // Create a call
      const call = peer.call("other-peer-id", stream); // Replace "other-peer-id" with the actual peer ID
      call.on("stream", (remoteStream) => {
        const videoElement = document.getElementById("remoteVideo");
        videoElement.srcObject = remoteStream;
        videoElement.classList.remove("hidden");
      });
      setCall(call);
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Failed to start the call.");
    }
  };

  // Start an audio call
  const handleStartAudioCall = async () => {
    if (!isPremiumUser) {
      handlePayment(); // Redirect to Stripe payment if not a premium user
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);

      // Notify other group members about the call
      socket.emit("callUser", {
        groupId,
        userId: localStorage.getItem("userId"),
        peerId: peer.id,
      });

      // Create a call
      const call = peer.call("other-peer-id", stream); // Replace "other-peer-id" with the actual peer ID
      call.on("stream", (remoteStream) => {
        // Handle remote audio stream
      });
      setCall(call);
    } catch (error) {
      console.error("Error starting audio call:", error);
      alert("Failed to start the audio call.");
    }
  };

  // End the current call
  const handleEndCall = () => {
    if (call) {
      call.close();
      setCall(null);
      const videoElement = document.getElementById("remoteVideo");
      videoElement.srcObject = null;
      videoElement.classList.add("hidden");
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    }
  };

  return (
    <>
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
            onKeyDown={handleTyping}
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
          {call ? (
            <button
              onClick={handleEndCall}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              End Call
            </button>
          ) : (
            <>
              <button
                onClick={handleStartCall}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faVideo} /> Video Call
              </button>
              <button
                onClick={handleStartAudioCall}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPhone} /> Audio Call
              </button>
            </>
          )}
        </div>

        {/* Video Elements for Local and Remote Streams */}
        <video id="localVideo" autoPlay playsInline className="hidden" />
        <video id="remoteVideo" autoPlay playsInline className="hidden" />
      </div>
    </>
  );
};

export default ChatBox;
