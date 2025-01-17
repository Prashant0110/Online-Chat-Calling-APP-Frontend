import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []); // Fetch groups on component mount

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/groups/getgroup",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setLoading(false);
    }
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/groups/creategroup",
        {
          name: groupName,
          description: groupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGroups([...groups, response.data]);
      setIsCreatingGroup(false);
      setGroupName("");
      setGroupDescription("");
      fetchGroups(); // Refresh groups after creating a new one
      setLoading(false);
    } catch (error) {
      console.error("Error creating group:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage(""); // Reset message field
      // Assuming you have an API endpoint to send messages, use it here
      // const response = await axios.post('/api/messages', { message, groupId: selectedGroup._id });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-full sm:w-1/4 lg:w-1/3 xl:w-1/4 bg-gray-800 text-white p-6 shadow-lg overflow-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-6">Groups</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col space-y-4 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => selectGroup(group)}
                className={`p-4 cursor-pointer rounded-md transition duration-300 ${
                  selectedGroup === group
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-400">
                  Members: {group.members.length}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsCreatingGroup(true)}
          className="mt-6 p-3 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
        >
          Create Group
        </button>

        {isCreatingGroup && (
          <form
            onSubmit={handleCreateGroup}
            className="mt-6 p-4 bg-white shadow-lg rounded-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Group Description
              </label>
              <textarea
                placeholder="Enter group description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Group
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingGroup(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right Content */}
      <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-3/4 bg-white p-6 overflow-auto">
        {selectedGroup ? (
          <div>
            <h2 className="text-3xl font-semibold mb-6">
              {selectedGroup.name}
            </h2>
            <p>Description: {selectedGroup.description}</p>
            <p>ID: {selectedGroup._id}</p> {/* Display ID */}
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Select a group to start chatting.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
