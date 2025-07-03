import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberDetails } from "./redux/slices/membersSlice";
import { setUser, switchRole } from "./redux/slices/roleSlice";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

function App() {
  const dispatch = useDispatch();
  const currentRole = useSelector((state) => state.role.currentRole);
  const currentUser = useSelector((state) => state.role.currentUser);
  const members = useSelector((state) => state.members.list);
  const membersStatus = useSelector((state) => state.members.status);

  useEffect(() => {
    if (membersStatus === "idle" || !membersStatus) {
      dispatch(fetchMemberDetails());
    }
  }, []);

  useEffect(() => {
    if (membersStatus === "succeeded" && members.length > 0 && !currentUser) {
      // Set initial user based on default currentRole
      const initialUser = members.find((member) => member.role === currentRole);
      if (initialUser) {
        dispatch(setUser(initialUser));
      } else {
        // If initial role user not found, pick the first user
        dispatch(setUser(members[0]));
        // adjust the currentRole if needed
        if (members[0].role !== currentRole) {
          dispatch(switchRole(members[0].role));
        }
      }
    }
    // to update currentUser if currentRole changes after initial load
    if (
      membersStatus === "succeeded" &&
      members.length > 0 &&
      currentUser &&
      currentUser.role !== currentRole
    ) {
      const targetUser = members.find((member) => member.role === currentRole);
      if (targetUser) {
        dispatch(setUser(targetUser));
      }
    }
  }, [membersStatus, members, currentRole, currentUser, dispatch]);

  if (membersStatus === "loading" || !currentUser) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2em" }}
      >
        Loading application data...
      </div>
    );
  }

  if (membersStatus === "failed") {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "red",
          fontSize: "1.2em",
        }}
      >
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div
      className="App"
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
