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
        this.wolves = document.querySelectorAll('[wolf-controller]');
        this.camp = document.querySelector(this.data.campSelector);
        this.player = document.querySelector(this.data.playerSelector);
        
        // Get UI Elements
        this.winPopup = document.getElementById('win-popup');
        this.losePopup = document.getElementById('lose-popup');
        this.scoreMsg = document.getElementById('score-message');
        
        // Audio elements for sounds
        this.howlSound = null;
        this.deathSound = null;
        this.winSound = null; // Add win sound
        
        // Bind Context
        this.startTimer = this.startTimer.bind(this);
        this.playDeathSound = this.playDeathSound.bind(this);
        this.playWinSound = this.playWinSound.bind(this); // Add win sound method
        this.startHowling = this.startHowling.bind(this);
        this.stopHowling = this.stopHowling.bind(this);
        this.resetGame = this.resetGame.bind(this);
        
        // Create audio elements
        this.createAudioElements();
        
        // Listen for Start Event
        window.addEventListener('start-game', this.startTimer);
        
        // Listen for try again event
        window.tryAgain = this.resetGame;
    },

    createAudioElements: function() {
        // Create wolf howl sound with loop
        this.howlSound = new Audio();
        this.howlSound.src = 'sounds/wolf_howl.mp3';
        this.howlSound.volume = 0.4; // Lower volume for looping background
        this.howlSound.loop = true; // Enable looping
        this.howlSound.preload = 'auto';
        
        // Create death sound
        this.deathSound = new Audio();
        this.deathSound.src = 'sounds/man_death.mp3';
        this.deathSound.volume = 0.8;
        this.deathSound.preload = 'auto';
        
        // Create win sound - SIMPLE VERSION
        this.winSound = new Audio();
        this.winSound.src = 'sounds/win.mp3'; // Make sure this file exists in your sounds folder
        this.winSound.volume = 0.7; // Adjust volume as needed
        this.winSound.preload = 'auto';
        
        // Load all sounds
        this.howlSound.load();
        this.deathSound.load();
        this.winSound.load();
        
        // Handle howl sound ending to restart it
        this.howlSound.addEventListener('ended', () => {
            if (this.isPlaying && !this.gameEnded && this.howlSound.loop) {
                console.log("Wolf howl loop ended, restarting...");
                this.howlSound.currentTime = 0;
                this.howlSound.play().catch(e => {
                    console.warn('Could not restart howl loop:', e);
                });
            }
        });
        
    },

    startTimer: function() {
        // Reset everything for a fresh game
        this.isPlaying = true;
        this.gameEnded = false;
        this.startTime = Date.now(); // Fresh timestamp
        console.log("GAME STARTED - Timer reset. Start time:", this.startTime);
        
        // DON'T restart howling here - let it continue if already playing
        // Only start if it's not already playing
        if (this.howlSound && this.howlSound.paused) {
            this.startHowling();
        }
    },

    startHowling: function() {
        if (!this.howlSound) return;
        
        try {
            // Only start if not already playing
            if (!this.howlSound.paused) return;
            
            this.howlSound.currentTime = 0;
            
            // Start the loop
            this.howlSound.play().then(() => {
                console.log("Wolf howl loop started");
            }).catch(e => {
                console.warn('Could not start howl loop:', e);
                
                // Try again with user interaction fallback
                setTimeout(() => {
                    if (this.isPlaying && !this.gameEnded && this.howlSound.paused) {
                        this.howlSound.play().catch(e2 => {
                            console.warn('Second attempt failed:', e2);
                        });
                    }
                }, 1000);
            });
        } catch (error) {
            console.warn('Error starting howl sound:', error);
        }
    },

    stopHowling: function() {
        if (!this.howlSound) return;
        
        try {
            // Don't actually stop the sound, just pause it temporarily
            // This allows it to resume when game restarts
            this.howlSound.pause();
            console.log("Wolf howl paused (can be resumed)");
        } catch (error) {
            console.warn('Error pausing howl sound:', error);
        }
    },

    playDeathSound: function() {
        if (!this.deathSound) return;
        
        try {
            // Pause howling sound temporarily (don't reset position)
            if (this.howlSound && !this.howlSound.paused) {
                this.howlSound.pause();
            }
            
            // Reset death sound to beginning
            this.deathSound.currentTime = 0;
            
            // Play death sound
            this.deathSound.play().then(() => {
                console.log("Death sound played");
                
                // When death sound finishes, resume howl if game is active
                // (but this will only matter if we restart the game)
                this.deathSound.onended = () => {
                    if (this.isPlaying && !this.gameEnded) {
                        this.startHowling();
                    }
                };
            }).catch(e => {
                console.warn('Could not play death sound:', e);
            });
        } catch (error) {
            console.warn('Error playing death sound:', error);
        }
    },

    playWinSound: function() {
        if (!this.winSound) return;
        
        try {
            // Pause howling sound when winning
            if (this.howlSound && !this.howlSound.paused) {
                this.howlSound.pause();
            }
            
            // Reset win sound to beginning
            this.winSound.currentTime = 0;
            
            // Play win sound
            this.winSound.play().then(() => {
                console.log("Win sound played successfully");
                
                // Optional: When win sound finishes, you could resume howl
                // but typically you wouldn't for a win screen
                this.winSound.onended = () => {
                    console.log("Win sound finished");
                };
            }).catch(e => {
                console.warn('Could not play win sound:', e);
                
                // Common issue: Autoplay policies block sounds until user interaction
                // We'll handle this in the UI by having the popup show first
                console.log('Win sound autoplay blocked. Will play on user interaction.');
                
                // Try again when user clicks anything on the win screen
                const winPopup = document.getElementById('win-popup');
                if (winPopup) {
                    winPopup.addEventListener('click', () => {
                        this.winSound.play().catch(e2 => {
                            console.warn('Still failed after click:', e2);
                        });
                    }, { once: true });
                }
            });
        } catch (error) {
            console.warn('Error playing win sound:', error);
        }
    },

    tick: function() {
        if (!this.isPlaying || this.gameEnded || !this.player) return;

        // 1. CHECK WIN (Distance to Camp)
        const distToCamp = this.player.object3D.position.distanceTo(this.camp.object3D.position);
        if (distToCamp < this.data.winDistance) {
            this.gameWin();
        }

        // 2. CHECK LOSS (Distance to any Wolf)
        for (let wolf of this.wolves) {
            if (wolf.object3D) {
                const distToWolf = this.player.object3D.position.distanceTo(wolf.object3D.position);
                if (distToWolf < this.data.killDistance) {
                    this.gameOver();
                    break;
                }
            }
        }
    },

    // Helper function to format time as MM:SS
    formatTime: function(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // Format as MM:SS with leading zeros
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    gameWin: function() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.isPlaying = false;
        
        // Stop howling sounds
        this.stopHowling();
        
        // Play win sound
        this.playWinSound();
        
        // Calculate elapsed time
        const currentTime = Date.now();
        let elapsedMS = currentTime - this.startTime;
        
        // Validate time (prevent negative or absurdly large values)
        if (!this.startTime || elapsedMS < 0 || elapsedMS > 86400000) {
            console.error('Invalid time calculation:', { currentTime, startTime: this.startTime, elapsedMS });
            // Default to 0 seconds if invalid
            elapsedMS = 0;
        }
        
        // Format time as MM:SS
        const formattedTime = this.formatTime(elapsedMS);
        
        // Update score message
        this.scoreMsg.textContent = `SURVIVED! TIME: ${formattedTime}`;
        
        // Save the raw seconds (or milliseconds) to the database
        const seconds = Math.floor(elapsedMS / 1000);
        saveRun(seconds);
        
        // Show end game UI
        this.showEndGameUI(this.winPopup);
    },

    gameOver: function() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.isPlaying = false;
        
        // Play death sound
        this.playDeathSound();
        
        this.showEndGameUI(this.losePopup);
    },

    resetGame: function() {
        console.log("Resetting game...");
        
        // Stop any playing sounds
        if (this.winSound && !this.winSound.paused) {
            this.winSound.pause();
            this.winSound.currentTime = 0;
        }
        if (this.deathSound && !this.deathSound.paused) {
            this.deathSound.pause();
            this.deathSound.currentTime = 0;
        }
        
        // Hide popups
        if (this.winPopup) this.winPopup.style.display = 'none';
        if (this.losePopup) this.losePopup.style.display = 'none';
        
        // Reset player position
        if (this.player) {
            this.player.setAttribute('position', '0 0 50');
        }
        
        // Reset wolves positions
        const wolves = document.querySelectorAll('[wolf-controller]');
        wolves[0]?.setAttribute('position', '-15 0 -15');
        wolves[1]?.setAttribute('position', '15 0 -10');
        wolves[2]?.setAttribute('position', '0 0 -25');
        
        // Enable player controls
        const rig = document.querySelector('#rig');
        const camera = document.querySelector('[look-controls]');
        
        if (rig) {
            rig.setAttribute('simple-movement', 'speed: 0.15');
        }
        if (camera) {
            camera.setAttribute('look-controls', 'enabled: true');
        }
        
        // Reset game state
        this.isPlaying = false;
        this.gameEnded = false;
        this.startTime = 0;
        
        // Resume scene
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.play();
        }
        
        // Request pointer lock
        if (document.querySelector('[camera]')) {
            document.querySelector('[camera]').components['look-controls'].play();
        }
        
        // Resume wolf howl if it was paused
        if (this.howlSound && this.howlSound.paused) {
            setTimeout(() => {
                this.startHowling();
            }, 500); // Small delay to ensure scene is ready
        }
        
        // Trigger game start after a brief delay
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('start-game'));
        }, 1000);
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
        
        if (rig) rig.removeAttribute('simple-movement');
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
