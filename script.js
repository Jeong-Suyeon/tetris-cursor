// --- 상수 ---
const COLS = 10;
const ROWS = 20;
const FALL_INTERVAL = 800;
const LINE_SCORES = [0, 100, 300, 500, 800];

const SHAPES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    colorClass: "piece-i",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    colorClass: "piece-o",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    colorClass: "piece-t",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    colorClass: "piece-s",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    colorClass: "piece-z",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    colorClass: "piece-j",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    colorClass: "piece-l",
  },
};

// --- DOM ---
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const gameOverEl = document.getElementById("game-over");

// --- 게임 상태 ---
let score = 0;
let lockedBoard = [];
let currentPiece = null;
let fallTimer = null;
let isPlaying = false;
let isGameOver = false;

// --- 유틸리티 ---

function isInsideBoard(row, col) {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

function cloneShape(shape) {
  return shape.map(function (row) {
    return row.slice();
  });
}

function getCellElement(row, col) {
  return boardEl.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  );
}

function fillCellElement(cell, colorClass) {
  if (cell) {
    cell.classList.add("filled", colorClass);
  }
}

function forEachOccupiedCell(piece, rowOffset, colOffset, callback) {
  const shape = piece.shape;

  for (let shapeRow = 0; shapeRow < shape.length; shapeRow++) {
    for (let shapeCol = 0; shapeCol < shape[shapeRow].length; shapeCol++) {
      if (!shape[shapeRow][shapeCol]) {
        continue;
      }

      const boardRow = piece.row + shapeRow + rowOffset;
      const boardCol = piece.col + shapeCol + colOffset;
      const shouldContinue = callback(boardRow, boardCol);

      if (shouldContinue === false) {
        return false;
      }
    }
  }

  return true;
}

function isGameActive() {
  return isPlaying && !isGameOver && currentPiece !== null;
}

function showGameOverOverlay() {
  if (gameOverEl) {
    gameOverEl.hidden = false;
  }
}

function hideGameOverOverlay() {
  if (gameOverEl) {
    gameOverEl.hidden = true;
  }
}

function isRowFull(row) {
  return row.every(function (cell) {
    return cell !== null;
  });
}

// --- 보드 ---

function createEmptyBoard() {
  const board = [];

  for (let row = 0; row < ROWS; row++) {
    board.push(new Array(COLS).fill(null));
  }

  return board;
}

function clearLines(board) {
  let clearedLineCount = 0;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!isRowFull(board[row])) {
      continue;
    }

    board.splice(row, 1);
    board.unshift(new Array(COLS).fill(null));
    clearedLineCount += 1;
    row += 1;
  }

  return clearedLineCount;
}

// --- 블록 ---

function createPiece(type) {
  const pieceTypes = Object.keys(SHAPES);

  if (!type || !SHAPES[type]) {
    type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  }

  const shapeDef = SHAPES[type];
  const shapeWidth = shapeDef.shape[0].length;

  return {
    type: type,
    shape: cloneShape(shapeDef.shape),
    row: 0,
    col: Math.floor((COLS - shapeWidth) / 2),
    colorClass: shapeDef.colorClass,
  };
}

function canMove(piece, deltaCol, deltaRow, board) {
  if (!piece || !board) {
    return false;
  }

  return forEachOccupiedCell(piece, deltaRow, deltaCol, function (boardRow, boardCol) {
    if (!isInsideBoard(boardRow, boardCol) || board[boardRow][boardCol]) {
      return false;
    }
  });
}

function lockPiece(piece, board) {
  if (!piece || !board) {
    return;
  }

  forEachOccupiedCell(piece, 0, 0, function (boardRow, boardCol) {
    if (isInsideBoard(boardRow, boardCol)) {
      board[boardRow][boardCol] = piece.colorClass;
    }
  });
}

function rotateShape(shape) {
  const rowCount = shape.length;
  const colCount = shape[0].length;
  const rotated = [];

  for (let col = 0; col < colCount; col++) {
    const newRow = [];

    for (let row = rowCount - 1; row >= 0; row--) {
      newRow.push(shape[row][col]);
    }

    rotated.push(newRow);
  }

  return rotated;
}

function tryMove(deltaCol, deltaRow) {
  if (!canMove(currentPiece, deltaCol, deltaRow, lockedBoard)) {
    return false;
  }

  currentPiece.col += deltaCol;
  currentPiece.row += deltaRow;
  return true;
}

function tryRotate() {
  const previousShape = currentPiece.shape;

  currentPiece.shape = rotateShape(previousShape);

  if (!canMove(currentPiece, 0, 0, lockedBoard)) {
    currentPiece.shape = previousShape;
    return false;
  }

  return true;
}

function dropOneRow() {
  if (canMove(currentPiece, 0, 1, lockedBoard)) {
    currentPiece.row += 1;
    return true;
  }

  return false;
}

