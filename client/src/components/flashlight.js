AFRAME.registerComponent('flashlight', {
    schema: {
        toggleKey: { type: 'string', default: 'f' },
        initialOn: { type: 'boolean', default: false },
        offIntensity: { type: 'number', default: 0.0 },
        onIntensity: { type: 'number', default: 3.0 } // Matches the intensity in index.html
    },

    init: function () {
        this.light = this.el;
        this.isOn = this.data.initialOn;

        this.onKeyDown = this.onKeyDown.bind(this);
        document.addEventListener('keydown', this.onKeyDown);
        
        // Set initial state
        this.updateState();
        
        console.log('[Flashlight] Initialized. Press', this.data.toggleKey, 'to toggle.');
    },

    onKeyDown: function (evt) {
        if (evt.key.toLowerCase() === this.data.toggleKey.toLowerCase()) {
            this.isOn = !this.isOn;
            this.updateState();
            
            // Emit an event for other components (like stalkerLogic) to react
            this.el.emit(this.isOn ? 'flashlightOn' : 'flashlightOff');
        }
    },

    updateState: function() {
        if (this.isOn) {
            // Turn the light ON
            this.light.setAttribute('light', 'intensity', this.data.onIntensity);
            this.light.setAttribute('visible', true);
        } else {
            // Turn the light OFF
            this.light.setAttribute('light', 'intensity', this.data.offIntensity);
            this.light.setAttribute('visible', false);
        }
    },

    remove: function () {
        document.removeEventListener('keydown', this.onKeyDown);
    }
});