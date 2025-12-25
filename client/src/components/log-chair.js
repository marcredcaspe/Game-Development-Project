// Log Chair Component - Handles sitting interaction
AFRAME.registerComponent('log-chair', {
    init: function() {
        this.isSitting = false;
        this.rig = document.querySelector('#rig');
        this.camera = document.querySelector('#camera');
        this.sitPopup = document.querySelector('#sitPopup');
        this.standPopup = document.querySelector('#standPopup');
        this.originalRigY = null; // Will be set when sitting
        this.sitRigY = 0.7; // Sitting rig Y position (lowered)
        this.chairPosition = this.el.getAttribute('position');
        
        // Wait for scene to be ready
        if (this.el.sceneEl.hasLoaded) {
            this.initializeControls();
        } else {
            this.el.sceneEl.addEventListener('loaded', () => {
                this.initializeControls();
            });
        }
    },
    
    initializeControls: function() {
        // Store original rig Y position (should be 0, camera is at 1.6)
        if (this.rig) {
            const pos = this.rig.getAttribute('position');
            this.originalRigY = pos.y;
        }
        
        // Listen for proximity events
        this.el.addEventListener('proximityenter', () => {
            if (!this.isSitting) {
                this.showSitPopup();
            }
        });
        
        this.el.addEventListener('proximityleave', () => {
            if (!this.isSitting) {
                this.hideSitPopup();
            }
        });
        
        // Listen for E key press
        this.keyHandler = (e) => {
            if (e.key === 'e' || e.key === 'E') {
                if (this.isSitting) {
                    this.standUp();
                } else if (this.isNearChair()) {
                    this.sitDown();
                }
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    },
    
    remove: function() {
        document.removeEventListener('keydown', this.keyHandler);
    },
    
    isNearChair: function() {
        if (!this.rig) return false;
        const position = this.el.getAttribute('position');
        const targetPosition = this.rig.getAttribute('position');
        
        const distance = Math.sqrt(
            Math.pow(position.x - targetPosition.x, 2) +
            Math.pow(position.y - targetPosition.y, 2) +
            Math.pow(position.z - targetPosition.z, 2)
        );
        
        return distance <= 2;
    },
    
    showSitPopup: function() {
        if (this.sitPopup && !this.isSitting) {
            // Position popup above the log
            const logPos = this.el.getAttribute('position');
            this.sitPopup.setAttribute('position', `${logPos.x} ${logPos.y + 1.5} ${logPos.z}`);
            this.sitPopup.setAttribute('visible', true);
        }
    },
    
    hideSitPopup: function() {
        if (this.sitPopup) {
            this.sitPopup.setAttribute('visible', false);
        }
    },
    
    showStandPopup: function() {
        if (this.standPopup && this.isSitting) {
            const logPos = this.el.getAttribute('position');
            this.standPopup.setAttribute('position', `${logPos.x} ${logPos.y + 1.5} ${logPos.z}`);
            this.standPopup.setAttribute('visible', true);
        }
    },
    
    hideStandPopup: function() {
        if (this.standPopup) {
            this.standPopup.setAttribute('visible', false);
        }
    },
    
    sitDown: function() {
        if (this.isSitting || !this.isNearChair()) return;
        
        this.isSitting = true;
        this.hideSitPopup();
        
        // Store current rig Y if not already stored
        if (this.rig && this.originalRigY === null) {
            const pos = this.rig.getAttribute('position');
            this.originalRigY = pos.y;
        }
        
        // Disable movement by removing wasd-controls
        if (this.rig) {
            this.rig.removeAttribute('wasd-controls');
        }
        
        // Move rig to sitting position near the log
        const logPos = this.el.getAttribute('position');
        if (this.rig) {
            // Position rig near the log, facing the fire (which is at 0,0,0)
            const rigX = logPos.x;
            const rigZ = logPos.z + 0.5;
            this.rig.setAttribute('position', `${rigX} ${this.sitRigY} ${rigZ}`);
            
            // Look at the fire
            const THREE = AFRAME.THREE;
            const Vector3 = THREE['Vector3'];
            const firePos = new Vector3(0, 0, 0);
            const rigPos = new Vector3(rigX, this.sitRigY, rigZ);
            const direction = new Vector3().subVectors(firePos, rigPos).normalize();
            const yaw = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
            this.rig.setAttribute('rotation', `0 ${yaw} 0`);
        }
        
        // Show stand popup
        this.showStandPopup();
    },
    
    standUp: function() {
        if (!this.isSitting) return;
        
        this.isSitting = false;
        this.hideStandPopup();
        
        // Re-enable movement
        if (this.rig) {
            this.rig.setAttribute('wasd-controls', 'acceleration: 15');
        }
        
        // Move rig back to standing position
        if (this.rig && this.originalRigY !== null) {
            const currentPos = this.rig.getAttribute('position');
            this.rig.setAttribute('position', `${currentPos.x} ${this.originalRigY} ${currentPos.z}`);
        }
        
        // Show sit popup if still near
        if (this.isNearChair()) {
            this.showSitPopup();
        }
    },
    
    tick: function() {
        // Update popup to face camera
        const camera = document.querySelector('#camera');
        if (!camera) return;
        
        const THREE = AFRAME.THREE;
        const Vector3 = THREE['Vector3'];
        const cameraWorldPos = new Vector3();
        camera.object3D.getWorldPosition(cameraWorldPos);
        
        if (this.isSitting && this.standPopup && this.standPopup.getAttribute('visible')) {
            this.standPopup.object3D.lookAt(cameraWorldPos);
        } else if (!this.isSitting && this.sitPopup && this.sitPopup.getAttribute('visible')) {
            this.sitPopup.object3D.lookAt(cameraWorldPos);
        }
    }
});