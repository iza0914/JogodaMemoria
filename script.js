const characters = [
    { name: "Tinker Bell", icon: "🧚‍♀️" },
    { name: "Névoa Prateada", icon: "💧" },
    { name: "Roseta", icon: "🌹" },
    { name: "Iridessa", icon: "☀️" },
    { name: "Vidia", icon: "💜" },
    { name: "Periwinkle", icon: "❄️" },
    { name: "Zarina", icon: "🏴‍☠️" },
    { name: "Rainha Clarion", icon: "👑" },
    { name: "Terence", icon: "✨" },
    { name: "Clank", icon: "🔧" },
    { name: "Bobble", icon: "🛠️" },
    { name: "Fada Mary", icon: "🌼" },
    { name: "Lord Milori", icon: "🧊" }
];

const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const pairsElement = document.getElementById("pairs");
const restartButton = document.getElementById("restart-button");
const victoryMessage = document.getElementById("victory-message");
const playAgainButton = document.getElementById("play-again-button");

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let timerStarted = false;
let lockBoard = false;

function shuffleCards() {
    const cards = [...characters, ...characters];

    for (let i = cards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }

    return cards;
}

function createCards() {
    gameBoard.innerHTML = "";

    const shuffledCards = shuffleCards();

    shuffledCards.forEach(character => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", "Carta fechada");

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="symbol">✧</span>
                    <p>Fada Mágica</p>
                </div>

                <div class="card-back">
                    <span class="character-icon">${character.icon}</span>
                    <span class="character-name">${character.name}</span>
                </div>
            </div>
        `;

        card.dataset.name = character.name;

        card.addEventListener("click", () => {
            flipCard(card);
        });

        gameBoard.appendChild(card);
    });
}

function startTimer() {
    if (timerStarted) return;

    timerStarted = true;

    timerInterval = setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerElement.textContent =
            `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }, 1000);
}

function flipCard(card) {
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    startTimer();

    card.classList.add("flipped");
    card.setAttribute("aria-label", `Carta: ${card.dataset.name}`);

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;

        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.name === secondCard.dataset.name) {
        disableMatchedCards();
    } else {
        unflipCards();
    }
}

function disableMatchedCards() {
    const [firstCard, secondCard] = flippedCards;

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.disabled = true;
    secondCard.disabled = true;

    matchedPairs++;
    pairsElement.textContent = `${matchedPairs} / ${characters.length}`;

    resetTurn();

    if (matchedPairs === characters.length) {
        finishGame();
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.remove("flipped");
            card.setAttribute("aria-label", "Carta fechada");
        });

        resetTurn();
    }, 1000);
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}

function finishGame() {
    clearInterval(timerInterval);
    victoryMessage.classList.remove("hidden");
}

function restartGame() {
    clearInterval(timerInterval);

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    timerStarted = false;
    lockBoard = false;

    timerElement.textContent = "00:00";
    movesElement.textContent = "0";
    pairsElement.textContent = `0 / ${characters.length}`;

    victoryMessage.classList.add("hidden");

    createCards();
}

restartButton.addEventListener("click", restartGame);
playAgainButton.addEventListener("click", restartGame);

restartGame();