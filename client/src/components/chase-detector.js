AFRAME.registerComponent('chase-detector', {
    schema: {
        wolf: { type: 'selector', default: '#wolf' }
    },

    init: function() {
        this.wolfComp = null;
        this.warningEl = null;
        this.isChasingActive = false;
        
        // Create warning element
        this.warningEl = document.createElement('div');
        this.warningEl.className = 'chase-warning';
        this.warningEl.textContent = '⚠️ Wolf is chasing you! Run!';
        document.body.appendChild(this.warningEl);
        
        // Get the wolf component reference
        this.el.sceneEl.addEventListener('loaded', () => {
            this.wolfComp = this.data.wolf.components['wolf-controller'];
            console.log('🎯 [Chase Detector] Wolf component initialized');
        });
    },

    tick: function() {
        if (!this.wolfComp) return;
        
        const wasChasing = this.isChasingActive;
        this.isChasingActive = this.wolfComp.isChasing;
        
        // Only update UI and effects when state changes to avoid performance issues
        if (this.isChasingActive !== wasChasing) {
            if (this.isChasingActive) {
                console.log('🎯 [Chase Detector] WOLF IS CHASING!');
                this.warningEl.style.display = 'block';
                this.warningEl.classList.add('pulse');
                // Add heartbeat effect
                this.el.sceneEl.camera.el.setAttribute('animation__shake', {
                    property: 'position',
                    dir: 'alternate',
                    dur: 200,
                    from: '0 1.6 0',
                    to: '0.02 1.6 0.02',
                    loop: true
                });
            } else {
                console.log('🎯 [Chase Detector] Wolf stopped chasing');
                this.warningEl.style.display = 'none';
                this.warningEl.classList.remove('pulse');
                this.el.sceneEl.camera.el.removeAttribute('animation__shake');
            }
        }
    },

    remove: function() {
        if (this.warningEl && this.warningEl.parentNode) {
            this.warningEl.parentNode.removeChild(this.warningEl);
        }
    }
});