const board = document.getElementById('board');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popupContent');
const restartBtn = document.getElementById('restartBtn');

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let currentPlayer = 'X';
let cells = Array(9).fill(null);
let gameOver = false;

let score = { X: 0, O: 0 };

const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function initBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleMove);
    board.appendChild(cell);
  }

  popup.classList.add('hidden');
}

function handleMove(e) {
  const index = e.target.dataset.index;

  if (cells[index] || gameOver) return;

  clickSound.play();

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    winSound.play();
    score[currentPlayer]++;
    updateScores();
    showPopup(`🎉 Congratulations! Player ${currentPlayer} Wins!`);
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell)) {
    drawSound.play();
    showPopup(`😕 It's a Draw! Try Again.`);
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(player) {
  return winPatterns.some(pattern => {
    return pattern.every(index => cells[index] === player);
  });
}

function showPopup(message) {
  popupContent.innerHTML = `<h2>${message}</h2><button onclick="initBoard()">Play Again</button>`;
  popup.classList.remove('hidden');
}

function updateScores() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
}

restartBtn.addEventListener('click', initBoard);

initBoard();
