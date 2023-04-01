'use strict'

window.addEventListener("contextmenu", e => e.preventDefault());

const MINE = '💣'
const EMPTY = ''
const MARK = '🚩'

var gBoard
var gLifes = 3
var gdificulty = 4

// var gLevel = {
//     SIZE: 4,
//     MINES: 2
// }

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    isVictory: false,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard(4, 4)
    renderBoard(gBoard, '.board')
    gGame.isOn = true
}

function chooseGameDifficulty(elDifficulty) {
   if (elDifficulty.classList.contain('easy')) gLevel.SIZE = 4
   else if (elDifficulty.classList.contain('medium')) gLevel.SIZE = 4
   else if (elDifficulty.classList.contain('hard')) gLevel.SIZE = 4

console.log(elDifficulty)
}

function buildBoard(Rows, Cols) {

    const board = []
    for (var i = 0; i < Rows; i++) {
        board[i] = []
        for (var j = 0; j < Cols; j++) {
            board[i][j] = {
                type: EMPTY,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    console.log(board)
    return board
}

function getRandomMines(board) {
    console.log(board)
    var randI = getRandomInt(0, 3)
    var randJ = getRandomInt(0, 3)
    board[randI][randJ].isMine = true
}

function renderBoard(board, selector) {
    getRandomMines(board)
    getRandomMines(board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className
            if (cell.isShown) {
                if (cell.isMine) {
                    className = 'mine'
                    cell = MINE
                }
                else {
                    cell = EMPTY
                    className = `empty`
                }
            } else {
                cell = ''
                className = 'hide'

            }
            const tdid = `cell-${i}-${j}`
            strHTML += `<td oncontextmenu="onMarkCell(this)" onclick="onCellClicked(this)" id="${tdid}" class="${className} cell">${cell}</td>`
        }
        strHTML += `</tr>`
    }

    const elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
}

function showNegAround(board, rowsIdx, colsIdx) {
    for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
        if (i < 0 || i >= board[0].length) continue
        for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
            if (i === rowsIdx && j === colsIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = { i, j }
            // console.log(currCell)
            renderCell(currCell, setMinesNegsCount(board, i, j))
        }
    }
}

function setMinesNegsCount(board, rowsIdx, colsIdx) {
    var negsCount = 0
    for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
        if (i < 0 || i >= board[0].length) continue
        for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
            if (i === rowsIdx && j === colsIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) negsCount++
        }
    }
    return negsCount
}

function onCellClicked(elCell) {
    if (gGame.isOn) 
        // console.log(elCell)
        var str = elCell.id.split('-')
        // console.log(str)
        var i = str[1]
        var j = str[2]
        var location = { i, j }
        var cell = gBoard[i][j]
        if (cell.isShown) return
        cell.isShown = true
        // console.log(cell)
        if (cell.isMine) {
            elCell.classList.remove('hide')
            elCell.classList.add('mine')
            renderCell(location, MINE)
            gLifes--
            if (gLifes = 0) gameOver()

        } else {
            elCell.classList.remove('hide')
            elCell.classList.add('empty')
            renderCell(location, EMPTY)
            showNegAround(gBoard, i, j)
        }
    
    gGame.shownCount++
    checkVictory()
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`#cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function onMarkCell(elCell) {

    elCell.isMarked = true
    console.log(elCell)
    const id = elCell.id.split('-')
    const i = id[1]
    const j = id[2]

    renderCell({ i, j }, MARK)
}

function gameOver() {
    if (gGame.isVictory === false) {
        const elMsg = document.querySelector('.msg1')
        console.log(elMsg)
        elMsg.classList.remove('msg1')
        console.log(elMsg)
        console.log('you lost')
        const elModal = document.querySelector('.modal')
        gGame.isOn = false
        elModal.classList.remove('modal')
    } else {
        const elModal = document.querySelector('.modal')
        gGame.isOn = false
        elModal.classList.remove('modal')
        const elMsg = document.querySelector('.msg2')
        elMsg.classList.remove('msg2')
        // console.log('you won')
    }
}

function checkVictory() {
    if (gGame.shownCount === 14) {
        gGame.isVictory = true
        gameOver()
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}