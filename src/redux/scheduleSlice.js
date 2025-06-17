import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    schedule: [],
};

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setSchedule: (state, action) => {
            state.schedule = action.payload;
        },
    },
});

// Export các action để sử dụng trong component
export const { setSchedule } = scheduleSlice.actions;

// Export reducer để sử dụng trong store
export default scheduleSlice.reducer;
