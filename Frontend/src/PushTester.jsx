import React, { useState, useEffect } from 'react';

const PushTester = () => {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('Not Logged In');

    // Helper to convert VAPID string to Uint8Array
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('Logging in...');
        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                setStatus('Logged In! Now you can enable Push Notifications.');
            } else {
                setStatus('Login Failed: ' + data.message);
            }
        } catch (error) {
            setStatus('Login Error: ' + error.message);
        }
    };

    const enablePush = async () => {
        try {
            setStatus('Requesting Permission...');
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setStatus('Permission Denied!');
                return;
            }

            setStatus('Registering Service Worker...');
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            setStatus('Fetching VAPID Key...');
            const vapidRes = await fetch('http://localhost:5000/notifications/vapidPublicKey');
            const vapidData = await vapidRes.json();
            const convertedVapidKey = urlBase64ToUint8Array(vapidData.publicKey);

            setStatus('Subscribing to Push Server...');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            setStatus('Saving Subscription to Backend...');
            const saveRes = await fetch('http://localhost:5000/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(subscription)
            });

            if (saveRes.ok) {
                setStatus('✅ Successfully Subscribed!');
            } else {
                const saveError = await saveRes.json();
                setStatus('Failed to save on backend: ' + saveError.message);
            }

        } catch (error) {
            setStatus('Push Error: ' + error.message);
            console.error(error);
        }
    };

    const triggerTestPush = async () => {
        try {
            setStatus('Triggering Push...');
            await fetch('http://localhost:5000/notifications/testPush', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStatus('Push Sent! Did you see it?');
        } catch (error) {
            setStatus('Trigger Error: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0', backgroundColor: '#242424' }}>
            <h2>Web Push Tester</h2>
            <p style={{ color: '#4ade80' }}>Status: {status}</p>
            
            {!token ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={enablePush} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        🔔 Enable Push Notifications
                    </button>
                    <button onClick={triggerTestPush} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        🚀 Test Push
                    </button>
                </div>
            )}
        </div>
    );
};

export default PushTester;
