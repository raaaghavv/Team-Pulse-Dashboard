import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchRole, setUser } from "../redux/slices/roleSlice"; 

function Header() {
  const dispatch = useDispatch();
  const { currentRole, currentUser } = useSelector((state) => state.role);
  const allMembers = useSelector((state) => state.members.list);

  const handleRoleToggle = () => {
    if (currentRole === "TeamLead") {
      // Switch to Team Member mode
      const anyTeamMember = allMembers.find((m) => m.role === "TeamMember");
      if (anyTeamMember) {
        dispatch(setUser(anyTeamMember));
        dispatch(switchRole("TeamMember"));
      } else {
        // if no TeamMember found 
        console.warn("No Team Member found to switch to.");
      }
    } else {
      // Switch to Team Lead mode
      const teamLead = allMembers.find((m) => m.role === "TeamLead");
      if (teamLead) {
        dispatch(setUser(teamLead));
        dispatch(switchRole("TeamLead"));
      } else {
        // if no TeamLead found
        console.warn("No Team Lead found to switch to.");
      }
    }
  };

  if (!currentUser) {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Team Pulse Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Loading user info...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Team Pulse Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">
          Logged in as:{" "}
          <span className="font-semibold">{currentUser.name}</span> (
          <span className="font-bold">{currentUser.role}</span>)
        </span>
        <button
          onClick={handleRoleToggle}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
        >
          Switch to {currentRole === "TeamLead" ? "Team Member" : "Team Lead"}{" "}
          View
        </button>
      </div>
    </header>
  );
}

export default Header;
