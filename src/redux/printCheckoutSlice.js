import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
        examId: null,
        patientData: null,
        staffData: null,
        tableData: [],
    },
};
export const printCheckoutSlice = createSlice({
    name: 'printCheckout',
    initialState,
    reducers: {
        setPrintCheckout: (state, action) => {
            state.data = {
                examId: action.payload.examId,
                patientData: action.payload.patientData,
                staffData: action.payload.staffData,
                tableData: action.payload.tableData,
            };
        },
        clearPrintCheckout: (state) => {
            state.data = {
                patientData: null,
                staffData: null,
                tableData: [],
            };
        }
    },
});

// Export các action để sử dụng trong component
export const { setPrintCheckout, clearPrintCheckout } = printCheckoutSlice.actions;

// Export reducer để sử dụng trong store
export default printCheckoutSlice.reducer;
