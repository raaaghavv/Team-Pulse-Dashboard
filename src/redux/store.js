import { configureStore } from "@reduxjs/toolkit";
import membersSlice from "./slice/membersSlice";
import roleSlice from "./slice/roleSlice";

const store = configureStore({
  reducer: {
    role: roleSlice,
    members: membersSlice,
  },
});

export default store;
