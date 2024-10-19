let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerName = 'Player';
let score = { Player: 0, AI: 0 };
let difficulty = 'easy'; // Default difficulty

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const scoreElement = document.getElementById('score');

function createBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell ? cell.toLowerCase() : ''}`;

        const symbol = document.createElement('span');
        symbol.innerText = cell;
        symbol.className = cell ? cell.toLowerCase() : '';
        symbol.style.opacity = cell ? 1 : 0;
        symbol.style.transition = 'opacity 0.5s';

        cellElement.appendChild(symbol);
        cellElement.addEventListener('click', () => handleCellClick(index, symbol));
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(index, symbol) {
    if (board[index] !== '' || !gameActive || currentPlayer === 'O') return;

    board[index] = currentPlayer;
    symbol.innerText = currentPlayer;
    symbol.style.opacity = 0;
    setTimeout(() => {
        symbol.style.opacity = 1;
    }, 10);

    symbol.parentElement.classList.add('bounce');
    setTimeout(() => {
        symbol.parentElement.classList.remove('bounce');
    }, 300);

    checkResult();

    if (gameActive) {
        currentPlayer = 'O';
        setTimeout(aiMove, 500);
    }
}

function checkResult() {
    let roundWon = false;

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === '' || board[b] === '' || board[c] === '') continue;
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === 'X') {
            statusElement.innerText = `${playerName} Wins! 🎉`;
            score.Player++;
        } else {
            statusElement.innerText = `AI Wins! 🤖`;
            score.AI++;
        }
        updateScores();
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusElement.innerText = 'Draw! 🤝';
        gameActive = false;
    }
}

function aiMove() {
    if (!gameActive) return;

    if (difficulty === 'hard') {
        makeSmartMove();
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.5) {
            makeSmartMove();
        } else {
            makeRandomMove();
        }
    } else {
        makeRandomMove();
    }
}

function makeRandomMove() {
    const availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(x => x !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (randomIndex !== undefined) {
        board[randomIndex] = 'O';
        createBoard();
        checkResult();
        currentPlayer = 'X'; // Switch back to Player after AI's move
    }
}

function makeSmartMove() {
    const availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(x => x !== null);
    
    // Check for winning move
    for (let index of availableCells) {
        if (canWin(index, 'O')) {
            board[index] = 'O';
            createBoard();
            checkResult();
            return;
        }
    }

    // Block player's winning move
    for (let index of availableCells) {
        if (canWin(index, 'X')) {
            board[index] = 'O';
            createBoard();
            checkResult();
            return;
        }
    }

    // Choose a random move if no winning or blocking move
    makeRandomMove();
}

function canWin(index, player) {
    const tempBoard = [...board];
    tempBoard[index] = player;
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return tempBoard[a] === player && tempBoard[b] === player && tempBoard[c] === player;
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.innerText = '';
    createBoard();
    updateScores();
}

function setDifficulty(level) {
    difficulty = level;
    resetGame();
}

function updateScores() {
    scoreElement.innerText = `${playerName}: ${score.Player} | AI: ${score.AI}`;
}

// Initialize the game
createBoard();
