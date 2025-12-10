import '../style.css';

import './components/chase-detector.js';
import './components/fire-light.js';
import './components/flashlight.js';
import './components/log-chair.js';
import './components/mountain-boundary.js';
import './components/player-death.js';
import './components/proximity-detector.js';
import './components/stamina.js';
import './components/tree-generator.js';
import './components/ui-popup.js';
import './components/wolf-controller.js';
import './components/boundary-checker.js';


document.addEventListener('DOMContentLoaded', () => {
    // We only initialize the backend service here after the main app structure is loaded
    // Import stubbed API service to avoid runtime reference errors. Implementation lives in services/apiService.js
    import('./services/apiServices.js').then(({ initApiService }) => {
        initApiService();
        console.log("A-Frame Components Registered and API Service Initialized.");
    }).catch((err) => {
        console.warn('Failed to initialize API service (stub missing):', err);
    });
});
