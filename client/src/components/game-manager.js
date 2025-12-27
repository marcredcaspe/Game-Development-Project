import { saveRun } from '../services/apiServices.js';

AFRAME.registerComponent('game-manager', {
    schema: {
        campSelector: { type: 'string', default: '#camp' },
        wolfSelector: { type: 'string', default: '#wolf' },
        playerSelector: { type: 'string', default: '#rig' },
        killDistance: { type: 'number', default: 2.0 },
        winDistance: { type: 'number', default: 6.0 }
    },

    init: function() {
        this.isPlaying = false;
        this.startTime = 0;
        this.gameEnded = false; // Flag to prevent multiple triggers
        
        // Get Entities
        this.wolf = document.querySelector(this.data.wolfSelector);
        this.camp = document.querySelector(this.data.campSelector);
        this.player = document.querySelector(this.data.playerSelector);
        
        // Get UI Elements
        this.winPopup = document.getElementById('win-popup');
        this.losePopup = document.getElementById('lose-popup');
        this.scoreMsg = document.getElementById('score-message');
        
        // Bind Context
        this.startTimer = this.startTimer.bind(this);
        
        // Listen for Start Event
        window.addEventListener('start-game', this.startTimer);
    },

    startTimer: function() {
        // Reset everything for a fresh game
        this.isPlaying = true;
        this.gameEnded = false;
        this.startTime = Date.now(); // Fresh timestamp
        console.log("🔥 GAME STARTED - Timer reset. Start time:", this.startTime);
    },

    tick: function() {
        if (!this.isPlaying || this.gameEnded || !this.player) return;

        // 1. CHECK WIN (Distance to Camp)
        const distToCamp = this.player.object3D.position.distanceTo(this.camp.object3D.position);
        if (distToCamp < this.data.winDistance) {
            this.gameWin();
        }

        // 2. CHECK LOSS (Distance to Wolf)
        if (this.wolf) {
            const distToWolf = this.player.object3D.position.distanceTo(this.wolf.object3D.position);
            if (distToWolf < this.data.killDistance) {
                this.gameOver();
            }
        }
    },

    gameWin: function() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.isPlaying = false;
        
        // Calculate Minutes with validation
        const currentTime = Date.now();
        const elapsedMS = currentTime - this.startTime;
        
        // Ensure we have valid time
        if (!this.startTime || elapsedMS < 0 || elapsedMS > 86400000) { // Max 24 hours
            console.error('Invalid time calculation:', { currentTime, startTime: this.startTime, elapsedMS });
            this.startTime = currentTime - 1000; // Default to 1 second if invalid
        }
        
        const minutes = ((currentTime - this.startTime) / 60000).toFixed(2);
        
        this.scoreMsg.textContent = `SURVIVED! YOUR SCORE: ${minutes} MIN`;
        this.showEndGameUI(this.winPopup);
        saveRun(minutes);
    },

    gameOver: function() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.isPlaying = false;
        
        this.showEndGameUI(this.losePopup);
    },

    showEndGameUI: function(popupElement) {
        // 1. SHOW UI FIRST (Force display style)
        if (popupElement) {
            popupElement.style.display = 'flex';
            popupElement.style.visibility = 'visible';
            popupElement.style.opacity = '1';
        }

        // 2. DISABLE PLAYER CONTROLS (Soft Stop)
        // This stops the player from moving immediately, even if the scene hasn't paused yet.
        const rig = document.querySelector('#rig');
        const camera = document.querySelector('[look-controls]');
        
        if (rig) rig.removeAttribute('wasd-controls');
        if (camera) camera.setAttribute('look-controls', 'enabled: false');

        // 3. EXIT POINTER LOCK
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        // 4. WAIT FOR PAINT, THEN PAUSE
        // requestAnimationFrame ensures the browser paints the UI changes (the popup)
        // BEFORE we freeze the scene loop.
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                this.pauseScene();
            }, 50); // Small 50ms buffer to be absolutely safe
        });
    },

    pauseScene: function() {
        const scene = document.querySelector('a-scene');
        if (scene) scene.pause();
    },

    exitPointerLock: function() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }
});