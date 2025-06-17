import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage làm storage engine mặc định
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import rootReducer from './reducers'; // Thay thế bằng reducer thực tế của bạn

const persistConfig = {
    key: 'root',          // key để xác định trạng thái gốc cần lưu
    storage,              // Sử dụng localStorage làm engine
    whitelist: ['authen', 'chat', 'schedule', 'booking', 'printCheckout'], // Tên các slice mà bạn muốn persist (giữ lại)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);