// Tree Generator Component with Collision Detection
AFRAME.registerComponent('tree-generator', {
    schema: {
        count: { type: 'number', default: 300 },
        minRadius: { type: 'number', default: 5 },
        maxRadius: { type: 'number', default: 58 },
        collision: { type: 'boolean', default: true },
        playerCollision: { type: 'boolean', default: true },
        wolfPassable: { type: 'boolean', default: true }
    },

    init: function() {
        // Ensure THREE is available
        if (typeof THREE === 'undefined') {
            console.error('THREE is not defined!');
            return;
        }
        
        // Define safe zones where trees shouldn't spawn
        this.safeZones = [
            // Camp area (larger safe zone)
            { x: 0, z: -50, radius: 8 },
            // Player starting position
            { x: 0, z: 50, radius: 5 },
            // Wolf starting position
            { x: 0, z: -20, radius: 4 },
            // Firewood areas
            { x: 2, z: -49, radius: 3 },
            { x: -2, z: -49, radius: 3 }
        ];
        
        // Store tree positions for collision checking
        this.treePositions = [];
        this.minTreeDistance = 1.8; // Minimum distance between trees
        
        this.generateForest();
    },
    
    isPositionSafe: function(x, z) {
        // Check against safe zones
        for (const zone of this.safeZones) {
            const distance = Math.sqrt(
                Math.pow(x - zone.x, 2) + 
                Math.pow(z - zone.z, 2)
            );
            if (distance < zone.radius) {
                return false;
            }
        }
        
        // Check against other trees
        for (const treePos of this.treePositions) {
            const distance = Math.sqrt(
                Math.pow(x - treePos.x, 2) + 
                Math.pow(z - treePos.z, 2)
            );
            if (distance < this.minTreeDistance) {
                return false;
            }
        }
        
        return true;
    },
    
    generateForest: function() {
        const treeTrunkMaterial = { 
            color: '#4b2e05', 
            roughness: 0.8, 
            metalness: 0.1 
        };
        
        const treeLeavesMaterial = { 
            color: '#0b3d02', 
            roughness: 0.95, 
            metalness: 0.0 
        };
        
        // Create very tall trees (10-15 meters tall)
        const createTallTree = (x, z, scale = 1) => {
            const treeGroup = document.createElement('a-entity');
            treeGroup.setAttribute('class', 'tree-collidable');
            treeGroup.setAttribute('position', `${x} 0 ${z}`);
            
            // Base tree height (very tall)
            const baseHeight = 12 + Math.random() * 6; // 12-18 meters
            const trunkHeight = baseHeight * 0.7;
            const trunkRadius = 0.3 + Math.random() * 0.2;
            
            // Create trunk
            const trunk = document.createElement('a-cylinder');
            trunk.setAttribute('radius', trunkRadius);
            trunk.setAttribute('height', trunkHeight);
            trunk.setAttribute('position', `0 ${trunkHeight / 2} 0`);
            trunk.setAttribute('material', treeTrunkMaterial);
            trunk.setAttribute('shadow', 'cast: true; receive: true');
            treeGroup.appendChild(trunk);
            
            // Create leaves/canopy
            const leavesHeight = baseHeight * 0.3;
            const leavesRadius = 2.5 + Math.random() * 1.5;
            
            const leaves = document.createElement('a-cone');
            leaves.setAttribute('radius-bottom', leavesRadius);
            leaves.setAttribute('radius-top', 0);
            leaves.setAttribute('height', leavesHeight);
            leaves.setAttribute('segments-radial', 16);
            leaves.setAttribute('position', `0 ${trunkHeight + (leavesHeight * 0.2)} 0`);
            leaves.setAttribute('material', treeLeavesMaterial);
            leaves.setAttribute('shadow', 'cast: true; receive: true');
            treeGroup.appendChild(leaves);
            
            // Random rotation and scale variation
            treeGroup.setAttribute('rotation', `0 ${Math.random() * 360} 0`);
            const treeScale = 0.8 + Math.random() * 0.4;
            treeGroup.setAttribute('scale', `${treeScale} ${treeScale} ${treeScale}`);
            
            // Add collision boxes if enabled
            if (this.data.collision && this.data.playerCollision) {
                // Main trunk collision cylinder
                const collisionBox = document.createElement('a-entity');
                collisionBox.setAttribute('collision-body', {
                    type: 'cylinder',
                    radius: trunkRadius * 1.3, // Slightly larger than visual
                    height: trunkHeight * 0.95, // Slightly shorter than visual
                    offset: `0 ${(trunkHeight * 0.95) / 2} 0`
                });
                collisionBox.setAttribute('visible', false);
                treeGroup.appendChild(collisionBox);
                
                // Add a ground disc to prevent getting too close
                const groundDisc = document.createElement('a-entity');
                groundDisc.setAttribute('collision-body', {
                    type: 'cylinder',
                    radius: trunkRadius * 3,
                    height: 0.5,
                    offset: '0 0.25 0'
                });
                groundDisc.setAttribute('visible', false);
                treeGroup.appendChild(groundDisc);
            }
            
            return treeGroup;
        };
        
        // Generate dense forest covering the entire map
        const numTrees = this.data.count;
        let treesPlaced = 0;
        let attempts = 0;
        const maxAttempts = numTrees * 5;
        
        // First, create a dense ring around the camp area
        const innerRingTrees = 80;
        for (let i = 0; i < innerRingTrees && attempts < maxAttempts; i++) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = this.data.minRadius + Math.random() * 10;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            if (!this.isPositionSafe(x, z)) continue;
            
            const tree = createTallTree(x, z);
            this.el.appendChild(tree);
            this.treePositions.push({ x, z, entity: tree });
            treesPlaced++;
        }
        
        // Generate random distribution across entire map
        while (treesPlaced < numTrees && attempts < maxAttempts) {
            attempts++;
            
            // Use polar coordinates for better distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = this.data.minRadius + Math.random() * (this.data.maxRadius - this.data.minRadius);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            if (!this.isPositionSafe(x, z)) continue;
            
            const tree = createTallTree(x, z);
            this.el.appendChild(tree);
            this.treePositions.push({ x, z, entity: tree });
            treesPlaced++;
            
            // Every 10 trees, also place one at opposite side for symmetry
            if (treesPlaced % 10 === 0 && treesPlaced < numTrees - 1) {
                const oppositeX = -x * 0.8;
                const oppositeZ = -z * 0.8;
                
                if (this.isPositionSafe(oppositeX, oppositeZ)) {
                    const oppositeTree = createTallTree(oppositeX, oppositeZ);
                    this.el.appendChild(oppositeTree);
                    this.treePositions.push({ x: oppositeX, z: oppositeZ, entity: oppositeTree });
                    treesPlaced++;
                }
            }
        }
        
        console.log(`Generated ${treesPlaced} trees after ${attempts} attempts`);
        
        // Add some undergrowth/bushes
        this.addUndergrowth();
        
        // Dispatch event when trees are done generating - MOVED TO HERE
        setTimeout(() => {
            this.el.sceneEl.emit('trees-generated');
            console.log('Trees generated event dispatched');
        }, 100);
    },
    
    addUndergrowth: function() {
        const bushMaterial = { 
            color: '#1e4d1e', 
            roughness: 0.95, 
            metalness: 0.0 
        };
        
        // Add bushes between trees
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 6 + Math.random() * 52;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Skip if too close to important areas
            let tooClose = false;
            for (const zone of this.safeZones) {
                const distance = Math.sqrt(
                    Math.pow(x - zone.x, 2) + 
                    Math.pow(z - zone.z, 2)
                );
                if (distance < zone.radius + 1) {
                    tooClose = true;
                    break;
                }
            }
            if (tooClose) continue;
            
            // Skip if too close to existing trees
            let treeTooClose = false;
            for (const treePos of this.treePositions) {
                const distance = Math.sqrt(
                    Math.pow(x - treePos.x, 2) + 
                    Math.pow(z - treePos.z, 2)
                );
                if (distance < 1.5) {
                    treeTooClose = true;
                    break;
                }
            }
            if (treeTooClose) continue;
            
            const bush = document.createElement('a-sphere');
            bush.setAttribute('radius', 0.4 + Math.random() * 0.3);
            bush.setAttribute('position', `${x} 0.4 ${z}`);
            bush.setAttribute('material', bushMaterial);
            bush.setAttribute('shadow', 'cast: true; receive: true');
            this.el.appendChild(bush);
        }
    }
});

