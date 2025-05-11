import React from "react";
import ReactDOM from "react-dom/client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from "./App.jsx";
import './styles/main.scss';
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { App as AntdApp, ConfigProvider } from 'antd';
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <React.StrictMode> */}
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Be Vietnam Pro",
          },
          components: {
            Skeleton: {
              gradientFromColor: "rgba(0, 181, 241, 0.06)",
              gradientToColor: "rgba(0, 181, 241, 0.12)",
            },
          },
        }}
      >
        <AntdApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
      {/* </React.StrictMode> */}
    </PersistGate>
  </Provider>

);
