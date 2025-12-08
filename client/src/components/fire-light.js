AFRAME.registerComponent('fire-light', {
    schema: {
        speed: { type: 'number', default: 10 },
        baseIntensity: { type: 'number', default: 1 }
    },
    
    init: function() {
        this.originalIntensity = this.el.getAttribute('light').intensity;
        this.originalPosition = this.el.getAttribute('position');
        this.time = 0;
        
        // Configure shadow for point lights after a short delay to ensure light is initialized
        this.el.addEventListener('loaded', () => {
            this.configureShadows();
        });
        
        // Also try immediately in case loaded already fired
        setTimeout(() => {
            this.configureShadows();
        }, 100);
    },
    
    configureShadows: function() {
        if (this.el.getAttribute('light').type === 'point') {
            // Access the Three.js light object
            if (this.el.object3D && this.el.object3D.children[0]) {
                const light = this.el.object3D.children[0];
                if (light && light.shadow) {
                    light.castShadow = true;
                    // Configure shadow map size based on light ID
                    if (this.el.id === 'fireLight1') {
                        light.shadow.mapSize.width = 512;
                        light.shadow.mapSize.height = 512;
                        light.shadow.camera.near = 0.1;
                        light.shadow.camera.far = 8;
                    } else if (this.el.id === 'fireLight2') {
                        light.shadow.mapSize.width = 256;
                        light.shadow.mapSize.height = 256;
                        light.shadow.camera.near = 0.1;
                        light.shadow.camera.far = 6;
                    } else if (this.el.id === 'fireLight3') {
                        light.shadow.mapSize.width = 256;
                        light.shadow.mapSize.height = 256;
                        light.shadow.camera.near = 0.1;
                        light.shadow.camera.far = 5;
                    } else if (this.el.id === 'groundReflection') {
                        light.shadow.mapSize.width = 512;
                        light.shadow.mapSize.height = 512;
                        light.shadow.camera.near = 0.05;
                        light.shadow.camera.far = 4;
                    }
                }
            }
        }
    },
    
    tick: function(time, timeDelta) {
        this.time += timeDelta / 1000; // Convert to seconds
        
        const speed = this.data.speed;
        const flicker1 = Math.sin(this.time * speed);
        const flicker2 = Math.sin(this.time * speed * 1.3);
        const flicker3 = Math.sin(this.time * speed * 0.8);
        
        const light = this.el.getAttribute('light');
        const pos = this.el.getAttribute('position');
        
        // Different flicker patterns for different lights - only intensity changes, position stays fixed
        if (this.el.id === 'fireLight1') {
            light.intensity = this.originalIntensity * (1.0 + flicker1 * 0.15);
            // Keep position fixed at original
        } else if (this.el.id === 'fireLight2') {
            light.intensity = this.originalIntensity * (1.0 + flicker2 * 0.2);
            // Keep position fixed at original
        } else if (this.el.id === 'fireLight3') {
            light.intensity = this.originalIntensity * (1.0 + flicker3 * 0.25);
            // Keep position fixed at original
        } else if (this.el.id === 'fireGlow') {
            light.intensity = this.originalIntensity * (1.0 + flicker1 * 0.1);
            // Keep position fixed at original
        } else if (this.el.id === 'groundReflection') {
            light.intensity = this.originalIntensity * (1.0 + flicker2 * 0.15);
            // Keep position fixed at original
        }
        
        this.el.setAttribute('light', light);
        // Position stays at original - no movement
    }
});