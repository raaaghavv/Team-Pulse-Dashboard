import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import MemberCard from "./MemberCard";
import TaskForm from "./TaskForm";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

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

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false);
  const [isRightColumnCollapsed, setIsRightColumnCollapsed] = useState(false);

  // Filter out the TeamLead from the list
  const teamMembersOnly = useMemo(
    () => members.filter((m) => m.role === "TeamMember"),
    [members]
  );

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = [...teamMembersOnly];

    if (filterStatus !== "All") {
      filtered = filtered.filter(
        (member) => member.currentStatus === filterStatus
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "taskCompletion") {
        const aCompleted = a.tasks.filter((t) => t.isCompleted).length;
        const bCompleted = b.tasks.filter((t) => t.isCompleted).length;
        const aTotal = a.tasks.length || 1;
        const bTotal = b.tasks.length || 1;
        comparison = aCompleted / aTotal - bCompleted / bTotal;
      } else if (sortBy === "totalTasks") {
        comparison = a.tasks.length - b.tasks.length;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [teamMembersOnly, filterStatus, sortBy, sortOrder]);

  const calculateSummary = useMemo(() => {
    const totalRegisteredUsers = members.length;
    const totalTeamMembers = teamMembersOnly.length;
    const workingMembers = teamMembersOnly.filter(
      (m) => m.currentStatus === "Working"
    ).length;
    const offlineMembers = teamMembersOnly.filter(
      (m) => m.currentStatus === "Offline"
    ).length;
    const MeetingMembers = teamMembersOnly.filter(
      (m) => m.currentStatus === "In Meeting"
    ).length;
    const breakMembers = teamMembersOnly.filter(
      (m) => m.currentStatus === "On Break"
    ).length;

    let totalTasksAssigned = 0;
    let totalTasksCompleted = 0;
    teamMembersOnly.forEach((member) => {
      totalTasksAssigned += member.tasks.length;
      totalTasksCompleted += member.tasks.filter(
        (task) => task.isCompleted
      ).length;
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
    labels: ["Working", "Offline", "In Meeting", "On Break"],
    datasets: [
      {
        label: "Number of Team Members",
        data: [workingMembers, offlineMembers, MeetingMembers, breakMembers],
        backgroundColor: [
          "hsl(140, 60%, 40%)",
          "hsl(45, 100%, 60%)",
          "hsl(0, 70%, 60%)",
          "hsl(210, 70%, 60%)",
        ],
        borderColor: [
          "hsl(140, 60%, 35%)",
          "hsl(45, 100%, 55%)",
          "hsl(0, 70%, 55%)",
          "hsl(210, 70%, 55%)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Task Completion
  const taskCompletionChartData = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Task Status",
        data: [totalTasksCompleted, totalTasksAssigned - totalTasksCompleted],
        backgroundColor: ["hsl(140, 60%, 40%)", "hsl(210, 20%, 50%)"],
        borderColor: ["hsl(140, 60%, 35%)", "hsl(210, 20%, 45%)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "hsl(210, 10%, 30%)",
        },
      },
      title: {
        display: true,
        text: "Dashboard Summary",
        color: "hsl(210, 10%, 20%)",
      },
    },

    scales: {
      x: {
        ticks: {
          color: "hsl(210, 10%, 30%)",
        },
        grid: {
          color: "hsl(210, 5%, 85%)",
        },
      },
      y: {
        ticks: {
          color: "hsl(210, 10%, 30%)",
        },
        grid: {
          color: "hsl(210, 5%, 85%)",
        },
      },
    },
  };

  const getChartOptions = (isDark) => {
    const darkChartColors = {
      legend: {
        labels: {
          color: "hsl(210, 20%, 80%)",
        },
      },
      title: {
        color: "hsl(210, 20%, 90%)",
      },
      scales: {
        x: {
          ticks: {
            color: "hsl(210, 20%, 80%)",
          },
          grid: {
            color: "hsl(210, 10%, 25%)",
          },
        },
        y: {
          ticks: {
            color: "hsl(210, 20%, 80%)",
          },
          grid: {
            color: "hsl(210, 10%, 25%)",
          },
        },
      },
    };
    return isDark
      ? {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            ...darkChartColors.legend,
            ...darkChartColors.title,
          },
          scales: darkChartColors.scales,
        }
      : chartOptions;
  };
  const isDarkMode = document.documentElement.classList.contains("dark");
  if (membersStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] text-xl text-gray-700 dark:text-gray-300 transition-colors duration-300">
        Loading team data...
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] text-xl text-red-600 dark:text-red-400 transition-colors duration-300">
        Error: {membersError}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 rounded-lg shadow-inner">
      {/* Collapse Buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <button
          onClick={() => setIsLeftColumnCollapsed(!isLeftColumnCollapsed)}
          className="p-2 bg-blue-500 text-white rounded-r-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform"
          title={isLeftColumnCollapsed ? "Expand Tasks" : "Collapse Tasks"}
        >
          {isLeftColumnCollapsed ? (
            <span className="icon-right">&gt;</span>
          ) : (
            <span className="icon-left">&lt;</span>
          )}
        </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <button
          onClick={() => setIsRightColumnCollapsed(!isRightColumnCollapsed)}
          className="p-2 bg-blue-500 text-white rounded-l-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform"
          title={isRightColumnCollapsed ? "Expand Members" : "Collapse Members"}
        >
          {isRightColumnCollapsed ? (
            <span className="icon-left">&lt;</span>
          ) : (
            <span className="icon-right">&gt;</span>
          )}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div
        className={`grid w-full transition-all duration-300 grid-cols-1 ${
          isLeftColumnCollapsed && isRightColumnCollapsed
            ? "md:grid-cols-1"
            : isLeftColumnCollapsed
            ? "md:grid-cols-1 lg:grid-cols-[1fr_20rem]"
            : isRightColumnCollapsed
            ? "md:grid-cols-[20rem_1fr]"
            : "md:grid-cols-[20rem_1fr] lg:grid-cols-[20rem_1fr_20rem]"
        }`}
      >
        {/* Left Column: Tasks */}
        <aside
          className={`p-4 border-r border-gray-200 dark:border-gray-700 flex-col transition-all duration-300 w-full ${
            isLeftColumnCollapsed ? "hidden" : "hidden md:flex"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Tasks
            </h3>
            <button
              onClick={() => setIsTaskFormOpen(true)}
              className="p-2 w-11 h-11 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center" // Added h-11, flex, items-center, justify-center
              title="Assign New Task"
            >
              <span className="text-xl font-bold leading-none">+</span>{" "}
            </button>
          </div>
          <div className="mb-6 space-y-2 text-gray-700 dark:text-gray-200">
            <p>
              <strong>Total Tasks Assigned:</strong> {totalTasksAssigned}
            </p>
            <p>
              <strong>Total Tasks Completed:</strong> {totalTasksCompleted}
            </p>
          </div>

          {/* Assigned Tasks List */}
          {/* <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-gray-600 dark:text-gray-400">
              Assigned tasks will appear here...
            </p>
          </div> */}
        </aside>

        {/* Center Column: Main Dashboard Content */}
        <main
          className={`flex-grow p-4 overflow-y-auto custom-scrollbar transition-all duration-300`}
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
            Team Lead Dashboard
          </h2>

          {/* Summary Section */}
          <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Team Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md shadow-sm border border-blue-200 dark:border-blue-700 text-center">
                <strong className="block text-blue-700 dark:text-blue-200 text-lg">
                  {totalTeamMembers}
                </strong>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Total Team Members
                </span>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md shadow-sm border border-green-200 dark:border-green-700 text-center">
                <strong className="block text-green-700 dark:text-green-200 text-lg">
                  {workingMembers}
                </strong>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Working
                </span>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-md shadow-sm border border-orange-200 dark:border-orange-700 text-center">
                <strong className="block text-orange-700 dark:text-orange-200 text-lg">
                  {MeetingMembers}
                </strong>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  In Meeting
                </span>
              </div>
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md shadow-sm border border-red-200 dark:border-red-700 text-center">
                <strong className="block text-red-700 dark:text-red-200 text-lg">
                  {breakMembers}
                </strong>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  On Break
                </span>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 min-h-[300px] flex flex-col justify-center items-center">
              <h4 className="text-center text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Team Member Status Distribution
              </h4>
              <div className="relative w-full h-64">
                <Doughnut
                  data={statusChartData}
                  options={getChartOptions(isDarkMode)}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 min-h-[300px] flex flex-col justify-center items-center">
              <h4 className="text-center text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Overall Task Completion
              </h4>
              <div className="relative w-full h-64">
                <Bar
                  data={taskCompletionChartData}
                  options={getChartOptions(isDarkMode)}
                />
              </div>
            </div>
          </section>
        </main>

        {/* Right Column: Member Viewing */}
        <aside
          className={`p-4 border-l border-gray-200 dark:border-gray-700 flex-col transition-all duration-300 w-full ${
            isRightColumnCollapsed ? "hidden" : "hidden lg:flex"
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Team Members
          </h3>

          {/* Filtering & Sorting */}
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="mb-3">
              <label
                htmlFor="filter-status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Filter by Status:
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-300"
              >
                <option value="All">All</option>
                <option value="Working">Working</option>
                <option value="Offline">Offline</option>
                <option value="In Meeting">In Meeting</option>
                <option value="On Break">On Break</option>
              </select>
            </div>
            <div className="mb-3">
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Sort By:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-300"
              >
                <option value="name">Name</option>
                <option value="taskCompletion">Task Completion %</option>
                <option value="totalTasks">Total Tasks</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sort-order"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Order:
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-300"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Team Member List */}
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {filteredAndSortedMembers.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                No team members found.
              </p>
            ) : (
              filteredAndSortedMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))
            )}
          </div>
        </aside>
      </div>

      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative transition-colors duration-300">
            <button
              onClick={() => setIsTaskFormOpen(false)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 text-center">
              Assign New Task
            </h3>
            <TaskForm onClose={() => setIsTaskFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeadDashboard;
