AFRAME.registerComponent('chase-detector', {
    schema: {
        wolf: { type: 'selector', default: '#wolf' }
    },

    init: function() {
        this.wolfComp = null;
        this.warningEl = null;
        
        // Create warning element
        this.warningEl = document.createElement('div');
        this.warningEl.className = 'chase-warning';
        this.warningEl.textContent = '⚠️ Wolf is chasing you! Run!';
        document.body.appendChild(this.warningEl);
        
        // Get the wolf component reference
        this.el.sceneEl.addEventListener('loaded', () => {
            this.wolfComp = this.data.wolf.components['wolf-controller'];
        });
    },

    tick: function() {
        if (this.wolfComp) {
            if (this.wolfComp.isChasing) {
                this.warningEl.style.display = 'block';
                // Add heartbeat effect or other visual cues
                this.el.sceneEl.camera.el.setAttribute('animation__shake', {
                    property: 'position',
                    dir: 'alternate',
                    dur: 200,
                    from: '0 1.6 0',
                    to: '0.02 1.6 0.02',
                    loop: true
                });
            } else {
                this.warningEl.style.display = 'none';
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