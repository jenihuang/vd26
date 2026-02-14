/* ════════════════════════════════════════════
   PUZZLES.JS — Level-specific puzzle logic
   ════════════════════════════════════════════ */

/* ════════ LEVEL 1: WILL (CROSSWORD) ════════ */
const level1Data = [
    { clue: "Which resort did we first meet?", answer: "SQUAW", targetIdx: 4 },
    { clue: "Who is the bud?", answer: "MILO", targetIdx: 1 },
    { clue: "Babbaz birth name", answer: "WILBUR", targetIdx: 2 },
    { clue: "Our favorite nautical friend", answer: "NARWHAL", targetIdx: 6 }
];

function initLevel1() {
    showScreen('level1-screen');
    updateWordsDisplay(1);

    const cluesContainer = document.getElementById('crossword-clues-1');
    cluesContainer.innerHTML = '';

    level1Data.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.innerHTML = `<span class="clue-number">${i + 1}</span> ${item.clue}`;
        cluesContainer.appendChild(div);
    });

    const grid = document.getElementById('crossword-grid-1');
    grid.innerHTML = '';

    level1Data.forEach((item, rowIdx) => {
        const row = document.createElement('div');
        row.className = 'crossword-row';

        for (let i = 0; i < item.answer.length; i++) {
            const input = document.createElement('input');
            input.className = 'crossword-cell';
            if (i === item.targetIdx) input.classList.add('extraction-cell');

            input.maxLength = 1;
            input.dataset.row = rowIdx;
            input.dataset.col = i;
            input.dataset.expected = item.answer[i];

            input.addEventListener('input', (e) => {
                const val = e.target.value.toUpperCase();
                e.target.value = val;
                if (val === item.answer[i]) {
                    e.target.classList.add('correct');
                } else {
                    e.target.classList.remove('correct');
                }
                checkLevel1Complete();
                if (val.length === 1) {
                    const next = e.target.nextElementSibling;
                    if (next) next.focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '') {
                    const prev = e.target.previousElementSibling;
                    if (prev) prev.focus();
                }
            });

            row.appendChild(input);
        }
        grid.appendChild(row);
    });
}

function checkLevel1Complete() {
    const cells = document.querySelectorAll('#crossword-grid-1 .crossword-cell');
    const allCorrect = Array.from(cells).every(c => c.classList.contains('correct'));
    if (allCorrect) {
        levelComplete('Will');
    }
}

/* ════════ LEVEL 2: YOU (BLUR SLIDER) ════════ */
function initLevel2() {
    showScreen('level2-screen');
    updateWordsDisplay(2);

    const img = document.getElementById('blur-img');
    const slider = document.querySelector('.blur-slider');
    const inputCont = document.getElementById('you-input-container');

    slider.value = 0;
    img.style.filter = 'blur(20px)';
    inputCont.style.display = 'none';
    document.getElementById('you-input').value = '';
}

function updateBlur(val) {
    const img = document.getElementById('blur-img');
    const blurAmount = 20 - (val / 100 * 20);
    img.style.filter = `blur(${blurAmount}px)`;

    const inputCont = document.getElementById('you-input-container');
    if (val > 85) {
        if (inputCont.style.display === 'none') {
            inputCont.style.display = 'block';
        }
    }
}

function checkLevel2Input() {
    const val = document.getElementById('you-input').value.trim().toUpperCase();

    if (val === 'YOU') {
        levelComplete('you');
    } else if (val === 'STEVEN') {
        alert("Too formal! Who is he to me?");
    } else if (val === 'ME') {
        alert("Not me, but...");
    } else {
        const btn = document.querySelector('#you-input-container button');
        btn.style.animation = 'shake 0.4s ease';
        setTimeout(() => btn.style.animation = '', 400);
    }
}

/* ════════ LEVEL 3: BEE (WORD SEARCH) ════════ */
let foundWordsCount = 0;

