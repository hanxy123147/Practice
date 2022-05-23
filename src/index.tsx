import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../asserts/less/index.less'

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />); 