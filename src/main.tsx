
// Entry point for the React app
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mount the App component to the #root element in index.html
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  // Fallback for missing root element
  console.error('Root element not found. App not mounted.');
}
