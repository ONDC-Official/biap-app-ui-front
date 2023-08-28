import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import ToastProvider from "./context/toastContext";
import ErrorBoundary from "./components/shared/error-boundary/errorBoundary";
import { AddressContextProvider } from "./context/addressContext";
import { CartContextProvider } from "./context/cartContext";
import { SearchContextProvider } from "./context/searchContext";

ReactDOM.render(
    <React.StrictMode>
        <ToastProvider>
            <ErrorBoundary>
                <CartContextProvider>
                    <AddressContextProvider>
                        <SearchContextProvider>
                            <App/>
                        </SearchContextProvider>
                    </AddressContextProvider>
                </CartContextProvider>
            </ErrorBoundary>
        </ToastProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
