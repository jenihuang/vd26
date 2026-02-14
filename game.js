/* ════════════════════════════════════════════
   GAME.JS — Game state, flow control, and utilities
   ════════════════════════════════════════════ */

/* ── GAME STATE ── */
const WORDS = ['Will', 'you', 'bee', 'my', 'valentine'];
const solvedWords = new Array(WORDS.length).fill(null);
let solvedCount = 0;
let currentLevel = 0;

/* Puzzle presentation order: you, valentine, my, bee, Will
   Each number is the original puzzle/level number (1-indexed) */
const PUZZLE_ORDER = [2, 5, 4, 3, 1];

/* ── BACKGROUND: Floating Hearts ── */
function createFloatingHearts() {
    const container = document.getElementById('hearts-bg');
    const hearts = ['💕', '💗', '💖', '💘', '💝', '❤️', '🩷'];
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (8 + Math.random() * 12) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        heart.style.fontSize = (16 + Math.random() * 20) + 'px';
        container.appendChild(heart);
    }
}

/* ── UTILITIES ── */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    screen.classList.remove('active');
    void screen.offsetWidth; // Reflow to retrigger animation
    screen.classList.add('active');
}

function updateProgress() {
    const pct = (solvedCount / WORDS.length) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
}

function updateWordsDisplay(level) {
    const container = document.getElementById('words-display-' + level);
    if (!container) return;
    container.innerHTML = '';
    WORDS.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'revealed-word' + (solvedWords[i] ? '' : ' pending');
        span.textContent = solvedWords[i] || '???';
        container.appendChild(span);
    });
}

function setBackground(cls) {
    document.body.className = cls;
}

function celebrate() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 700);

    const container = document.getElementById('celebration-hearts');
    if (!container) {
        const newCont = document.createElement('div');
        newCont.id = 'celebration-hearts';
        newCont.className = 'celebration-hearts';
        document.body.appendChild(newCont);
    }
    const emojis = ['💖', '💗', '💕', '✨', '🩷', '💘'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'celebration-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = (20 + Math.random() * 60) + '%';
        heart.style.top = (40 + Math.random() * 30) + '%';
        heart.style.animationDelay = (Math.random() * 0.5) + 's';
        document.getElementById('celebration-hearts').appendChild(heart);
        setTimeout(() => heart.remove(), 4500);
    }
}

function showHint(level) {
    const hint = document.getElementById('hint-' + level);
    if (hint) hint.style.display = 'block';
}

/* ── LEVEL FLOW ── */
function levelComplete(word) {
    const wordIndex = WORDS.indexOf(word);
    solvedWords[wordIndex] = word;
    solvedCount++;
    updateProgress();
    celebrate();
    setTimeout(() => {
        currentLevel++;
        if (currentLevel >= WORDS.length) {
            showFinalScreen();
        } else {
            initLevel(currentLevel + 1);
        }
    }, 1200);
}

function startGame() {
    currentLevel = 0;
    solvedCount = 0;
    for (let i = 0; i < WORDS.length; i++) solvedWords[i] = null;
    initLevel(1);
}

function initLevel(step) {
    const puzzleNum = PUZZLE_ORDER[step - 1];
    const backgrounds = ['bg-level1', 'bg-level2', 'bg-level3', 'bg-level4', 'bg-level5'];
    setBackground(backgrounds[step - 1]);

    switch (puzzleNum) {
        case 1: initLevel1(); break;
        case 2: initLevel2(); break;
        case 3: initLevel3(); break;
        case 4: initLevel4(); break;
        case 5: initLevel5(); break;
    }

    // Update the puzzle badge to show the current step number
    const activeScreen = document.querySelector('.screen.active');
    const badge = activeScreen.querySelector('.level-badge');
    if (badge) badge.textContent = `Puzzle ${step} of 5`;
}

/* ── FINAL SCREEN ── */
function showFinalScreen() {
    setBackground('bg-final');
    showScreen('final-screen');
    const msg = document.getElementById('final-message-text');
    msg.innerHTML = '';
    const w = ['Will', 'you', 'bee', 'my', 'valentine?'];
    w.forEach((txt, i) => {
        setTimeout(() => {
            if (msg.innerHTML) msg.innerHTML += ' ';
            const s = document.createElement('span');
            s.textContent = txt;
            s.style.opacity = '0';
            s.style.display = 'inline-block';
            s.style.transition = 'all 0.6s ease';
            s.style.transform = 'translateY(20px)';
            msg.appendChild(s);
            requestAnimationFrame(() => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
        }, i * 600);
    });
    setTimeout(() => {
        const btns = document.getElementById('yes-no-buttons');
        btns.style.display = 'flex';
        btns.style.opacity = '0';
        btns.style.transition = 'opacity 1s';
        requestAnimationFrame(() => btns.style.opacity = '1');
    }, w.length * 600 + 500);
}

/* ── RUNAWAY "NO" BUTTON ── */
function runAway(btn) {
    if (btn.parentNode !== document.body) {
        document.body.appendChild(btn);
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxLeft = viewportWidth - btn.offsetWidth - 50;
    const maxTop = viewportHeight - btn.offsetHeight - 50;

    const newLeft = Math.max(20, Math.random() * maxLeft);
    const newTop = Math.max(20, Math.random() * maxTop);

    btn.style.position = 'fixed';
    btn.style.left = newLeft + 'px';
    btn.style.top = newTop + 'px';
    btn.style.zIndex = '9999';
    btn.style.transform = 'none';
    btn.style.margin = '0';
}

/* ── "YES" — Reveal Poem + Photos ── */
function sayYes() {
    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        noBtn.remove();
    }

    const btnContainer = document.getElementById('yes-no-buttons');
    if (btnContainer) {
        btnContainer.style.display = 'none';
    }

    setBackground('bg-final');
    showScreen('reveal-screen');

    for (let i = 0; i < 5; i++) setTimeout(() => celebrate(), i * 400);
}

/* ── INIT ON PAGE LOAD ── */
createFloatingHearts();
