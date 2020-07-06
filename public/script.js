let origBoard;
let huPlayer = 'O';
let aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function selectSym(sym) {
    huPlayer = sym;
    aiPlayer = sym === 'O' ? 'X' : 'O';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }
    if (aiPlayer === 'X') {
        turn(bestSpot(), aiPlayer);
    }
    document.querySelector('.selectSym').style.display = "none";
}

function startGame() {
    document.querySelector('.endgame').style.display = "none";
    document.querySelector('.endgame .text').innerText = "";
    document.querySelector('.selectSym').style.display = "block";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie())
            turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
    checkTie();
}

function checkRow(index,player){
    for(let i=index; i<index+3; i++){
        if(origBoard[i] != player)
            return false;
    }
    return true;
}

function checkCol(index,player){
    for(let i=index; i<9; i+=3){
        if(origBoard[i] != player)
            return false;
    }
    return true;
}
function checkD(player){
    if (origBoard[0] != player || origBoard[4] != player || origBoard[8] != player)
        return false;
    return true;
}

function checkRD(player){
    if (origBoard[2] != player || origBoard[4] != player || origBoard[6] != player)
        return false;
    return true;
}
function checkWin(board, player) {
    let gameWon = null;
    if(checkRow(0,player)){
        gameWon = {index: [0,1,2], player: player}
    }
    else if(checkRow(3,player)){
        gameWon = {index: [3,4,5], player: player}
    }
    else if(checkRow(6,player)){
        gameWon = {index: [6,7,8], player: player}
    }
    else if(checkCol(0,player)){
        gameWon = {index: [0,3,6], player: player}
    }
    else if(checkCol(1,player)){
        gameWon = {index: [1,4,7], player: player}
    }
    else if(checkCol(2,player)){
        gameWon = {index: [2,5,8], player: player}
    }else if(checkD(player)){
        gameWon = {index: [0,4,8], player: player}
    }else if(checkRD(player)){
        gameWon = {index: [2,4,6], player: player}
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let i=0; i<3; i++) {
        let index = gameWon.index[i];
        document.getElementById(index).style.backgroundColor =
            gameWon.player === huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
function emptySquares() {
    return origBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (cell of cells) {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie game");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer)
            move.score = minimax(newBoard, huPlayer).score;
        else
            move.score = minimax(newBoard, aiPlayer).score;
        newBoard[availSpots[i]] = move.index;
        if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
            return move;
        else
            moves.push(move);
    }

    let bestMove, bestScore;
    if (player === aiPlayer) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}