// Collision Body Component for simple collision detection
AFRAME.registerComponent('collision-body', {
    schema: {
        type: { type: 'string', default: 'box' },
        radius: { type: 'number', default: 0.5 },
        height: { type: 'number', default: 1 },
        width: { type: 'number', default: 1 },
        depth: { type: 'number', default: 1 },
        offset: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
    },
    
    init: function() {
        this.collisionArea = new THREE.Box3();
        this.helper = null;
        
        // Create visual helper for debugging
        if (this.el.sceneEl.hasAttribute('debug')) {
            this.createDebugHelper();
        }
    },
    
    createDebugHelper: function() {
        const data = this.data;
        if (data.type === 'cylinder') {
            this.helper = document.createElement('a-cylinder');
            this.helper.setAttribute('radius', data.radius);
            this.helper.setAttribute('height', data.height);
            this.helper.setAttribute('position', data.offset);
            this.helper.setAttribute('material', 'color: red; opacity: 0.3; transparent: true');
            this.helper.setAttribute('visible', 'true');
            this.el.appendChild(this.helper);
        } else if (data.type === 'box') {
            this.helper = document.createElement('a-box');
            this.helper.setAttribute('width', data.width);
            this.helper.setAttribute('height', data.height);
            this.helper.setAttribute('depth', data.depth);
            this.helper.setAttribute('position', data.offset);
            this.helper.setAttribute('material', 'color: red; opacity: 0.3; transparent: true');
            this.helper.setAttribute('visible', 'true');
            this.el.appendChild(this.helper);
        }
    },
    
    update: function() {
        this.updateCollisionBounds();
    },
    
    updateCollisionBounds: function() {
        const worldPosition = new THREE.Vector3();
        const worldScale = new THREE.Vector3();
        
        this.el.object3D.getWorldPosition(worldPosition);
        this.el.object3D.getWorldScale(worldScale);
        
        const data = this.data;
        
        if (data.type === 'cylinder') {
            const radius = data.radius * Math.max(worldScale.x, worldScale.z);
            const height = data.height * worldScale.y;
            
            const min = new THREE.Vector3(
                worldPosition.x - radius + data.offset.x,
                worldPosition.y + data.offset.y - height/2,
                worldPosition.z - radius + data.offset.z
            );
            
            const max = new THREE.Vector3(
                worldPosition.x + radius + data.offset.x,
                worldPosition.y + data.offset.y + height/2,
                worldPosition.z + radius + data.offset.z
            );
            
            this.collisionArea.set(min, max);
        } else {
            const halfWidth = (data.width * worldScale.x) / 2;
            const halfHeight = (data.height * worldScale.y) / 2;
            const halfDepth = (data.depth * worldScale.z) / 2;
            
            const min = new THREE.Vector3(
                worldPosition.x - halfWidth + data.offset.x,
                worldPosition.y - halfHeight + data.offset.y,
                worldPosition.z - halfDepth + data.offset.z
            );
            
            const max = new THREE.Vector3(
                worldPosition.x + halfWidth + data.offset.x,
                worldPosition.y + halfHeight + data.offset.y,
                worldPosition.z + halfDepth + data.offset.z
            );
            
            this.collisionArea.set(min, max);
        }
    },
    
    tick: function() {
        this.updateCollisionBounds();
    },
    
    checkCollision: function(position, radius = 0.5) {
        const playerBox = new THREE.Box3(
            new THREE.Vector3(position.x - radius, position.y - 1, position.z - radius),
            new THREE.Vector3(position.x + radius, position.y + 2, position.z + radius)
        );
        
        return playerBox.intersectsBox(this.collisionArea);
    }
});

