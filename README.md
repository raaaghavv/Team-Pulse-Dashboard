# Team Dashboard - Internal Management Tool

A dynamic and responsive dashboard application built with React and Redux, designed to streamline task management and team monitoring for both Team Leads and Team Members. This internal tool provides role-specific views to enhance productivity and provide clear insights into team performance and task progress.

[Live Demo](https://teampulsedash.netlify.app/)



<!-- Add a screenshot or GIF of your application here -->
<!--![Dashboard Screenshot](https://placehold.co/800x450/1f2937/ffffff?text=App+Screenshot+Here)-->

---

## ✨ Features

This application features a role-based system with two distinct dashboards:

### 👨‍💼 Team Lead View

A comprehensive, three-column dashboard designed for oversight and management.

* **Team Status Monitor:**
    * At-a-glance summary cards showing the number of team members who are `Working`, `In a Meeting`, `On Break`, or `Offline`.
    * Detailed list of all team members with their current status badge.
* **Task Management:**
    * View all assigned tasks across the team.
    * Assign new tasks to team members via a pop-up modal with member selection, task title, and due date.
* **Data Visualization:**
    * Doughnut and Bar charts powered by Chart.js to visualize team metrics and workload distribution.
* **Filtering & Sorting:**
    * Filter the member list by their current status.
    * Sort members by the number of active tasks.
* **Collapsible Layout:**
    * Side columns can be collapsed to focus on the main content, with a fully responsive design for all screen sizes.

### 👩‍💻 Team Member View

A personalized, two-column dashboard focused on individual tasks and status.

* **Task Management:**
    * View a personal list of all assigned tasks.
    * Update task progress in 10% increments using a sleek progress bar.
    * Tasks are automatically marked as complete when progress reaches 100%.
* **Status Control:**
    * Update your personal status (`Working`, `Break`, `Meeting`, `Offline`) with a simple dropdown menu.
    * The selected status is reflected globally for the Team Lead to see.
* **Personal Analytics:**
    * View a personal bar graph showing total assigned vs. completed tasks.

### Major Tasks

* **Role Switching:** Seamlessly toggle between Team Lead and Team Member views.
* **Theme Toggle:** Switch between light and dark modes.
* **State Management:** Centralized state managed by Redux Toolkit for a predictable and scalable application state.

---

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Charts:** [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn



## 👤 Author

* **Raghav Goel**
* **GitHub:** [@raaaghavv](https://github.com/raaaghavv)
* **LinkedIn:** [raghav-goel01](https://www.linkedin.com/in/raghav-goel01/)
