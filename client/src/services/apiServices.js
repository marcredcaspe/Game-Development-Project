// client/src/services/apiServices.js

// 1. Define your backend URL (Adjust port if your server runs on 5000 or 8080)
const API_URL = 'http://localhost:3000/api';

/**
 * Initializes the API service.
 * This is called from main.js when the game loads.
 */
export const initApiService = () => {
    console.log('📡 API Service is online and ready.');
};

/**
 * Saves the player's run time to the database.
 * Call this when the player reaches the Campsite.
 */
export const saveRun = async (playerName, timeTaken) => {
    try {
        const response = await fetch(`${API_URL}/win`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName, timeTaken })
        });

        if (!response.ok) throw new Error('Server error');
        
        const data = await response.json();
        console.log('✅ Score saved!', data);
        return data;
    } catch (error) {
        console.error('❌ Failed to save score:', error);
    }
};

/**
 * Gets the top scores for the leaderboard.
 */
export const getLeaderboard = async () => {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('⚠️ Could not fetch leaderboard. Backend might be offline.');
        return [];
    }
};