import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _persistedAt: null,
    content: [{ sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }],
    chatLoading: false
};
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setContent: (state, action) => {
            state.content = [...state.content, action.payload];
            if (!state._persistedAt) {
                state._persistedAt = Date.now();
            }
        },
        setChatLoading: (state, action) => {
            state.chatLoading = action.payload;
        },
        clearContent: (state) => {
            state.content = [{ sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }];
            state._persistedAt = null;
        }
    },
});

// Export các action để sử dụng trong component
export const { setContent, setChatLoading, clearContent } = chatSlice.actions;

// Export reducer để sử dụng trong store
export default chatSlice.reducer;
