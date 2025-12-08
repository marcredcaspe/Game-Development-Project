// Boundary Checker Component - Prevents movement beyond a certain radius
AFRAME.registerComponent('boundary-checker', {
    schema: {
        maxRadius: { type: 'number', default: 25 }
    },
    
    init: function() {
        this.lastValidPosition = this.el.getAttribute('position');
    },
    
    tick: function() {
        const pos = this.el.getAttribute('position');
        const distance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        
        if (distance > this.data.maxRadius) {
            // Move back to last valid position
            this.el.setAttribute('position', this.lastValidPosition);
        } else {
            // Update last valid position
            this.lastValidPosition = { x: pos.x, y: pos.y, z: pos.z };
        }
    }
});