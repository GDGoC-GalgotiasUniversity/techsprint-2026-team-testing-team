// AR Logic Controller
console.log('AR Logic Initializing...');

let qrDetectionActive = false;
let videoElement = null;
let canvas = null;
let context = null;
let deviceZoomLevel = 0.25;

// Global AR System Handlers
window.addEventListener('error', function (e) {
    if (e.message && (e.message.includes('systems') || e.message.includes('Cannot read properties of null'))) {
        e.preventDefault();
        return false;
    }
});

// A-Frame Component to fix AR.js marker material warning
AFRAME.registerComponent('fix-arjs-marker-material', {
    init: function () {
        this.el.addEventListener('model-loaded', () => {
            const mesh = this.el.getObject3D('mesh');
            if (mesh) {
                mesh.traverse(child => {
                    if (child.material && child.material.markersAreaEnabled !== undefined) {
                        delete child.material.markersAreaEnabled;
                    }
                });
            }
        });
    }
});

// Detect device and set zoom level
function detectDeviceAndSetZoom() {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.screen.width;
    const pixelRatio = window.devicePixelRatio || 1;

    // Device specific logic (simplified from original for brevity, but kept core logic)
    if (userAgent.includes('iphone')) {
        deviceZoomLevel = screenWidth >= 414 ? 0.15 : 0.2;
    } else if (userAgent.includes('samsung') || userAgent.includes('galaxy')) {
        deviceZoomLevel = screenWidth >= 480 ? 0.1 : 0.15;
    } else if (pixelRatio >= 3) {
        deviceZoomLevel = 0.1;
    } else {
        deviceZoomLevel = 0.25;
    }
    console.log(`Zoom level set to: ${deviceZoomLevel}`);
}

// Force full screen video coverage
function forceFullScreenCoverage() {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((video, index) => {
        video.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            object-fit: cover !important;
            z-index: ${index === 0 ? -1 : -2} !important;
            margin: 0 !important;
            padding: 0 !important;
        `;
        
        if (video.paused && video.readyState >= 2) {
            video.play().catch(console.error);
        }
    });
}

function initAR() {
    console.log('Starting AR System...');
    
    // Zoom Setup
    detectDeviceAndSetZoom();

    // Orientation Handlers
    window.addEventListener('orientationchange', () => setTimeout(forceFullScreenCoverage, 100));
    window.addEventListener('resize', () => setTimeout(forceFullScreenCoverage, 100));

    // Continuous Monitoring
    setInterval(forceFullScreenCoverage, 2000);

    // Initial Camera Request
     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Prefer back camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        }).then(stream => {
            console.log('Camera access granted');
            // AR.js will handle the actual video element creation and binding
        }).catch(err => {
            console.error('Camera access denied:', err);
            alert('Camera access is required for AR experience.');
        });
    }

    // Camera Quality upgrade (simulated/delayed)
    setTimeout(() => {
        // Find AR.js video and optimize
        const v = document.querySelector('video');
        if (v) {
            videoElement = v;
            forceFullScreenCoverage();
        }
    }, 3000);
}

// Export initialization for UI to call
window.startARExperience = initAR;
