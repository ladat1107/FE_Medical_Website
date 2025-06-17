
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    token: "",
    user: null,
    rememberLogin: [],
    isLogout: false,
};

export const authenSlice = createSlice({
    name: 'authen',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.isLogout = true;
            state.token = "";
            state.user = null;
        },
        setIsLogout: (state, action) => {
            state.isLogout = action.payload;
        },
        addRememberLogin: (state, action) => {
            if (!Array.isArray(state.rememberLogin)) {
                state.rememberLogin = [];
            }

            let array = [...state.rememberLogin];
            if (array.length > 0) {
                array.forEach((item, index) => {
                    if (item.email === action.payload.email) {
                        array.splice(index, 1);
                    }
                });
            }

            array.push(action.payload);
            state.rememberLogin = array;
        },
        removeRememberAccount: (state, action) => {
            let array = [...state.rememberLogin];
            let newArray = array.filter(item => item.email !== action.payload.email);
            state.rememberLogin = newArray;
        }
    },
});

// Export các action để sử dụng trong component
export const { login, logout, setToken, setIsLogout, addRememberLogin, removeRememberAccount } = authenSlice.actions;

// Export reducer để sử dụng trong store
export default authenSlice.reducer;
