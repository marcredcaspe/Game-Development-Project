AFRAME.registerComponent('stamina', {
    schema: {
        maxStamina: { type: 'number', default: 100 },
        drainRate: { type: 'number', default: 10 }, // Stamina drained per second while running
        recoverRate: { type: 'number', default: 5 }, // Stamina recovered per second while idle
        sprintMultiplier: { type: 'number', default: 2.5 }, // Factor to increase player speed
        sprintKey: { type: 'string', default: 'Shift' }
    },

    init: function () {
        this.currentStamina = this.data.maxStamina;
        this.isSprinting = false;
        this.canSprint = true;
        
        this.playerRig = this.el;
        this.wasdControls = this.playerRig.components['wasd-controls'];

        // Initial WASD acceleration (will be needed to restore after sprinting)
        this.originalAcceleration = this.playerRig.getAttribute('wasd-controls').acceleration;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        
        console.log('[Stamina] Initialized on #rig');
    },

    onKeyDown: function (evt) {
        if (evt.key === this.data.sprintKey && this.canSprint) {
            this.startSprint();
        }
    },

    onKeyUp: function (evt) {
        if (evt.key === this.data.sprintKey) {
            this.stopSprint();
        }
    },
    
    startSprint: function() {
        if (!this.canSprint || this.isSprinting) return;

        this.isSprinting = true;
        
        // Increase WASD acceleration for sprinting
        const sprintAcceleration = this.originalAcceleration * this.data.sprintMultiplier;
        this.playerRig.setAttribute('wasd-controls', { acceleration: sprintAcceleration });
        
        this.el.emit('staminaStartSprint');
    },

    stopSprint: function() {
        if (!this.isSprinting) return;
        
        this.isSprinting = false;
        
        // Restore original WASD acceleration
        this.playerRig.setAttribute('wasd-controls', { acceleration: this.originalAcceleration });
        
        this.el.emit('staminaStopSprint');
    },

    tick: function (time, timeDelta) {
        if (!timeDelta) return;
        
        const deltaSeconds = timeDelta / 1000;
        
        if (this.isSprinting) {
            // Check if player is actually moving (to prevent draining stamina while standing still and holding Shift)
            const isMoving = this.wasdControls && (
                this.wasdControls.keys.KeyW || 
                this.wasdControls.keys.KeyA || 
                this.wasdControls.keys.KeyS || 
                this.wasdControls.keys.KeyD
            );

            if (isMoving) {
                // Drain stamina
                this.currentStamina -= this.data.drainRate * deltaSeconds;
            } else {
                // Recover slowly even while holding Shift, if not moving
                this.currentStamina += this.data.recoverRate * deltaSeconds / 2;
            }

            if (this.currentStamina <= 0) {
                this.currentStamina = 0;
                this.canSprint = false;
                this.stopSprint(); // Force stop sprint if stamina runs out
            }
        } else {
            // Recover stamina when not sprinting
            if (this.currentStamina < this.data.maxStamina) {
                this.currentStamina += this.data.recoverRate * deltaSeconds;
                
                // Re-enable sprinting once stamina is above a certain threshold (e.g., 20%)
                if (this.currentStamina > this.data.maxStamina * 0.2) {
                    this.canSprint = true;
                }
            }
        }

        // Clamp stamina value
        this.currentStamina = Math.max(0, Math.min(this.data.maxStamina, this.currentStamina));
        
        // Emit stamina update event for UI component to read
        this.el.emit('staminaUpdate', { value: this.currentStamina, max: this.data.maxStamina });
    },

    remove: function () {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
});