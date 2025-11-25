class CuteTimer {
    constructor() {
        this.timeLeft = 25 * 60;
        this.totalTime = 25 * 60;
        this.isRunning = false;
        this.interval = null;
        this.mode = 'focus'; // focus, short, long
        this.isLoopMode = false; // loop mode toggle

        // Default Settings
        this.settings = {
            focus: 20,
            short: 5,
            long: 15
        };

        // Cute Spirit Messages
        this.messages = {
            break: [
                "Psst! Hey you! Your eyes look tired! Let's play hide and seek with the screen! 🙈",
                "Poke! Poke! Time to stretch those wiggle worms (your fingers)! 🐛",
                "Yaaawn! I'm sleepy! Let's take a tiny nap together! 💤",
                "Hey! The world outside is missing you! Go say hi to a plant! 🌱",
                "Bloop! System overload! Cuteness required! Take a break! 💖",
                "Stop! Hammer time! ...Just kidding, it's snack time! 🍪",
                "Your brain needs a hug! Go wrap yourself in a blanket burrito! 🌯",
                "I spy with my little eye... someone who needs a stretch! 🙆‍♂️",
                "Time out! Go wiggle your toes and shake your nose! 👃",
                "Knock knock! Who's there? A break! A break who? A break for YOU! 🚪"
            ],
            focus: [
                "Okay captain! Shields up! Let's dive back into the work ocean! 🌊",
                "Ready, set, GLOW! Time to be brilliant again! ✨",
                "Let's go make some magic happen! I believe in you! 🪄",
                "Focus mode activated! Beep boop! You are a productivity machine! 🤖",
                "Alrighty! Let's crush this task like a grape! (But gently) 🍇",
                "Back to work! Show that keyboard who's boss! ⌨️",
                "Zoom zoom! Let's race to the finish line! 🏎️",
                "Super power charging... COMPLETE! Go save the day! 🦸",
                "Let's build a castle of done things! Brick by brick! 🏰",
                "High five! ✋ Now let's get those hands back on the keyboard!"
            ]
        };

        // DOM Elements
        this.timeDisplay = document.querySelector('.time-display');
        this.timerLabel = document.querySelector('.timer-label');
        this.timerCircle = document.querySelector('.timer-circle-progress');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timerWrapper = document.querySelector('.timer-wrapper');
        this.presetBtns = document.querySelectorAll('.preset-btn');
        this.tomatoCharacter = document.getElementById('tomato-character');
        this.speechBubble = document.getElementById('speech-bubble');

        // Settings Elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.inputs = {
            focus: document.getElementById('focusTime'),
            short: document.getElementById('shortBreak'),
            long: document.getElementById('longBreak')
        };

        // Loop Elements
        this.loopToggle = document.getElementById('loopToggle');

        // Audio Context
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.init();
    }

    init() {
        this.updateDisplay();
        this.bindEvents();
        this.requestNotificationPermission();
        this.loadSettings();
        this.loadLoopMode();

        // Show welcome message
        setTimeout(() => this.showMessage("Hi there! Ready to focus? 🍅"), 1000);
    }

    bindEvents() {
        // Start/Pause Button
        this.startBtn.addEventListener('click', () => this.toggleTimer());

        // Reset Button
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // Presets
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setMode(e.target.dataset.mode));
        });

        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

        // Loop toggle
        this.loopToggle.addEventListener('change', (e) => this.handleLoopToggle(e));

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // Poke Tomato
        this.tomatoCharacter.addEventListener('click', () => this.pokeTomato());

        // Eye Tracking
        document.addEventListener('mousemove', (e) => this.handleEyeMovement(e));

        this.startBlinking();
    }

    startBlinking() {
        const blink = () => {
            const eyes = document.querySelectorAll('.eye');
            const pupils = document.querySelectorAll('.pupil');

            eyes.forEach(eye => eye.classList.add('blink'));
            pupils.forEach(pupil => pupil.classList.add('blink'));

            setTimeout(() => {
                eyes.forEach(eye => eye.classList.remove('blink'));
                pupils.forEach(pupil => pupil.classList.remove('blink'));
            }, 200);

            // Random interval between 2 and 6 seconds
            setTimeout(blink, Math.random() * 4000 + 2000);
        };

        setTimeout(blink, 2000);
    }

    handleEyeMovement(e) {
        const eyes = document.querySelectorAll('.eye');
        const pupils = document.querySelectorAll('.pupil');

        if (!eyes.length || !pupils.length) return;

        // Get center of the tomato/eyes area
        const eyeRect = eyes[0].getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        // Calculate angle
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);

        // Limit movement distance
        const distance = Math.min(
            10,
            Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10
        );

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        pupils.forEach(pupil => {
            // Keep the original pupil position offsets (cx, cy) in mind
            // We use transform to move them relative to their origin
            pupil.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    pokeTomato() {
        const messages = [
            "Hehe! That tickles! 🤭",
            "I'm ready when you are! 🍅",
            "Let's crush some tasks! 💪",
            "Don't forget to drink water! 💧",
            "You're doing great! ⭐",
            "Poke poke! 👀"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        this.showMessage(randomMsg);

        // Add a little bounce effect
        this.tomatoCharacter.style.transform = "translate(-50%, -50%) scale(0.95)";
        setTimeout(() => {
            this.tomatoCharacter.style.transform = "translate(-50%, -50%) scale(1)";
        }, 100);
    }

    showMessage(text, duration = 3000) {
        if (this.speechBubble) {
            this.speechBubble.textContent = text;
            this.speechBubble.classList.remove('hidden');

            // Clear any existing timeout
            if (this.messageTimeout) clearTimeout(this.messageTimeout);

            // Hide after duration
            this.messageTimeout = setTimeout(() => {
                this.speechBubble.classList.add('hidden');
            }, duration);
        }
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
            this.showMessage("Paused! Don't lose your flow! ⏸️");
        } else {
            this.startTimer();
            const msgs = this.mode === 'focus' ? this.messages.focus : this.messages.break;
            this.showMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        }
    }

    startTimer() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.isRunning = true;
            this.interval = setInterval(() => this.tick(), 1000);
            this.updateControlsUI();
            document.body.classList.add('timer-running');
            if (this.tomatoCharacter) this.tomatoCharacter.classList.add('working');
        }
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.updateControlsUI();
        document.body.classList.remove('timer-running');
        if (this.tomatoCharacter) this.tomatoCharacter.classList.remove('working');
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.settings[this.mode] * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgress();
        this.showMessage("Fresh start! 🌱");
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgress();
        } else {
            this.completeTimer();
        }
    }

    completeTimer() {
        this.pauseTimer();
        this.playAlarm();
        this.celebrate();

        const isFocus = this.mode === 'focus';
        const title = isFocus ? "Focus Complete! 🎉" : "Break Over! ⏰";
        const body = isFocus ? "Great job! Take a break." : "Time to get back to work!";

        this.sendNotification(title, body);
        this.showMessage(title + " " + body, 5000);

        // Handle loop mode
        if (this.isLoopMode && this.shouldContinueLoop()) {
            setTimeout(() => this.startNextLoopSession(), 2000);
        }
    }

    handleLoopToggle(e) {
        this.isLoopMode = e.target.checked;
        if (this.isLoopMode) {
            this.showMessage("Loop mode enabled! Will cycle until 19:00 🔄");
        } else {
            this.showMessage("Loop mode disabled");
        }
        // Save loop mode preference
        localStorage.setItem('tomato-loop-mode', this.isLoopMode);
    }

    shouldContinueLoop() {
        const now = new Date();
        const currentHour = now.getHours();

        // Stop loop at 19:00 (7 PM)
        if (currentHour >= 19) {
            this.showMessage("Loop mode ended! It's 19:00 or later 🌙", 5000);
            this.isLoopMode = false;
            this.loopToggle.checked = false;
            localStorage.setItem('tomato-loop-mode', false);
            return false;
        }

        return true;
    }

    startNextLoopSession() {
        // Determine next mode in the loop cycle
        let nextMode;
        if (this.mode === 'focus') {
            nextMode = 'short'; // Focus -> Short Break
        } else {
            nextMode = 'focus'; // Any break -> Focus
        }

        this.setMode(nextMode);
        this.startTimer();

        const modeMessage = nextMode === 'focus' ?
            this.messages.focus[Math.floor(Math.random() * this.messages.focus.length)] :
            this.messages.break[Math.floor(Math.random() * this.messages.break.length)];

        this.showMessage(`Loop: ${modeMessage}`, 3000);
    }

    loadLoopMode() {
        const saved = localStorage.getItem('tomato-loop-mode');
        if (saved !== null) {
            this.isLoopMode = saved === 'true';
            this.loopToggle.checked = this.isLoopMode;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.timeDisplay.textContent = timeString;
        document.title = `${timeString} - Tomato Timer`;
    }

    updateProgress() {
        const radius = 112.5;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (this.timeLeft / this.totalTime) * circumference;

        if (this.timerCircle) {
            this.timerCircle.style.strokeDashoffset = offset;
        }
    }

    setMode(mode) {
        this.mode = mode;
        this.timeLeft = this.settings[mode] * 60;
        this.totalTime = this.timeLeft;

        this.updateModeUI();
        this.updateDisplay();
        this.updateProgress();
        this.pauseTimer();

        const label = mode === 'focus' ? 'Focus Time' : (mode === 'short' ? 'Short Break' : 'Long Break');
        if (this.timerLabel) this.timerLabel.textContent = label;

        // Toggle sleeping state
        if (this.tomatoCharacter) {
            if (mode === 'short' || mode === 'long') {
                this.tomatoCharacter.classList.add('sleeping');
            } else {
                this.tomatoCharacter.classList.remove('sleeping');
            }
        }
    }

    updateModeUI() {
        this.presetBtns.forEach(btn => {
            if (btn.dataset.mode === this.mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateControlsUI() {
        if (this.isRunning) {
            this.startBtn.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
            this.startBtn.classList.add('active');
        } else {
            this.startBtn.innerHTML = '<span class="btn-icon">▶️</span> Start';
            this.startBtn.classList.remove('active');
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('tomato-settings');
        if (saved) {
            this.settings = JSON.parse(saved);
            if (this.inputs.focus) this.inputs.focus.value = this.settings.focus;
            if (this.inputs.short) this.inputs.short.value = this.settings.short;
            if (this.inputs.long) this.inputs.long.value = this.settings.long;
        }
    }

    saveSettings() {
        this.settings = {
            focus: parseInt(this.inputs.focus.value) || 25,
            short: parseInt(this.inputs.short.value) || 5,
            long: parseInt(this.inputs.long.value) || 15
        };

        localStorage.setItem('tomato-settings', JSON.stringify(this.settings));
        this.closeSettings();

        // Reset current timer to new setting
        this.setMode(this.mode);
        this.showMessage("Settings saved! ✅");
    }

    openSettings() {
        this.settingsModal.classList.add('active');
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
    }

    playAlarm() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    celebrate() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9f43'];
        for (let i = 0; i < 50; i++) {
            this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    sendNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'icon.svg',
                        vibrate: [200, 100, 200],
                        requireInteraction: true
                    });
                });
            } else {
                new Notification(title, {
                    body: body,
                    icon: 'icon.svg'
                });
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CuteTimer();
});
