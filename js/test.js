'use strict'

window.addEventListener("contextmenu", e => e.preventDefault());

const MINE = '💣'
const EMPTY = ''
const MARK = '🚩'
const hint = '💡'

var gBoard
var gFirstclick = 0
var gLevel
var gMines
var gTimerInterval
var gLifes = 3
var gHints = 3

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    isVictory: false,
    secsPassed: 0
}


function onInit(gLevel = 4) {
    gFirstclick = 0
    gGame.shownCount = 0
    gLifes = 3
    gGame.isVictory = false
    var elModal = document.querySelector('div')
    elModal.classList.add('modal')
    clearRestartBtn()
    clearInterval(gTimerInterval)
    gBoard = buildBoard(gLevel)
    // console.table(gBoard)
    renderBoard(gBoard, '.board')
    // gGame.isOn = true

}

function chooseGameDifficulty(elDifficulty) {
    if (elDifficulty.classList[0] === 'easy') {
        gFirstclick = 0
        gLevel = 4
        gMines = 2
        onInit(gLevel)
    }
    else if (elDifficulty.classList[0] === 'medium') {
        gFirstclick = 0
        gLevel = 8
        gMines = 14
        onInit(gLevel)
    }
    else if (elDifficulty.classList[0] === 'hard') {
        gFirstclick = 0
        gLevel = 12
        gMines = 32
        onInit(gLevel)
    }
}

function buildBoard(cellsCount) {
    // const matSize = Math.sqrt(cellsCount)
    const mat = []
    for (var i = 0; i < cellsCount; i++) {
        mat[i] = []
        for (var j = 0; j < cellsCount; j++) {
            mat[i][j] = {
                type: EMPTY,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellIdx: [i, j]
            }
        }
    }

    return mat
}

function renderBoard(mat, selector) {

    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            // const cell = mat[i][j]
            var cell = ''
            // console.log(cell)
            // var iIdx = (cell.cellIdx[0])
            // console.log(cell.cellIdx[1])
            const tdid = `cell-${i}-${j}`
            const className = `cell hide`


            strHTML += `<td oncontextmenu="onMarkCell(this)" onclick="onCellClicked(this)" id="${tdid}" class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += ''

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function setMines(gBoard, gMines = 2, gLevel = 4) {
    // console.log('glevel ', gLevel)
    // console.log('gMines 1 ', gMines)
    getRandomMines(gBoard, gMines, gLevel)
}

function getRandomMines(board, gMines, gLevel) {
    for (var i = 0; i < gMines; i++) {
        var randI = getRandomInt(0, gLevel)
        var randJ = getRandomInt(0, gLevel)
        board[randI][randJ].isMine = true
    }
}


function onCellClicked(elCell) {
    gFirstclick++
    if (gFirstclick === 1) {
        gGame.isOn = true
        // console.log(gBoard)
        var startTime = Date.now()
        var elTimer = document.querySelector('.timer')
        gTimerInterval = setInterval(() => {
            const diff = Date.now() - startTime
            elTimer.innerText = (diff / 1000).toFixed(3)
        }, 10)
    }

    if (gGame.isOn) {
        var str = elCell.id.split('-')
        // console.log(str)
        var i = str[1]
        var j = str[2]
        var location = { i, j }
        var cell = gBoard[i][j]
        // console.log(cell)
        if (cell.isShown) return
        if (cell.isMine) {
            cell.isShown = true
            elCell.classList.remove('hide')
            elCell.classList.add('mine')
            renderCell(location, MINE)
            gLifes--
            if (gLifes === 0) gameOver()

        } else {
            cell.isShown = true
            elCell.classList.remove('hide')
            elCell.classList.add('empty')
            renderCell(location, EMPTY)
            gGame.shownCount++

        }
        if (gFirstclick === 1) {
            setMines(gBoard, gMines, gLevel)
            setNegsAround(gBoard, i, j)
            showNegAround(gBoard, +i, +j)
        }
        if (!cell.isMine && cell.minesAroundCount < 1 ) {
            showNegAround(gBoard, +i, +j)
        }
        checkVictory(gLevel, gMines)
    }
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`#cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function onMarkCell(elCell) {

    elCell.isMarked = true
    console.log(elCell)
    console.log(elCell.isMarked)
    const id = elCell.id.split('-')
    const i = id[1]
    const j = id[2]

    renderCell({ i, j }, MARK)
}

function gameOver() {
    clearInterval(gTimerInterval)
    if (gGame.isVictory === false) {
        const elMsg = document.querySelector('.msg1')
        elMsg.classList.remove('msg1')
        const elModal = document.querySelector('.modal')
        elModal.classList.remove('modal')
        const elRestartBtn = document.querySelector('.restart-btn')
        elRestartBtn.style.display = 'none'
        const elLosingRestartBtn = document.querySelector('.restart-btn2')
        elLosingRestartBtn.style.display = 'inline-block'

        gGame.isOn = false
    } else {
        gGame.isOn = false
        const elModal = document.querySelector('.modal')
        elModal.classList.remove('modal')
        const elMsg = document.querySelector('.msg2')
        elMsg.classList.remove('msg2')
        const elRestartBtn = document.querySelector('.restart-btn')
        elRestartBtn.style.display = 'none'
        const elwinningRestartBtn = document.querySelector('.restart-btn3')
        elwinningRestartBtn.style.display = 'inline-block'
    }
}

function checkVictory(gLevel = 4, gMines = 2) {
    // console.log('glevel ', gLevel)
    // console.log('gmines ', gMines)
    if (gGame.shownCount === ((gLevel ** 2) - gMines)) {
        gGame.isVictory = true
        gameOver()
    }
}

function setNegsAround(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) continue
            const minesAround = setMinesNegsCount(board, i, j)
            currCell.minesAroundCount += minesAround
        }
    }
}

function setMinesNegsCount(board, rowsIdx, colsIdx) {
    // console.log(board)
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

function showNegAround(board, rowsIdx, colsIdx) {

    for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
        if (i < 0 || i >= board[0].length) continue
        for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
            if (i === rowsIdx && j === colsIdx) continue
            if (j < 0 || j >= board[0].length) continue
            
            var currCell = board[i][j]
            var location = { i, j }
            // console.log(currCell)
            if(currCell.minesAroundCount || currCell.isMarked) {

            }
            if (currCell.isShown) continue
            renderCell(location, currCell.minesAroundCount)


        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


function clearRestartBtn() {
    const elRestartBtn1 = document.querySelector('.restart-btn')
    elRestartBtn1.style.display = 'inline-block'
    const elLosingRestartBtn2 = document.querySelector('.restart-btn2')
    elLosingRestartBtn2.style.display = 'none'
    const elLosingRestartBtn3 = document.querySelector('.restart-btn3')
    elLosingRestartBtn3.style.display = 'none'
}

