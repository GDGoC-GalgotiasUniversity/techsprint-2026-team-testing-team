// UI Interactions Controller

document.addEventListener('DOMContentLoaded', () => {
    const landingOverlay = document.getElementById('landing-overlay');
    const startBtn = document.getElementById('btn-start-ar');
    const loadingScreen = document.getElementById('loading-screen');
    const arHud = document.getElementById('ar-hud');

    // Initial State
    loadingScreen.classList.add('hidden');
    arHud.classList.add('hidden');

    startBtn.addEventListener('click', () => {
        // Transition: Landing -> Loading
        landingOverlay.classList.add('hidden');
        setTimeout(() => {
            landingOverlay.style.display = 'none';
            loadingScreen.classList.remove('hidden');
        }, 500);

        // Start AR
        if (window.startARExperience) {
            window.startARExperience();
        }

        // Simulate Init Delay -> Show HUD
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            arHud.classList.remove('hidden');
            arHud.classList.add('visible');

            // Show toast/notification
            showStatus('AR System Active');
        }, 3500);
    });

    function showStatus(msg) {
        const dot = document.querySelector('.status-dot');
        const text = document.querySelector('.status-check span');
        if (text) text.innerText = msg;
    }
});
