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
            model.scale.set(0.8, 0.8, 0.8); // X, Y, Z

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
        const distance = 5 + Math.random() * (this.data.roamRadius - 5);
        
        this.destination.set(
            currentPos.x + Math.cos(angle) * distance,
            0,
            currentPos.z + Math.sin(angle) * distance
        );
        
        // Simple Boundary Check
        const boundaryRadius = 26;
        if (this.destination.length() > boundaryRadius) {
            this.destination.setLength(boundaryRadius);
        }
        
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
        
        this.isChasing = distanceToPlayer < this.data.detectionRange;
        
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
        direction.normalize();

        // Stop jittering when close
        if (currentPos.distanceTo(target) > 0.5) {
            const moveStep = direction.multiplyScalar(speed * (timeDelta / 1000));
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