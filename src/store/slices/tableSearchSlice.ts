import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableSearchState {
  searchQuery: string;
}

const initialState: TableSearchState = {
  searchQuery: "",
};

const tableSearchSlice = createSlice({
  name: "tableSearch",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = tableSearchSlice.actions;
export default tableSearchSlice.reducer;
