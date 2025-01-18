import React from "react";

const GroupsList = ({ groups, selectedGroup, handleJoinGroup }) => {
  return (
    <div
      style={{ width: "30%", padding: "1rem", borderRight: "1px solid #ddd" }}
    >
      <h3>Groups</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map((group) => (
          <li
            key={group._id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{group.name}</span>
            {!selectedGroup || selectedGroup._id !== group._id ? (
              <button
                onClick={() => handleJoinGroup(group._id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Join
              </button>
            ) : (
              <span style={{ color: "green" }}>Joined</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsList;