function softDrop() {
  if (!dropOneRow()) {
    lockAndSpawnNext();
  }
}

function hardDrop() {
  while (canMove(currentPiece, 0, 1, lockedBoard)) {
    currentPiece.row += 1;
  }

  lockAndSpawnNext();
}

// --- 점수 ---

function addScore(linesCleared) {
  if (linesCleared <= 0) {
    return;
  }

  const points = LINE_SCORES[linesCleared] || linesCleared * 100;
  score += points;
}

function applyLineClearScore(linesCleared) {
  if (linesCleared > 0) {
    addScore(linesCleared);
    renderScore();
  }
}

// --- 게임 흐름 ---

function lockAndSpawnNext() {
  if (!currentPiece) {
    return;
  }

  lockPiece(currentPiece, lockedBoard);
  applyLineClearScore(clearLines(lockedBoard));
  currentPiece = createPiece();

  if (!canMove(currentPiece, 0, 0, lockedBoard)) {
    triggerGameOver();
  }
}

function triggerGameOver() {
  isGameOver = true;
  currentPiece = null;
  stopGameLoop();
  showGameOverOverlay();
  renderGame();
}

function tick() {
  if (!isGameActive()) {
    return;
  }

  if (!dropOneRow()) {
    lockAndSpawnNext();
  }

  renderGame();
}

function startGameLoop() {
  stopGameLoop();
  isPlaying = true;
  fallTimer = setInterval(tick, FALL_INTERVAL);
}

function stopGameLoop() {
  isPlaying = false;

  if (fallTimer) {
    clearInterval(fallTimer);
    fallTimer = null;
  }
}

function initGame() {
  stopGameLoop();
  isGameOver = false;
  hideGameOverOverlay();
  score = 0;
  lockedBoard = createEmptyBoard();
  currentPiece = createPiece();
  renderScore();
  renderBoard();
  renderGame();
  startGameLoop();
}

// --- 렌더링 ---

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardEl.appendChild(cell);
    }
  }
}

function clearBoardCells() {
  const cells = boardEl.querySelectorAll(".cell");

  cells.forEach(function (cell) {
    cell.className = "cell";
  });
}

function drawLockedBoard(board) {
  for (let row = 0; row < ROWS; row++) {
    if (!board[row]) {
      continue;
    }

    for (let col = 0; col < COLS; col++) {
      if (!board[row][col]) {
        continue;
      }

      fillCellElement(getCellElement(row, col), board[row][col]);
    }
  }
}

function drawPiece(piece) {
  if (!piece) {
    return;
  }

  forEachOccupiedCell(piece, 0, 0, function (boardRow, boardCol) {
    if (!isInsideBoard(boardRow, boardCol)) {
      return;
    }

    fillCellElement(getCellElement(boardRow, boardCol), piece.colorClass);
  });
}

function renderGame() {
  clearBoardCells();
  drawLockedBoard(lockedBoard);
  drawPiece(currentPiece);
}

function renderScore() {
  scoreEl.textContent = score;
}

// --- 입력 ---

const GAME_ACTIONS = {
  moveLeft: function () {
    tryMove(-1, 0);
  },
  moveRight: function () {
    tryMove(1, 0);
  },
  softDrop: function () {
    softDrop();
  },
  rotate: function () {
    tryRotate();
  },
  hardDrop: function () {
    hardDrop();
  },
};

const KEY_ACTIONS = {
  ArrowLeft: GAME_ACTIONS.moveLeft,
  ArrowRight: GAME_ACTIONS.moveRight,
  ArrowDown: GAME_ACTIONS.softDrop,
  ArrowUp: GAME_ACTIONS.rotate,
  Space: GAME_ACTIONS.hardDrop,
};

const TOUCH_ACTION_MAP = {
  left: GAME_ACTIONS.moveLeft,
  right: GAME_ACTIONS.moveRight,
  down: GAME_ACTIONS.softDrop,
  rotate: GAME_ACTIONS.rotate,
  drop: GAME_ACTIONS.hardDrop,
};

function performGameAction(actionFn) {
  if (!isGameActive() || !actionFn) {
    return;
  }

  actionFn();
  renderGame();
}

function handleKeyDown(event) {
  const action = KEY_ACTIONS[event.code];

  if (!action) {
    return;
  }

  event.preventDefault();
  performGameAction(action);
}

function handleTouchControlClick(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = TOUCH_ACTION_MAP[button.dataset.action];
  performGameAction(action);
}

function bindEventListeners() {
  startBtn.addEventListener("click", initGame);
  restartBtn.addEventListener("click", initGame);
  document.addEventListener("keydown", handleKeyDown);

  const touchControlsEl = document.querySelector(".touch-controls");

  if (touchControlsEl) {
    touchControlsEl.addEventListener("click", handleTouchControlClick);
  }
}

bindEventListeners();
initGame();
