// Player Death and Respawn Component
AFRAME.registerComponent('player-death', {
    schema: {
        wolf: { type: 'selector', default: '#wolf' },
        catchDistance: { type: 'number', default: 1.5 },
        respawnPoint: { type: 'string', default: '4 0 5' }
    },

    init: function() {
        this.wolfComp = null;
        this.isDead = false;
        this.deathScreen = null;
        this.respawnTimer = 0;
        this.respawnDelay = 3000; // 3 seconds before respawn
        
        // Create death screen overlay
        this.deathScreen = document.createElement('div');
        this.deathScreen.id = 'death-screen';
        this.deathScreen.className = 'death-screen';
        this.deathScreen.innerHTML = `
            <div class="death-content">
                <h1>YOU DIED</h1>
                <p>The wolf caught you!</p>
                <p id="respawn-countdown"></p>
            </div>
        `;
        document.body.appendChild(this.deathScreen);
        
        // Get wolf component
        this.el.sceneEl.addEventListener('loaded', () => {
            this.wolfComp = this.data.wolf.components['wolf-controller'];
            console.log('💀 [Player Death] Initialized');
        });
        
        // Parse respawn point
        const coords = this.data.respawnPoint.split(' ').map(Number);
        this.respawnPos = { x: coords[0], y: coords[1], z: coords[2] };
    },

    tick: function(time, timeDelta) {
        if (!this.wolfComp) return;
        
        if (this.isDead) {
            // Handle respawn countdown
            this.respawnTimer += timeDelta;
            const remainingTime = Math.max(0, Math.ceil((this.respawnDelay - this.respawnTimer) / 1000));
            
            const countdownEl = document.getElementById('respawn-countdown');
            if (countdownEl) {
                countdownEl.textContent = `Respawning in ${remainingTime}s`;
            }
            
            if (this.respawnTimer >= this.respawnDelay) {
                this.respawn();
            }
            return;
        }
        
        // Check if wolf caught the player
        const playerPos = this.el.object3D.position;
        const wolfPos = this.data.wolf.object3D.position;
        const distanceToWolf = playerPos.distanceTo(wolfPos);
        
        if (distanceToWolf < this.data.catchDistance && this.wolfComp.isChasing) {
            this.die();
        }
    },

    die: function() {
        this.isDead = true;
        this.respawnTimer = 0;
        
        console.log('💀 [Player Death] CAUGHT BY WOLF!');
        
        // Show death screen
        this.deathScreen.style.display = 'flex';
        
        // Freeze player movement
        const rig = document.querySelector('#rig');
        if (rig) {
            rig.setAttribute('wasd-controls', 'enabled: false');
            rig.setAttribute('look-controls', 'enabled: false');
        }
        
        // Disable flashlight
        const camera = document.querySelector('#camera');
        if (camera) {
            const light = camera.querySelector('a-light');
            if (light) {
                light.setAttribute('intensity', '0');
            }
        }
    },

    respawn: function() {
        this.isDead = false;
        this.respawnTimer = 0;
        
        console.log('💀 [Player Death] RESPAWNING...');
        
        // Move player to respawn point
        const rig = document.querySelector('#rig');
        if (rig) {
            rig.setAttribute('position', this.respawnPos);
            rig.setAttribute('wasd-controls', 'enabled: true');
            rig.setAttribute('look-controls', 'enabled: true');
        }
        
        // Restore flashlight
        const camera = document.querySelector('#camera');
        if (camera) {
            const light = camera.querySelector('a-light');
            if (light) {
                light.setAttribute('intensity', '3');
            }
        }
        
        // Hide death screen
        this.deathScreen.style.display = 'none';
        
        // Reset wolf state
        if (this.wolfComp) {
            this.wolfComp.isChasing = false;
            this.data.wolf.setAttribute('position', '0 0 -5');
            this.wolfComp.setRandomDestination();
        }
    },

    remove: function() {
        if (this.deathScreen && this.deathScreen.parentNode) {
            this.deathScreen.parentNode.removeChild(this.deathScreen);
        }
    }
});