function initLevel3() {
    showScreen('level3-screen');
    updateWordsDisplay(3);
    foundWordsCount = 0;
    document.getElementById('bee-final-question').style.display = 'none';

    document.querySelectorAll('.ws-word').forEach(w => w.classList.remove('revealed'));

    const gridEl = document.getElementById('ws-grid');
    gridEl.innerHTML = '';

    const placements = {
        'WORKER': [1, 9, 17, 25, 33, 41],
        'SWEET':  [56, 57, 58, 59, 60],
        'BUSY':   [4, 5, 6, 7],
        'LOYAL':  [13, 21, 29, 37, 45]
    };

    const cellsData = new Array(64).fill(null);

    for (let i = 0; i < 64; i++) {
        let letter = randomLetter();
        let wordBelonging = null;

        for (const [word, indices] of Object.entries(placements)) {
            if (indices.includes(i)) {
                wordBelonging = word;
                const letterIndex = indices.indexOf(i);
                letter = word[letterIndex];
                break;
            }
        }
        cellsData[i] = { letter: letter, word: wordBelonging };
    }

    cellsData.forEach((data, i) => {
        const cell = document.createElement('div');
        cell.className = 'ws-cell';
        cell.textContent = data.letter;
        if (data.word) cell.dataset.word = data.word;
        cell.onclick = () => selectWSCell(cell);
        gridEl.appendChild(cell);
    });
}

function randomLetter() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return abc[Math.floor(Math.random() * abc.length)];
}

function selectWSCell(cell) {
    if (!cell.dataset.word) {
        cell.style.animation = 'shake 0.4s ease';
        setTimeout(() => cell.style.animation = '', 400);
        return;
    }

    if (cell.classList.contains('found')) return;

    cell.classList.add('found');
    const word = cell.dataset.word;
    checkWordFound(word);
}

function checkWordFound(word) {
    const cells = document.querySelectorAll(`.ws-cell[data-word="${word}"]`);
    const allFound = Array.from(cells).every(c => c.classList.contains('found'));

    if (allFound) {
        const label = document.getElementById('word-' + word);
        if (!label.classList.contains('revealed')) {
            label.classList.add('revealed');
            foundWordsCount++;

            if (foundWordsCount === 4) {
                setTimeout(() => {
                    document.getElementById('bee-final-question').style.display = 'block';
                }, 500);
            }
        }
    }
}

function checkLevel3Input() {
    const val = document.getElementById('bee-input').value.trim().toUpperCase();
    if (val === 'BEE') {
        levelComplete('bee');
    } else {
        const btn = document.querySelector('#bee-final-question button');
        btn.style.animation = 'shake 0.4s ease';
        setTimeout(() => btn.style.animation = '', 400);
    }
}

/* ════════ LEVEL 4: MY (CLICKABLE STORY) ════════ */
let myClicks = 0;
const originalStoryHTML = `
    <p class="story-text">
        I love the life we've built together so far. Even when the
        econo<span class="hidden-my" onclick="clickMy(this)">my</span>
        is stressful, our home feels
        drea<span class="hidden-my" onclick="clickMy(this)">my</span>.
        There is a certain
        alche<span class="hidden-my" onclick="clickMy(this)">my</span>
        to how we make it all work as we continue to learn and grow together.
    </p>`;

function initLevel4() {
    showScreen('level4-screen');
    updateWordsDisplay(4);
    myClicks = 0;
    document.getElementById('story-container').innerHTML = originalStoryHTML;
}

function clickMy(el) {
    if (el.classList.contains('found')) return;

    el.classList.add('found');
    myClicks++;

    el.style.animation = 'popIn 0.3s ease';

    if (myClicks === 3) {
        setTimeout(() => {
            const container = document.getElementById('story-container');
            container.innerHTML = '<div style="font-size: 5rem; color: #d63384; font-family: \'Dancing Script\', cursive; animation: popIn 0.6s ease;">MY</div>';

            setTimeout(() => {
                levelComplete('my');
            }, 1500);
        }, 600);
    }
}

