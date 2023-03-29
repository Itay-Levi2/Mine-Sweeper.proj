'use strict'

const MINE = 'Mine'
const EMPTY = 'empty'
const NEGS = ''

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    isVictory: false,
    secsPassed: 0
}


function onInit() {
    gBoard = buildBoard(4, 4)
    console.table(gBoard)
    renderBoard(gBoard, '.board')
    gGame.isOn = true
}


function buildBoard(Rows, Cols) {
    const board = []
    for (var i = 0; i < Rows; i++) {
        board[i] = []
        for (var j = 0; j < Cols; j++) {
            board[i][j] = {
                type: EMPTY,
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false,

            }
            if (i === 0 && j === 0) board[i][j].isMine = true
            if (i === 1 && j === 1) board[i][j].isMine = true
        }
    }
    return board
}

function renderBoard(board, selector) {
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
            strHTML += `<td  onclick="onCellClicked(this)" id="${tdid}" class="${className} cell">${cell}</td>`
        }
        strHTML += `</tr>`
    }

    const elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board, rowsIdx, colsIdx) {
    var negsCount = 0
    for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
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
    if (gGame.isOn) {
        console.log(elCell)
        var str = elCell.id.split('-')
        console.log(str)
        var i = str[1]
        var j = str[2]
        var location = { i, j }
        var cell = gBoard[i][j]
        cell.isShown = true
        console.log(cell)
        if (cell.isMine) {
            elCell.classList.remove('hide')
            elCell.classList.add('mine')
            renderCell(location, MINE)
            gameOver()
        } else {
            elCell.classList.remove('hide')
            elCell.classList.add('empty')
            renderCell(location, setMinesNegsCount(gBoard, i, j))
        }
    }
    gGame.shownCount++
    checkVictory()
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`#cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}



function gameOver() {
    if (gGame.isVictory === false) {
        var elModal = document.querySelector('.modal')
        gGame.isOn = false
        elModal.classList.remove('modal')
    } else {
        var elModal = document.querySelector('.modal')
        gGame.isOn = false
        elModal.classList.remove('modal')
        const msg = elModal.querySelector('msg')

    }
}

function checkVictory() {
    if (gGame.shownCount === 14) {
        gGame.isVictory = true
        gameOver()
    }
    console.log('you won')
}


function showModal() {




    
}