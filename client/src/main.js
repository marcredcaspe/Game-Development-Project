import '../style.css';
import { login, register, logout, initApiService } from './services/apiServices.js';

// Import Components
import './components/wolf-controller.js';
import './components/boundary-checker.js';
import './components/tree-generator.js';
import './components/flashlight.js';
import './components/game-manager.js';
import './components/fire-light.js';
import './components/mountain-boundary.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const authMsg = document.getElementById('auth-message');
    const scene = document.querySelector('a-scene');

    // 1. PAUSE SCENE ON LOAD (So Wolf doesn't kill player while logging in)
    if (scene) {
        if (scene.hasLoaded) scene.pause();
        else scene.addEventListener('loaded', () => scene.pause());
    }

    initApiService();

    // 2. CHECK FOR AUTO-LOGIN (If "Try Again" was clicked previously)
    const shouldAutoStart = sessionStorage.getItem('autoStart') === 'true';
    const token = localStorage.getItem('token');
    if (shouldAutoStart && token) {
        sessionStorage.removeItem('autoStart');
        startGame(); // Skip login screen
    }

    // --- BUTTON LISTENERS ---
    
    // Login
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        const res = await login(u, p);
        if (res.token) startGame();
        else authMsg.textContent = res.msg;
    });

    // Register
    document.getElementById('registerBtn')?.addEventListener('click', async () => {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        const res = await register(u, p);
        if (res.token) {
             localStorage.setItem('token', res.token);
             startGame();
        } else authMsg.textContent = res.msg;
    });

    // Try Again (Win/Loss screens)
    window.tryAgain = () => {
        sessionStorage.setItem('autoStart', 'true');
        location.reload(); // Reloads page -> Token exists -> Auto-starts game
    };

    // Exit (Win/Loss screens)
    window.exitGame = () => {
        logout(); // Clears token -> Reloads page -> Shows Login Screen
    };

    function startGame() {
        if (loginScreen) loginScreen.style.display = 'none';
        if (scene) {
            scene.play();
            window.dispatchEvent(new Event('start-game'));
        }
    }
});