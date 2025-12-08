import './style.css';

import './components/chase-detector.js';
import './components/fire-light.js';
import './components/flashlight.js';
import './components/log-chair.js';
import './components/mountain-boundary.js';
import './components/proximity-detector.js';
import './components/stamina.js';
import './components/tree-generator.js';
import './components/ui-popup.js';
import './components/wolf-controller.js';
import './components/boundary-checker.js';


document.addEventListener('DOMContentLoaded', () => {
    // We only initialize the backend service here after the main app structure is loaded
    initApiService();
    console.log("A-Frame Components Registered and API Service Initialized.");
});