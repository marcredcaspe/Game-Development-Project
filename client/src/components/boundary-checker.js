// client/src/components/boundary-checker.js

// Prevent duplicate registration crash
if (!AFRAME.components['boundary-checker']) {
    AFRAME.registerComponent('boundary-checker', {
        schema: {
            maxRadius: { type: 'number', default: 25 }
        },

        init: function() {
            this.boundaryCheckVector = new THREE.Vector3();
            // console.log('[Boundary Checker] Initialized'); 
        },

        tick: function() {
            const pos = this.el.object3D.position;
            const maxRadius = this.data.maxRadius;
            
            this.boundaryCheckVector.copy(pos);
            this.boundaryCheckVector.y = 0; 
            
            const distance = this.boundaryCheckVector.length();

            if (distance > maxRadius) {
                const direction = this.boundaryCheckVector.normalize();
                const clampedX = direction.x * maxRadius;
                const clampedZ = direction.z * maxRadius;

                this.el.setAttribute('position', {
                    x: clampedX,
                    y: pos.y, 
                    z: clampedZ
                });
            }
        }
    });
}