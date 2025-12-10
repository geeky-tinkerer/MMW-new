import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import useStore from './store/useStore';

const Init = ({ children }) => {
    const hydrate = useStore(state => state.hydrate);
    const setOnline = useStore(state => state.setOnlineStatus);
    const setDeferredPrompt = useStore(state => state.setDeferredPrompt);

    useEffect(() => {
        hydrate();

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Init>
        <App />
    </Init>
  </React.StrictMode>,
)
