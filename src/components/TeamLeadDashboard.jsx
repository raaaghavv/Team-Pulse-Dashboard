import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import MemberCard from './MemberCard';
import TaskForm from './TaskForm';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TeamLeadDashboard = () => {
  const members = useSelector((state) => state.members.list);
  const membersStatus = useSelector((state) => state.members.status);
  const membersError = useSelector((state) => state.members.error);

  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); 

  // Filter out the TeamLead from the list 
  const teamMembersOnly = useMemo(() => members.filter(m => m.role === 'TeamMember'), [members]);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = [...teamMembersOnly]; // teamMembersOnly for monitor

    if (filterStatus !== 'All') {
      filtered = filtered.filter(member => member.currentStatus === filterStatus);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'taskCompletion') {
        const aCompleted = a.tasks.filter(t => t.isCompleted).length;
        const bCompleted = b.tasks.filter(t => t.isCompleted).length;
        const aTotal = a.tasks.length || 1;
        const bTotal = b.tasks.length || 1;
        comparison = (aCompleted / aTotal) - (bCompleted / bTotal);
      } else if (sortBy === 'totalTasks') {
        comparison = a.tasks.length - b.tasks.length;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [teamMembersOnly, filterStatus, sortBy, sortOrder]);

  const calculateSummary = useMemo(() => {
    const totalRegisteredUsers = members.length;
    const totalTeamMembers = teamMembersOnly.length;
    const workingMembers = teamMembersOnly.filter(m => m.currentStatus === 'Working').length;
    const offlineMembers = teamMembersOnly.filter(m => m.currentStatus === 'Offline').length;
    const MeetingMembers = teamMembersOnly.filter(m => m.currentStatus === 'In Meeting').length;
    const breakMembers = teamMembersOnly.filter(m => m.currentStatus === 'On Break').length;


    let totalTasksAssigned = 0;
    let totalTasksCompleted = 0;
    teamMembersOnly.forEach(member => { // Only count tasks for TeamMembers
      totalTasksAssigned += member.tasks.length;
      totalTasksCompleted += member.tasks.filter(task => task.isCompleted).length;
    });

    return {
      totalRegisteredUsers,
      totalTeamMembers,
      workingMembers,
      offlineMembers,
      MeetingMembers,
      breakMembers,
      totalTasksAssigned,
      totalTasksCompleted,
    };
  }, [members, teamMembersOnly]);

  const {
    totalRegisteredUsers,
    totalTeamMembers,
    workingMembers,
    offlineMembers,
    MeetingMembers,
    breakMembers,
    totalTasksAssigned,
    totalTasksCompleted,
  } = calculateSummary;

  // Chart Data for Member Status
  const statusChartData = {
    labels: ['Working', 'Offline', 'In Meeting', 'On Break'],
    datasets: [
      {
        label: 'Number of Team Members',
        data: [workingMembers, offlineMembers, MeetingMembers, breakMembers],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#007bff'],
        borderColor: ['#218838', '#e0a800', '#c82333', '#0056b3'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Task Completion (overall)
  const taskCompletionChartData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        label: 'Task Status',
        data: [totalTasksCompleted, totalTasksAssigned - totalTasksCompleted],
        backgroundColor: ['#28a745', '#6c757d'],
        borderColor: ['#218838', '#5a6268'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dashboard Summary', 
      },
    },
  };


  if (membersStatus === 'loading') {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em' }}>Loading team data...</div>;
  }

  if (membersError) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '1.2em' }}>Error: {membersError}</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
      <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Team Lead Dashboard</h2>

      {/* Summary Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
        <h3 style={{ marginTop: '0', color: '#333' }}>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: '#e9f5ff', padding: '15px', borderRadius: '5px' }}>
            <strong>Total Registered Users:</strong> {totalRegisteredUsers}
          </div>
          <div style={{ backgroundColor: '#e6ffe6', padding: '15px', borderRadius: '5px' }}>
            <strong>Total Team Members:</strong> {totalTeamMembers}
          </div>
          <div style={{ backgroundColor: '#fdf3d4', padding: '15px', borderRadius: '5px' }}>
            <strong>Working:</strong> {workingMembers}
          </div>
          <div style={{ backgroundColor: '#e9e9e9', padding: '15px', borderRadius: '5px' }}>
            <strong>In Meeting:</strong> {MeetingMembers}
          </div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '5px' }}>
            <strong>On Break:</strong> {breakMembers}
          </div>
          <div style={{ backgroundColor: '#fceaea', padding: '15px', borderRadius: '5px' }}>
            <strong>Offline:</strong> {offlineMembers}
          </div>
          <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '5px' }}>
            <strong>Total Tasks Assigned:</strong> {totalTasksAssigned}
          </div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '5px' }}>
            <strong>Total Tasks Completed:</strong> {totalTasksCompleted}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', color: '#555' }}>Team Member Status Distribution</h4>
          <Pie data={statusChartData} options={{ ...chartOptions, title: { display: true, text: 'Team Member Status Distribution' } }} />
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', color: '#555' }}>Overall Task Completion for Team Members</h4>
          <Bar data={taskCompletionChartData} options={{ ...chartOptions, title: { display: true, text: 'Overall Task Completion' } }} />
        </div>
      </div>


      {/* Filtering & Sorting */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ marginTop: '0', color: '#333' }}>Filter & Sort Team Members</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label htmlFor="filter-status" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Filter by Status:</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="All">All</option>
              <option value="Working">Working</option>
              <option value="Offline">Offline</option>
              <option value="In Meeting">In Meeting</option>
              <option value="On Break">On Break</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-by" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="name">Name</option>
              <option value="taskCompletion">Task Completion %</option>
              <option value="totalTasks">Total Tasks</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-order" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Order:</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Member Status Monitor */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#333' }}>Team Member Status Monitor</h3>
        {filteredAndSortedMembers.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No team members found matching your criteria.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredAndSortedMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* Task Form */}
      <TaskForm />
    </div>
  );
};

export default TeamLeadDashboard;