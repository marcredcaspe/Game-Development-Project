const API_URL = 'http://localhost:5000/api'; // Ensure this matches your server port

export const initApiService = () => console.log('📡 API Online');

export const login = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token); // Save token for Auto-Login
            return data;
        } else {
            return { msg: data.msg || 'Login failed' };
        }
    } catch (e) { return { msg: 'Server error' }; }
};

export const register = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await res.json();
    } catch (e) { return { msg: 'Server error' }; }
};

export const saveRun = async (timeInMinutes) => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ timeInMinutes })
        });
    } catch (e) { console.error(e); }
};

export const logout = () => {
    localStorage.removeItem('token');
    location.reload();
};