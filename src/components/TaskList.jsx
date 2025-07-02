import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskProgress } from '../redux/slices/membersSlice';

const TaskList = ({ tasks, memberId }) => {
  const dispatch = useDispatch();

  const handleProgressChange = (taskId, change) => {
    dispatch(updateTaskProgress({ memberId, taskId, increment: change }));
  };

  if (!tasks || tasks.length === 0) {
    return <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No tasks assigned yet.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#333' }}>Your Tasks</h3>
      {tasks.map(task => (
        <div key={task.taskId} style={{
          border: '1px solid #eee',
          borderRadius: '6px',
          padding: '15px',
          margin: '10px 0',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <h4 style={{ margin: '0 0 8px', color: '#555' }}>{task.title}</h4>
          <p style={{ margin: '0 0 10px', fontSize: '0.9em', color: '#777' }}>Due Date: {task.dueDate}</p>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', fontWeight: 'bold' }}>Progress: {task.progress}%</label>
            <div style={{
              width: '100%',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${task.progress}%`,
                height: '10px',
                backgroundColor: task.isCompleted ? '#28a745' : '#007bff',
                borderRadius: '5px'
              }}></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleProgressChange(task.taskId, -10)}
              disabled={task.progress === 0}
              style={{
                padding: '8px 12px', backgroundColor: '#dc3545', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer',
                opacity: task.progress === 0 ? 0.6 : 1
              }}
            >
              -10%
            </button>
            <button
              onClick={() => handleProgressChange(task.taskId, 10)}
              disabled={task.progress === 100}
              style={{
                padding: '8px 12px', backgroundColor: '#28a745', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer',
                opacity: task.progress === 100 ? 0.6 : 1
              }}
            >
              +10%
            </button>
            {task.isCompleted && <span style={{ marginLeft: 'auto', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', fontSize: '0.8em' }}>COMPLETED</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;