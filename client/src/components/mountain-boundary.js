// Mountain Boundary Component - Creates mountains around the perimeter
AFRAME.registerComponent('mountain-boundary', {
    init: function() {
        this.generateMountains();
    },
    
    generateMountains: function() {
        const mountainMaterial = { color: '#4a4a4a', roughness: 0.95, metalness: 0.05 };
        const boundaryRadius = 28; // Distance from center
        const numWalls = 60; // Number of wall segments around the perimeter
        
        for (let i = 0; i < numWalls; i++) {
            const angle1 = (i / numWalls) * Math.PI * 2;
            const angle2 = ((i + 1) / numWalls) * Math.PI * 2;
            
            const x1 = Math.cos(angle1) * boundaryRadius;
            const z1 = Math.sin(angle1) * boundaryRadius;
            const x2 = Math.cos(angle2) * boundaryRadius;
            const z2 = Math.sin(angle2) * boundaryRadius;
            
            // Calculate wall position (midpoint) and dimensions
            const wallX = (x1 + x2) / 2;
            const wallZ = (z1 + z2) / 2;
            const wallLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
            const wallHeight = 15 + Math.random() * 5; // 15-20 units tall (like base of tall mountain)
            const wallThickness = 1.5; // Thickness of the wall
            
            // Calculate rotation to face outward
            const wallAngle = Math.atan2(z2 - z1, x2 - x1) * (180 / Math.PI);
            
            // Create wall segment (box shape)
            const wall = document.createElement('a-box');
            wall.setAttribute('width', wallLength);
            wall.setAttribute('height', wallHeight);
            wall.setAttribute('depth', wallThickness);
            wall.setAttribute('position', `${wallX} ${wallHeight / 2} ${wallZ}`);
            wall.setAttribute('rotation', `0 ${wallAngle} 0`);
            wall.setAttribute('material', mountainMaterial);
            wall.setAttribute('shadow', 'cast: true; receive: true');
            
            this.el.appendChild(wall);
        }
        
        // Add some additional wall segments for more coverage
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 26 + Math.random() * 2; // 26-28 units from center
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const wall = document.createElement('a-box');
            const wallLength = 2 + Math.random() * 2;
            const wallHeight = 12 + Math.random() * 4; // 12-16 units tall
            const wallThickness = 1.2;
            const wallAngle = Math.random() * 360;
            
            wall.setAttribute('width', wallLength);
            wall.setAttribute('height', wallHeight);
            wall.setAttribute('depth', wallThickness);
            wall.setAttribute('position', `${x} ${wallHeight / 2} ${z}`);
            wall.setAttribute('rotation', `0 ${wallAngle} 0`);
            wall.setAttribute('material', mountainMaterial);
            wall.setAttribute('shadow', 'cast: true; receive: true');
            
            this.el.appendChild(wall);
        }
    }
});