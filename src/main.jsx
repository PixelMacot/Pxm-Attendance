import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './app/store'
import { Provider } from 'react-redux'
import { AuthContextProvider } from "./context/AuthContext";
import { CalendarContextProvider } from "./context/CalendarContext";
import { LocationContextProvider } from "./context/LocationContext";
import { HolidaysContextProvider } from "./context/HolidaysContext";
import { ErrorBoundary } from "react-error-boundary";
import { MessagesContextProvider } from './context/MessageContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(

<ErrorBoundary fallback={<div>Something went wrong</div>}>
    <AuthContextProvider>
      <CalendarContextProvider>
        <LocationContextProvider>
          <HolidaysContextProvider>
            <MessagesContextProvider>

              <React.StrictMode>
                <Provider store={store}>
                  <App />
                </Provider>

              </React.StrictMode>
            </MessagesContextProvider>
          </HolidaysContextProvider>
        </LocationContextProvider>
      </CalendarContextProvider>
    </AuthContextProvider>
</ErrorBoundary>

)
