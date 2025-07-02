import React from "react";
import { useSelector } from "react-redux";
import TeamLeadDashboard from "../components/TeamLeadDashboard";
import TeamMemberDashboard from "../components/TeamMemberDashboard";

const Dashboard = () => {
  const currentRole = useSelector((state) => state.role.currentRole);
  const currentUser = useSelector((state) => state.role.currentUser);

  if (!currentUser) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.1em",
          color: "#666",
        }}
      >
        Loading dashboard content...
      </div>
    );
  }

  return (
    <div
      className="dashboard-page-content-container"
      style={{ padding: "20px" }}
    >
      {currentRole === "TeamLead" ? (
        <TeamLeadDashboard />
      ) : (
        <TeamMemberDashboard />
      )}
    </div>
  );
};

export default Dashboard;
