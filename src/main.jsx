import { StrictMode} from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Redux/store.js';
import { SnackbarProvider } from 'notistack';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <SnackbarProvider maxSnack={3}>
    <App />
    </SnackbarProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