// Enhanced Movement Controls with Improved Collision Detection
if (!AFRAME.components['movement-controls']) {
    AFRAME.registerComponent('movement-controls', {
        schema: {
            speed: { type: 'number', default: 0.1 },
            collisionRadius: { type: 'number', default: 0.5 },
            debug: { type: 'boolean', default: false }
        },
        
        init: function() {
            // Check if THREE is available
            if (typeof THREE === 'undefined') {
                console.error('THREE is not available for movement-controls');
                return;
            }
            
            this.direction = new THREE.Vector3();
            this.velocity = new THREE.Vector3();
            this.lastPosition = new THREE.Vector3();
            this.collisionBodies = [];
            
            // Get initial position
            this.el.object3D.getWorldPosition(this.lastPosition);
            
            // Find collision bodies
            this.findCollisionBodies();
            
            // Listen for scene-loaded to find trees that might be added later
            this.el.sceneEl.addEventListener('loaded', () => {
                setTimeout(() => this.findCollisionBodies(), 1000);
            });
            
            // Debug visualization
            if (this.data.debug) {
                this.createDebugSphere();
            }
        },
        
        findCollisionBodies: function() {
            this.collisionBodies = [];
            const scene = this.el.sceneEl;
            if (!scene) return;
            
            // Find all collision bodies
            const collidables = scene.querySelectorAll('[collision-body]');
            collidables.forEach(body => {
                const component = body.components['collision-body'];
                if (component) {
                    this.collisionBodies.push(component);
                }
            });
            
            console.log(`Found ${this.collisionBodies.length} collision bodies`);
        },
        
        createDebugSphere: function() {
            const sphere = document.createElement('a-sphere');
            sphere.setAttribute('radius', this.data.collisionRadius);
            sphere.setAttribute('position', '0 1 0');
            sphere.setAttribute('material', 'color: blue; opacity: 0.3; transparent: true');
            sphere.setAttribute('visible', 'true');
            this.el.appendChild(sphere);
        },
        
        tick: function() {
            if (typeof THREE === 'undefined') return;
            
            const data = this.data;
            const currentPosition = new THREE.Vector3();
            this.el.object3D.getWorldPosition(currentPosition);
            
            // Calculate movement vector
            this.velocity.set(0, 0, 0);
            
            if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) {
                this.velocity.z -= data.speed;
            }
            if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) {
                this.velocity.z += data.speed;
            }
            if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) {
                this.velocity.x -= data.speed;
            }
            if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) {
                this.velocity.x += data.speed;
            }
            
            // Apply movement with collision detection
            if (this.velocity.lengthSq() > 0) {
                this.applyMovementWithCollision(currentPosition, this.velocity);
            }
            
            // Update last position
            this.lastPosition.copy(currentPosition);
        },
        
        applyMovementWithCollision: function(currentPos, velocity) {
            // Calculate proposed position
            const proposedPos = currentPos.clone().add(velocity);
            
            // Check for collisions at proposed position
            let collisionDetected = false;
            
            for (const body of this.collisionBodies) {
                if (body.checkCollision(proposedPos, this.data.collisionRadius)) {
                    collisionDetected = true;
                    
                    // Calculate direction from collision body to player
                    const bodyPos = new THREE.Vector3();
                    body.el.object3D.getWorldPosition(bodyPos);
                    
                    // Calculate push-away vector
                    const pushDirection = proposedPos.clone().sub(bodyPos);
                    pushDirection.y = 0; // Keep on ground plane
                    
                    if (pushDirection.length() > 0.01) {
                        pushDirection.normalize();
                        
                        // Try to slide along the collision
                        const slideVelocity = velocity.clone();
                        const dot = slideVelocity.dot(pushDirection);
                        
                        // Remove component going into the collision
                        slideVelocity.sub(pushDirection.multiplyScalar(dot));
                        
                        // Try the slid movement
                        const slidePos = currentPos.clone().add(slideVelocity.multiplyScalar(0.5));
                        
                        // Check if slid position is valid
                        let slideValid = true;
                        for (const otherBody of this.collisionBodies) {
                            if (otherBody !== body && otherBody.checkCollision(slidePos, this.data.collisionRadius)) {
                                slideValid = false;
                                break;
                            }
                        }
                        
                        if (slideValid) {
                            this.el.object3D.position.add(slideVelocity);
                            return;
                        }
                    }
                    break;
                }
            }
            
            // If no collision, move to proposed position
            if (!collisionDetected) {
                this.el.object3D.position.add(velocity);
            } else {
                // If collision and can't slide, don't move
                // You could add a slight vibration or sound effect here
            }
        },
        
        isKeyPressed: function(code) {
            return AFRAME.utils.keyboard.isKeyPressed(code);
        }
    });
}

// Simple Physics System (optional, for more advanced physics)
AFRAME.registerSystem('simple-physics', {
    init: function() {
        this.colliders = [];
        this.dynamicBodies = [];
    },
    
    registerCollider: function(component) {
        this.colliders.push(component);
    },
    
    unregisterCollider: function(component) {
        const index = this.colliders.indexOf(component);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }
});