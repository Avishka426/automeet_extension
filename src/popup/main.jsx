import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../style.css';
import { HashRouter } from 'react-router-dom'
import '../../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.createRoot(document.getElementById('root')).render(
   <HashRouter>
      <App />
    </HashRouter>
);
