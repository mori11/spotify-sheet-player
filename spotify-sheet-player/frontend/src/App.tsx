import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import CallbackPage from './pages/CallbackPage'

// Force rebuild for Vercel deployment - v2

function App() {
  useEffect(() => {
    // 拡張機能の干渉を防ぐためのCSPヘッダー設定
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';";
    document.head.appendChild(meta);

    // 拡張機能のスクリプト注入を阻止
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && 
                element.getAttribute('src')?.includes('extension://')) {
              element.remove();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-spotify-black text-spotify-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App