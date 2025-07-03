import React from 'react';
import { useDispatch } from 'react-redux';
import { updateMemberStatus } from '../redux/slices/membersSlice';

const StatusSelector = ({ memberId, currentStatus }) => {
  const dispatch = useDispatch();

  const statuses = ['Working', 'Offline', 'In Meeting', 'On Break']; 

  const handleStatusChange = (newStatus) => {
    dispatch(updateMemberStatus({ memberId, status: newStatus })); 
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      margin: '20px 0',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginTop: '0', color: '#333' }}>Update Your Status</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            style={{
              padding: '10px 15px',
              backgroundColor: currentStatus === status ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: currentStatus === status ? 'bold' : 'normal',
              flexGrow: 1, 
              minWidth: '100px'
            }}
          >
            {status}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9em', marginTop: '15px', color: '#555' }}>
        Current Status: <span style={{ fontWeight: 'bold' }}>{currentStatus}</span>
      </p>
    </div>
  );
};

export default StatusSelector;