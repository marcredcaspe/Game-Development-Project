// Proximity Detector Component - Detects when an entity is near a target
AFRAME.registerComponent('proximity-detector', {
    schema: {
        distance: { type: 'number', default: 2 },
        target: { type: 'selector', default: '#rig' }
    },
    
    init: function() {
        this.isNear = false;
    },
    
    tick: function() {
        if (!this.data.target) return;
        
        const pos = this.el.object3D.position;
        const targetPos = this.data.target.object3D.position;
        const distance = pos.distanceTo(targetPos);
        
        this.isNear = distance < this.data.distance;
        
        // Emit event for other components to listen to
        if (this.isNear) {
            this.el.emit('proximity-enter', { target: this.data.target });
        } else {
            this.el.emit('proximity-exit', { target: this.data.target });
        }
    }
});