import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ブラウザ拡張機能のエラーを無視するグローバルエラーハンドラー
window.addEventListener('error', (event) => {
  // 拡張機能関連のエラーを無視
  if (event.error && event.error.stack && 
      (event.error.stack.includes('extension://') || 
       event.error.stack.includes('background.js') ||
       event.error.stack.includes('site_integration'))) {
    console.warn('Browser extension error ignored:', event.error.message);
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // 拡張機能関連のPromise rejectionを無視
  if (event.reason && event.reason.reqInfo && 
      event.reason.reqInfo.pathPrefix === '/site_integration') {
    console.warn('Browser extension promise rejection ignored:', event.reason.message);
    event.preventDefault();
    return false;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)