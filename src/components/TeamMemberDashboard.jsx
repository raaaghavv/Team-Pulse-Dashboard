// src/components/TeamMemberDashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import StatusSelector from './StatusSelector';
import TaskList from './TaskList';

const TeamMemberDashboard = () => {
  const currentUser = useSelector((state) => state.role.currentUser);
  const members = useSelector((state) => state.members.list);
  const membersStatus = useSelector((state) => state.members.status);

  if (membersStatus === 'loading' || !currentUser) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your dashboard...</div>;
  }

  // Find the current member's details from the members list
  const currentMemberDetails = members.find(m => m.id === currentUser.id);

  if (!currentMemberDetails) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Could not find your member details.</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
      <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Welcome, {currentUser.name}! (Team Member)</h2>

      <StatusSelector
        memberId={currentMemberDetails.id}
        currentStatus={currentMemberDetails.currentStatus}
      />

      <TaskList
        tasks={currentMemberDetails.tasks}
        memberId={currentMemberDetails.id}
      />
    </div>
  );
};

export default TeamMemberDashboard;