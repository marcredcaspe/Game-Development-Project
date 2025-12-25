// UI Popup Component - Makes popup face camera
AFRAME.registerComponent('ui-popup', {
    tick: function() {
        if (this.el.getAttribute('visible')) {
            const camera = document.querySelector('#camera');
            if (camera) {
                const THREE = AFRAME.THREE;
                const Vector3 = THREE['Vector3'];
                const cameraWorldPos = new Vector3();
                camera.object3D.getWorldPosition(cameraWorldPos);
                this.el.object3D.lookAt(cameraWorldPos);
            }
        }
    }
});