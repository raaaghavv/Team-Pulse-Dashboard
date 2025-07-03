import React from 'react';

const MemberCard = ({ member }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return '#28a745'; // Green
      case 'Offline': return '#ffc107'; // Yellow
      case 'In Meeting': return '#dc3545'; // Red
      case 'On Break': return '#007bff'; // Blue 
      default: return '#6c757d'; // Gray
    }
  };

  const totalTasks = member.tasks.length;
  const completedTasks = member.tasks.filter(task => task.isCompleted).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(0) : 0;

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      backgroundColor: '#fefefe',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={member.picture} alt={member.name} style={{ borderRadius: '50%', width: '50px', height: '50px', objectFit: 'cover' }} />
        <h3 style={{ margin: '0', color: '#333', fontSize: '1.2em' }}>{member.name}</h3>
      </div>
      <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>Email: {member.email}</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Status:</span>
        <span style={{
          backgroundColor: getStatusColor(member.currentStatus),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          {member.currentStatus}
        </span>
      </div>
      <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>
        Tasks Completed: {completedTasks}/{totalTasks} ({completionPercentage}%)
      </p>
    </div>
  );
};

export default MemberCard;