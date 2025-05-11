import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage làm storage engine mặc định
import rootReducer from './reducers'; // Thay thế bằng reducer thực tế của bạn
const persistConfig = {
    key: 'root',          // key để xác định trạng thái gốc cần lưu
    storage,              // Sử dụng localStorage làm engine
    whitelist: ['authen', 'chat', 'schedule'], // Tên các slice mà bạn muốn persist (giữ lại). Bạn có thể liệt kê nhiều slice ở đây.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
