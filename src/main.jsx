import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './app/store'
import { Provider } from 'react-redux'
import { AuthContextProvider } from "./context/AuthContext";
import { CalendarContextProvider } from "./context/CalendarContext";
import { LocationContextProvider } from "./context/LocationContext";

import Navbar from './components/Navbar';
ReactDOM.createRoot(document.getElementById('root')).render(

  <AuthContextProvider>
    <CalendarContextProvider>
      <LocationContextProvider>

        <React.StrictMode>
          <Provider store={store}>
            <App />
          </Provider>
        </React.StrictMode>

      </LocationContextProvider>
    </CalendarContextProvider>
  </AuthContextProvider>


)
