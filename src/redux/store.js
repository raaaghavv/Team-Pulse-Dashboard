import { configureStore } from "@reduxjs/toolkit";
import membersSlice from "./slices/membersSlice";
import roleSlice from "./slices/roleSlice";

const store = configureStore({
  reducer: {
    role: roleSlice,
    members: membersSlice,
  },
});

export default store;
