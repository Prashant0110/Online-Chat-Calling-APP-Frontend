import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError("Please provide both name and description");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/groups/creategroup",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Group created successfully");
      setError("");

      // Redirect to the group chat page
      navigate(`/group/${response.data._id}`);
    } catch (err) {
      setError("Error creating group");
      console.error("Error creating group:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold">Create a New Group</h2>
      {success && <div className="text-green-500 mt-2">{success}</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          placeholder="Group Name"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded mt-4"
          placeholder="Group Description"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 mt-4 rounded hover:bg-blue-600"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
