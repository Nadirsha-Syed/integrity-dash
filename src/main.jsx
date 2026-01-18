import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // This will look for App.js or App.jsx
import './styles/App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)