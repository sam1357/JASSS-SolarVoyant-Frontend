import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LastClickedFeature, State } from "@interfaces/state";
import { ChoroplethColourValueMapping, NextWeekHourlyData } from "./interfaces";

// Define initial state for the map slice
const initialState: State = {
  lastClickedFeature: {},
  suburbsData: {},
  choroplethMapping: [],
  insightData: {},
};

// Create a slice for managing map-related state
const slice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLastClickedFeature(state, action: PayloadAction<LastClickedFeature>) {
      state.lastClickedFeature = action.payload;
    },
    setSuburbsData(state, action: PayloadAction<{ [key: string]: number }>) {
      state.suburbsData = action.payload;
    },
    setChoroplethMapping(state, action: PayloadAction<ChoroplethColourValueMapping[]>) {
      state.choroplethMapping = action.payload;
    },
    setInsightData(state, action: PayloadAction<NextWeekHourlyData>) {
      state.insightData = action.payload;
    },
  },
});

// Extract action creators
export const { setLastClickedFeature, setSuburbsData, setChoroplethMapping, setInsightData } =
  slice.actions;

// Configure Redux store with the map slice reducer
const store = configureStore({
  reducer: slice.reducer,
});

export default store;
