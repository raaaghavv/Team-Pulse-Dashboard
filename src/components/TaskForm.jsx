import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignTask } from '../redux/slices/membersSlice';

const TaskForm = () => {
  const dispatch = useDispatch();
  const members = useSelector(state => state.members.list);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId || !taskTitle.trim() || !dueDate) {
      alert('Please select a member, enter a task title, and set a due date.');
      return;
    }
    dispatch(assignTask({ memberId: selectedMemberId, title: taskTitle, dueDate }));
    setTaskTitle('');
    setDueDate('');
    setSelectedMemberId('');
  };

  // Filter out the TeamLead 
  const assignableMembers = members.filter(member => member.role === 'TeamMember');

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginTop: '0', color: '#333' }}>Assign New Task</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="member-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Member:</label>
          <select
            id="member-select"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Select a member --</option>
            {assignableMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="task-title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Title:</label>
          <input
            type="text"
            id="task-title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g., Implement User Authentication"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="due-date" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date:</label>
          <input
            type="date"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;