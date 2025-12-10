AFRAME.registerComponent('wolf-controller', {
    schema: {
        // We set the default to empty so it forces you to provide the path in HTML
        src: { type: 'string', default: '' }, 
        speed: { type: 'number', default: 1.5 },
        roamRadius: { type: 'number', default: 20 },
        detectionRange: { type: 'number', default: 8 },
        wanderInterval: { type: 'int', default: 5000 },
        chaseSpeed: { type: 'number', default: 3 }
    },

    init: function () {
        this.model = null;
        this.mixer = null; // For animations
        this.destination = new THREE.Vector3();
        this.isChasing = false;
        this.player = document.querySelector('#rig');
        this.wanderTimer = 0;
        
        // Chase detection with hysteresis to prevent flickering
        this.chaseHysteresis = 1.5; // Stop chasing at 1.5x the detection range
        
        // Use the src from the HTML attribute, or fallback if needed
        const modelUrl = this.data.src || '/wolf_model/wolf.glb';
        
        const loader = new THREE.GLTFLoader();
        console.log('🐺 [Wolf] Loading model from:', modelUrl);

        loader.load(modelUrl, (gltf) => {
            console.log('🐺 [Wolf] Model loaded successfully!');
            const model = gltf.scene || gltf.scenes[0];
            
            if (!model) {
                console.error('❌ [Wolf] No scene found in model');
                return;
            }

            // Find where 'model' is defined, then add this:
            model.scale.set(0.03, 0.03, 0.03); // X, Y, Z

            this.model = model;
            this.el.setObject3D('mesh', this.model);

            // --- ANIMATION SETUP ---
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.model);
                const action = this.mixer.clipAction(gltf.animations[0]); // Play first animation found
                action.play();
                console.log('🎬 [Wolf] Playing animation:', gltf.animations[0].name);
            }
            
            this.setRandomDestination();

        }, undefined, (err) => {
            console.error('❌ [Wolf] Failed to load model:', err);
        });
    },

    setRandomDestination: function() {
        const currentPos = this.el.object3D.position;
        const angle = Math.random() * Math.PI * 2;
        const distance = 3 + Math.random() * (this.data.roamRadius - 3);
        
        let newX = currentPos.x + Math.cos(angle) * distance;
        let newZ = currentPos.z + Math.sin(angle) * distance;
        
        // Enforce boundary BEFORE setting destination
        const boundaryRadius = 25;
        const distFromOrigin = Math.sqrt(newX * newX + newZ * newZ);
        
        if (distFromOrigin > boundaryRadius) {
            const scale = boundaryRadius / distFromOrigin;
            newX *= scale;
            newZ *= scale;
        }
        
        this.destination.set(newX, 0, newZ);
        console.log('🐺 [Wolf] New destination:', this.destination);
        
        this.wanderTimer = 0;
    },

    updateMovement: function(timeDelta) {
        if (!this.model || !this.player) return;

        // Update Animation (Walk cycle)
        if (this.mixer) {
            this.mixer.update(timeDelta / 1000);
        }
        
        const currentPos = this.el.object3D.position;
        const playerPos = this.player.object3D.position;
        const distanceToPlayer = currentPos.distanceTo(playerPos);
        
        // Chase detection with hysteresis - prevents flickering at boundaries
        if (this.isChasing) {
            // If chasing, continue until player is further away (1.5x detection range)
            if (distanceToPlayer > this.data.detectionRange * this.chaseHysteresis) {
                this.isChasing = false;
                console.log('🐺 [Wolf] Lost the player, resuming wander');
            }
        } else {
            // If not chasing, start chasing when player enters detection range
            if (distanceToPlayer < this.data.detectionRange) {
                this.isChasing = true;
                console.log('🐺 [Wolf] Detected player! Starting chase');
            }
        }
        
        let target = this.destination;
        let speed = this.data.speed;

        if (this.isChasing) {
            target = playerPos;
            speed = this.data.chaseSpeed;
        } else {
            this.wanderTimer += timeDelta;
            if (this.wanderTimer >= this.data.wanderInterval) {
                this.setRandomDestination();
            }
        }

        // Move Logic
        const direction = new THREE.Vector3()
            .subVectors(target, currentPos);
            
        // Ignore Y difference (don't fly up to player's head)
        direction.y = 0;
        
        const directionLength = direction.length();
        
        // Stop jittering when close (reduced threshold for smaller model)
        if (directionLength > 0.3) {
            // Normalize for direction calculation
            direction.normalize();
            
            // Apply movement: direction is normalized, multiply by speed and delta time
            const moveStep = direction.clone().multiplyScalar(speed * (timeDelta / 1000));
            currentPos.add(moveStep);

            // Rotation (Face the direction)
            const angle = Math.atan2(direction.x, direction.z);
            this.model.rotation.y = angle;
        } else if (!this.isChasing) {
            this.setRandomDestination();
        }

        // Apply Position
        this.el.setAttribute('position', {
            x: currentPos.x,
            y: 0, // Force ground level
            z: currentPos.z
        });
    },

    tick: function(time, timeDelta) {
        if (timeDelta) {
            this.updateMovement(timeDelta);
        }
    }
});