// hooks/useAuth.js
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // để xử lý trạng thái chờ
    const [error, setError] = useState(null);

    const getCurrentUser = async (token) => {
        const res = await fetch(`${BASE_URL}/api/Auth/current-user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error('Token không hợp lệ hoặc đã hết hạn');
        return await res.json();
    };

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.warn('Không có refreshToken, không gọi API');
            return;
        }

        const res = await fetch(`${BASE_URL}/api/Auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error('Refresh token không hợp lệ');

        const data = await res.json();
        localStorage.setItem('Token', data.Token);
        return data.Token;
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setError(null);

            try {
                let token = localStorage.getItem('Token');
                const refreshToken = localStorage.getItem('refreshToken');

                // 🚫 Nếu không có token thì coi như chưa đăng nhập
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                try {
                    const userData = await getCurrentUser(token);
                    setUser(userData);
                } catch {
                    // Token hết hạn → chỉ thử refresh nếu có refreshToken
                    if (refreshToken) {
                        token = await refreshAccessToken();
                        const userData = await getCurrentUser(token);
                        setUser(userData);
                    } else {
                        setUser(null);
                    }
                }
            } catch (err) {
                setUser(null);
                setError(err.message);
                console.warn('useAuth error:', err.message);
            } finally {
                setLoading(false);
            }
        };

        init();
        const handleAuthChange = () => init();
        window.addEventListener('authChanged', handleAuthChange);

        return () => {
            window.removeEventListener('authChanged', handleAuthChange);
        };
    }, []);


    return { user, loading, error };
}