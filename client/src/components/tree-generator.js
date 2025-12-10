// Tree Generator Component
AFRAME.registerComponent('tree-generator', {
    init: function() {
        this.generateTrees();
    },
    
    generateTrees: function() {
        const treeTrunkMaterial = { color: '#4b2e05', roughness: 0.8, metalness: 0.1 };
        const treeLeavesMaterial = { color: '#0b3d02', roughness: 0.95, metalness: 0.0 };
        
        const createRandomTree = (baseX, baseZ, scale = 1) => {
            const treeGroup = document.createElement('a-entity');
            
            const trunkHeight = 0.8 + Math.random() * 0.6;
            const trunkRadius = 0.12 + Math.random() * 0.08;
            
            const trunk = document.createElement('a-cylinder');
            trunk.setAttribute('radius', trunkRadius);
            trunk.setAttribute('height', trunkHeight);
            trunk.setAttribute('position', `0 ${trunkHeight / 2} 0`);
            trunk.setAttribute('material', treeTrunkMaterial);
            trunk.setAttribute('shadow', 'cast: true; receive: true');
            treeGroup.appendChild(trunk);
            
            const numLayers = Math.floor(2 + Math.random() * 4);
            let leavesY = trunkHeight + 0.3;
            
            for (let i = 0; i < numLayers; i++) {
                const layerScale = 1 - (i * 0.2);
                const radius = (0.6 + Math.random() * 0.4) * layerScale * scale;
                const height = (1.0 + Math.random() * 0.5) * layerScale * scale;
                
                const leaves = document.createElement('a-cone');
                leaves.setAttribute('radius-bottom', radius);
                leaves.setAttribute('height', height);
                leaves.setAttribute('segments-radial', 8);
                leaves.setAttribute('position', `0 ${leavesY} 0`);
                leaves.setAttribute('material', treeLeavesMaterial);
                leaves.setAttribute('shadow', 'cast: true; receive: true');
                
                leavesY += height * 0.8;
                treeGroup.appendChild(leaves);
            }
            
            treeGroup.setAttribute('rotation', `0 ${Math.random() * 360} 0`);
            const treeScale = 0.8 + Math.random() * 0.4;
            treeGroup.setAttribute('scale', `${treeScale} ${treeScale} ${treeScale}`);
            
            return treeGroup;
        };
        
        // Helper function to check if position is too close to tent
        const tentPosition = { x: 0, z: -6 }; // Tent is at camp position (0, 0, -6)
        const minDistanceFromTent = 10; // Minimum distance from tent
        
        const isTooCloseToTent = (x, z) => {
            const distance = Math.sqrt(
                Math.pow(x - tentPosition.x, 2) + 
                Math.pow(z - tentPosition.z, 2)
            );
            return distance < minDistanceFromTent;
        };
        
        // Generate trees in a circle around campfire (not tent)
        const numTrees = 30 + Math.floor(Math.random() * 20);
        let treesPlaced = 0;
        let attempts = 0;
        while (treesPlaced < numTrees && attempts < numTrees * 3) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = 5.5 + Math.random() * 4;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Skip if too close to tent
            if (isTooCloseToTent(x, z)) continue;
            
            const tree = createRandomTree(x, z);
            tree.setAttribute('position', `${x} 0 ${z}`);
            this.el.appendChild(tree);
            treesPlaced++;
        }
        
        // Extra scattered trees in middle area (away from tent)
        const extraTrees = 15 + Math.floor(Math.random() * 15);
        treesPlaced = 0;
        attempts = 0;
        while (treesPlaced < extraTrees && attempts < extraTrees * 3) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = 6 + Math.random() * 4;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Skip if too close to tent
            if (isTooCloseToTent(x, z)) continue;
            
            const tree = createRandomTree(x, z);
            tree.setAttribute('position', `${x} 0 ${z}`);
            this.el.appendChild(tree);
            treesPlaced++;
        }
        
        // Additional trees in outer area (away from tent)
        const outerTrees = 40 + Math.floor(Math.random() * 20);
        treesPlaced = 0;
        attempts = 0;
        while (treesPlaced < outerTrees && attempts < outerTrees * 3) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 12;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Skip if too close to tent
            if (isTooCloseToTent(x, z)) continue;
            
            const tree = createRandomTree(x, z);
            tree.setAttribute('position', `${x} 0 ${z}`);
            this.el.appendChild(tree);
            treesPlaced++;
        }
        
        // Add 200 more trees distributed across the scene (away from tent)
        const additionalTrees = 200;
        treesPlaced = 0;
        attempts = 0;
        while (treesPlaced < additionalTrees && attempts < additionalTrees * 3) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = 8 + Math.random() * 18; // Spread from 8 to 26 units from center
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Skip if too close to tent
            if (isTooCloseToTent(x, z)) continue;
            
            const tree = createRandomTree(x, z);
            tree.setAttribute('position', `${x} 0 ${z}`);
            this.el.appendChild(tree);
            treesPlaced++;
        }
    }
});