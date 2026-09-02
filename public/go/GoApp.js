const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const height = canvas.height;
const width = canvas.width;
const size = 13;
const gridMargin = 50;
const gridSize = (height - (2 * gridMargin)) / (size - 1);

let board = new Board(size, size, 0);
let prevX = -100;
let prevY = -100;

// Standard hoshi (star point) positions for a 13x13 board
const hoshi = [
    [3,3],[3,6],[3,9],
    [6,3],[6,6],[6,9],
    [9,3],[9,6],[9,9],
];

function physicalPos(pos) {
    return (pos * gridSize) + gridMargin;
}

function logicalCoordinates(pos) {
    return Math.floor((pos - gridMargin + (gridSize / 2)) / gridSize);
}

function drawWoodGrain() {
    const stops = ["#D2B48C", "#C9A978", "#B0895D", "#A17A4D"];

    const gx = ctx.createLinearGradient(0, 0, width, 0);
    gx.addColorStop(0,    stops[0]);
    gx.addColorStop(0.5,  stops[1]);
    gx.addColorStop(0.75, stops[2]);
    gx.addColorStop(1,    stops[3]);

    const gy = ctx.createLinearGradient(0, 0, 0, height);
    gy.addColorStop(0,    stops[0]);
    gy.addColorStop(0.5,  stops[1]);
    gy.addColorStop(0.75, stops[2]);
    gy.addColorStop(1,    stops[3]);

    ctx.fillStyle = gx;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = gy;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
}

function drawBoard() {
    ctx.strokeStyle = '#5a3e1b';
    ctx.lineWidth = 1;

    for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(physicalPos(i), gridMargin);
        ctx.lineTo(physicalPos(i), height - gridMargin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(gridMargin, physicalPos(i));
        ctx.lineTo(width - gridMargin, physicalPos(i));
        ctx.stroke();
    }

    // Star points
    ctx.fillStyle = '#5a3e1b';
    for (const [row, col] of hoshi) {
        ctx.beginPath();
        ctx.arc(physicalPos(col), physicalPos(row), 3.5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawPiece(row, col, player, isLastMove = false) {
    const x = physicalPos(col);
    const y = physicalPos(row);
    const r = gridSize * 0.45;

    const gradient = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
    if (player === 0) {
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#111');
    } else {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#cccccc');
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = player === 0 ? '#000' : '#aaa';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if (isLastMove) {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.28, 0, 2 * Math.PI);
        ctx.fillStyle = player === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)';
        ctx.fill();
    }
}

function drawGhostPiece(row, col) {
    const x = physicalPos(col);
    const y = physicalPos(row);
    const r = gridSize * 0.45;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = board.player === 0 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.5)';
    ctx.fill();
    ctx.strokeStyle = board.player === 0 ? '#000' : '#aaa';
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

function drawPts() {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const player = board.pts[row * size + col];
            if (player === 0 || player === 1) {
                const isLast = board.lastMove &&
                               board.lastMove.row === row &&
                               board.lastMove.col === col;
                drawPiece(row, col, player, isLast);
            }
        }
    }
}

function refreshBoard() {
    ctx.clearRect(0, 0, width, height);
    drawWoodGrain();
    drawBoard();
    drawPts();
}

// --- Input handling ---

canvas.addEventListener('click', handleClick);
canvas.addEventListener('mousemove', trackMouse);
canvas.addEventListener('mouseleave', refreshBoard);

document.getElementById('passBtn').addEventListener('click', handlePass);
document.getElementById('newGameBtn').addEventListener('click', newGame);

function handleClick(event) {
    if (board.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const logCol = logicalCoordinates(event.clientX - rect.left);
    const logRow = logicalCoordinates(event.clientY - rect.top);

    if (logCol < 0 || logCol >= size || logRow < 0 || logRow >= size) return;

    const move = board.getLoc(logRow, logCol);
    if (board.occupiedHuh(move)) return;

    // Snapshot the board state before this move for ko checking and rollback
    const snapshot = [...board.pts];
    const stateBeforeMove = JSON.stringify(snapshot);

    // Tentatively place the stone
    board.pts[move] = board.player;

    // Resolve captures
    const deleteArr = board.checkAllSurr(board.getOppColor());
    let captured = 0;
    for (let i = 0; i < board.pts.length; i++) {
        if (deleteArr[i]) {
            board.pts[i] = null;
            captured++;
        }
    }

    // Suicide: placed group must still have liberties after captures resolve
    if (board.initCheckSurr(move, board.player)) {
        board.pts = snapshot;
        return;
    }

    // Ko: resulting board state cannot match the state before the previous move
    if (board.prevBoardState !== null && board.getState() === board.prevBoardState) {
        board.pts = snapshot;
        return;
    }

    // Commit
    if (board.player === 0) board.blackScore += captured;
    else board.whiteScore += captured;

    board.prevBoardState = stateBeforeMove;
    board.consecutivePasses = 0;
    board.lastMove = { row: logRow, col: logCol };

    board.changePlayer();
    updateUI();
    refreshBoard();
}

function handlePass() {
    if (board.gameOver) return;

    board.consecutivePasses++;
    board.lastMove = null;
    board.prevBoardState = null;

    if (board.consecutivePasses >= 2) {
        board.gameOver = true;
        board.changePlayer();
        updateUI();
        showGameOver();
        refreshBoard();
        return;
    }

    board.changePlayer();
    updateUI();
    refreshBoard();
}

function newGame() {
    board = new Board(size, size, 0);
    prevX = -100;
    prevY = -100;
    document.getElementById('gameOverPanel').style.display = 'none';
    updateUI();
    refreshBoard();
}

function showGameOver() {
    const { blackTerritory, whiteTerritory } = board.calculateTerritory();
    const blackTotal = board.blackScore + blackTerritory;
    const whiteTotal = board.whiteScore + whiteTerritory;

    let winner;
    if (blackTotal > whiteTotal) winner = 'Black wins!';
    else if (whiteTotal > blackTotal) winner = 'White wins!';
    else winner = 'Tie!';

    document.getElementById('finalScores').innerHTML =
        `Black: ${board.blackScore} + ${blackTerritory} = <strong>${blackTotal}</strong><br>` +
        `White: ${board.whiteScore} + ${whiteTerritory} = <strong>${whiteTotal}</strong><br>` +
        `<span class="winner">${winner}</span>`;
    document.getElementById('gameOverPanel').style.display = 'block';
}

function updateUI() {
    document.getElementById('blackScore').textContent = board.blackScore;
    document.getElementById('whiteScore').textContent = board.whiteScore;

    const stone = document.getElementById('turnStone');
    const text = document.getElementById('turnText');
    stone.className = 'stone-indicator ' + (board.player === 0 ? 'black' : 'white');
    text.textContent = board.gameOver ? 'Game Over' : (board.player === 0 ? "Black's Turn" : "White's Turn");
}

function trackMouse(event) {
    if (board.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    prevX = event.clientX - rect.left;
    prevY = event.clientY - rect.top;

    const logCol = logicalCoordinates(prevX);
    const logRow = logicalCoordinates(prevY);

    refreshBoard();

    if (logCol >= 0 && logCol < size && logRow >= 0 && logRow < size) {
        const move = board.getLoc(logRow, logCol);
        if (!board.occupiedHuh(move)) {
            drawGhostPiece(logRow, logCol);
        }
    }
}

// Initial render
refreshBoard();
updateUI();
