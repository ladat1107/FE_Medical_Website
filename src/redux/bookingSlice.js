import { BOOKING_CONTENT } from '@/constant/value';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    specialty: null,
    doctor: null,
    schedule: null,
    profile: null,
    currentContent: BOOKING_CONTENT.SPECIALTY
};
export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setSpecialty: (state, action) => {
            state.specialty = action.payload;
        },
        setDoctor: (state, action) => {
            state.doctor = action.payload;
        },
        setSchedule: (state, action) => {
            state.schedule = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setCurrentContent: (state, action) => {
            state.currentContent = action.payload;
        },
        clearBooking: (state) => {
            state.specialty = null;
            state.doctor = null;
            state.schedule = null;
            state.profile = null;
            state.currentContent = BOOKING_CONTENT.SPECIALTY;
        }
    },
});

// Export các action để sử dụng trong component
export const { setSpecialty, setDoctor, setSchedule, setProfile, setCurrentContent, clearBooking } = bookingSlice.actions;

// Export reducer để sử dụng trong store
export default bookingSlice.reducer;
