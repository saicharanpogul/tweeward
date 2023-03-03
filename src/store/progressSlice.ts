import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface ProgressState {
  progress: Progress;
  currentId: string | undefined;
}

const initialState: ProgressState = {
  progress: undefined,
  currentId: undefined,
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    changeProgress(state, action) {
      state.progress = action.payload;
    },
    setCurrentId(state, action) {
      state.currentId = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { changeProgress, setCurrentId } = progressSlice.actions;

export const selectProgress = (state: AppState) => state.progress;

export default progressSlice.reducer;
