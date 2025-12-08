AFRAME.registerComponent('wolf-controller', {
    schema: {
        // Updated to the correct GLTF path
        src: { type: 'string', default: 'wolf_model/scene.gltf' }, 
        speed: { type: 'number', default: 1.5 },
        roamRadius: { type: 'number', default: 20 },
        detectionRange: { type: 'number', default: 8 },
        wanderInterval: { type: 'int', default: 5000 },
        chaseSpeed: { type: 'number', default: 3 }
    },

    init: function () {
        this.model = null;
        this.destination = new THREE.Vector3();
        this.isChasing = false;
        this.player = document.querySelector('#rig');
        this.wanderTimer = 0;
        
        // THREE.GLTFLoader handles both GLB and GLTF formats correctly.
        const loader = new THREE.GLTFLoader();
        console.log('[Wolf] Loading model from:', this.data.src);

        loader.load(this.data.src, (gltf) => {
            console.log('[Wolf] Model loaded successfully!');
            this.model = gltf.scene || (gltf.scenes && gltf.scenes[0]);
            
            if (!this.model) {
                console.error('[Wolf] No scene found in model');
                return;
            }

            // Configure shadows
            this.model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    // Adjust materials if needed
                    if (node.material) {
                        node.material.metalness = 0.1;
                        node.material.roughness = 0.8;
                    }
                }
            });

            // Scale and position the wolf
            this.model.scale.set(0.8, 0.8, 0.8);
            this.el.object3D.add(this.model);
            
            // Set initial destination
            this.setRandomDestination();
            
            console.log('[Wolf] Model added to scene with roaming behavior');

        }, undefined, (err) => {
            console.error('[Wolf] Failed to load model:', err);
        });

        // Add click event for debugging
        this.el.addEventListener('click', () => {
            console.log('Wolf clicked! Position:', this.el.getAttribute('position'));
            this.setRandomDestination();
        });
    },

    setRandomDestination: function() {
        const currentPos = this.el.object3D.position;
        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * (this.data.roamRadius - 5);
        
        this.destination.set(
            currentPos.x + Math.cos(angle) * distance,
            0, // Keep on ground level
            currentPos.z + Math.sin(angle) * distance
        );
        
        // Ensure destination is within boundaries
        const boundaryRadius = 26;
        const distFromCenter = Math.sqrt(this.destination.x * this.destination.x + this.destination.z * this.destination.z);
        if (distFromCenter > boundaryRadius) {
            // Scale back to boundary
            const scale = boundaryRadius / distFromCenter;
            this.destination.multiplyScalar(scale);
        }
        
        // Avoid going too close to camp
        const campPos = new THREE.Vector3(0, 0, -6);
        if (this.destination.distanceTo(campPos) < 10) {
            // Move destination away from camp
            const direction = this.destination.clone().sub(campPos).normalize();
            this.destination.copy(campPos).add(direction.multiplyScalar(10));
        }
        
        this.wanderTimer = 0;
    },

    updateMovement: function(timeDelta) {
        if (!this.model || !this.player) return;
        
        const currentPos = this.el.object3D.position;
        const playerPos = this.player.object3D.position;
        const distanceToPlayer = currentPos.distanceTo(playerPos);
        
        // Check if player is within detection range
        this.isChasing = distanceToPlayer < this.data.detectionRange;
        
        if (this.isChasing) {
            // Chase the player
            this.destination.copy(playerPos);
            
            // Move toward player
            const direction = new THREE.Vector3()
                .subVectors(playerPos, currentPos)
                .normalize();
            
            const speed = this.data.chaseSpeed * (timeDelta / 1000);
            currentPos.add(direction.multiplyScalar(speed));
            
            // Rotate wolf to face player
            if (this.model) {
                const angle = Math.atan2(direction.x, direction.z);
                this.model.rotation.y = angle;
            }
            
        } else {
            // Normal wandering behavior
            this.wanderTimer += timeDelta;
            
            // Set new random destination periodically
            if (this.wanderTimer >= this.data.wanderInterval) {
                this.setRandomDestination();
            }
            
            // Move toward destination
            const direction = new THREE.Vector3()
                .subVectors(this.destination, currentPos)
                .normalize();
            
            const distanceToDest = currentPos.distanceTo(this.destination);
            const speed = this.data.speed * (timeDelta / 1000);
            
            if (distanceToDest > 0.5) {
                currentPos.add(direction.multiplyScalar(speed));
                
                // Rotate wolf to face movement direction
                if (this.model) {
                    const angle = Math.atan2(direction.x, direction.z);
                    this.model.rotation.y = angle;
                }
            } else {
                // Reached destination, get new one
                this.setRandomDestination();
            }
        }
        
        // Update A-Frame position
        this.el.setAttribute('position', {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z
        });
        
        // Make wolf look slightly downward for more natural appearance
        if (this.model) {
            this.model.rotation.x = -0.1;
        }
    },

    tick: function(time, timeDelta) {
        if (timeDelta) {
            this.updateMovement(timeDelta);
        }
    },

    remove: function() {
        // Cleanup if needed
    }
});