/* ════════ LEVEL 5: VALENTINE (PHOTO DRAG) ════════ */
const TARGET_WORD = "VALENTINE";
let correctPlacements = 0;
let shuffledLetters = [];
let selectedPhotoId = null;

function initLevel5() {
    showScreen('level5-screen');
    updateWordsDisplay(5);
    correctPlacements = 0;
    document.getElementById('valentine-final-input').style.display = 'none';

    shuffledLetters = TARGET_WORD.split('').sort(() => Math.random() - 0.5);

    const lBank = document.getElementById('letter-bank');
    lBank.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const lDiv = document.createElement('div');
        lDiv.className = 'v-letter';
        lDiv.id = `v-letter-${i}`;
        lDiv.textContent = '?';
        lBank.appendChild(lDiv);
    }

    const tContainer = document.getElementById('timeline-container');
    tContainer.innerHTML = '';
    const startYear = 2017;
    for (let i = 0; i < 9; i++) {
        const year = startYear + i;
        const slot = document.createElement('div');
        slot.className = 'year-slot';
        slot.textContent = year;
        slot.dataset.year = year;

        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => dropPhoto(e, year);
        slot.ontouchend = (e) => dropPhotoTouch(e, year);

        tContainer.appendChild(slot);
    }

    const pBank = document.getElementById('photo-bank');
    pBank.innerHTML = '';
    let years = [];
    for (let i = 0; i < 9; i++) years.push(startYear + i);
    years.sort(() => Math.random() - 0.5);

    years.forEach(year => {
        const img = document.createElement('img');
        img.src = `${year}.png`;
        img.className = 'draggable-photo';
        img.draggable = true;
        img.dataset.year = year;
        img.id = `photo-${year}`;

        img.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", year);
        };

        img.ontouchstart = (e) => {
            selectedPhotoId = year;
            img.style.opacity = '0.5';
        };
        img.ontouchend = (e) => {
            img.style.opacity = '1';
        };

        pBank.appendChild(img);
    });
}

function dropPhoto(e, slotYear) {
    e.preventDefault();
    const draggedYear = parseInt(e.dataTransfer.getData("text/plain"));
    handleDropLogic(draggedYear, slotYear, e.target);
}

function dropPhotoTouch(e, slotYear) {
    if (selectedPhotoId) {
        handleDropLogic(selectedPhotoId, slotYear, e.target);
        selectedPhotoId = null;
    }
}

function handleDropLogic(draggedYear, slotYear, target) {
    if (draggedYear === slotYear) {
        const img = document.getElementById(`photo-${draggedYear}`);
        const slot = target.closest('.year-slot');

        if (slot.querySelector('img')) return;

        img.classList.add('placed');
        img.draggable = false;
        img.ontouchstart = null;
        slot.appendChild(img);
        slot.classList.add('correct');

        revealNextScrambledLetter();
        correctPlacements++;

        if (correctPlacements === 9) {
            setTimeout(() => {
                document.getElementById('valentine-final-input').style.display = 'block';
            }, 500);
        }
    } else {
        const slot = target.closest('.year-slot');
        slot.style.animation = 'shake 0.4s ease';
        setTimeout(() => slot.style.animation = '', 400);
    }
}

function revealNextScrambledLetter() {
    const letter = shuffledLetters[correctPlacements];
    const tile = document.getElementById(`v-letter-${correctPlacements}`);

    tile.textContent = letter;
    tile.classList.add('revealed');
}

function checkLevel5Input() {
    const val = document.getElementById('final-word-input').value.trim().toUpperCase();
    if (val === 'VALENTINE' || val === 'VALENTINES') {
        levelComplete('valentine');
    } else {
        const btn = document.querySelector('#valentine-final-input button');
        btn.style.animation = 'shake 0.4s ease';
        setTimeout(() => btn.style.animation = '', 400);
    }
}
