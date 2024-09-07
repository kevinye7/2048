var board;
var score = 0;
var best = 0;

window.onload = function() {
    setGame();
}

function setGame() {
    board = 
       [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]]

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            let effect = false;
            updateTile(tile, num, effect);
            document.getElementById("gameBoard").append(tile);
        }
    }

    setTwoOrFour();
    setTwoOrFour();
}

function newGame() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            board[r][c] = 0;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = ""; 
            tile.classList.value = ""; 
            tile.classList.add("tile");
        }
    }

    score = 0;
    document.getElementById("scoreNum").innerText = score;

    setTwoOrFour();
    setTwoOrFour();
}

function again() {
    let white = document.getElementById("white");
    let gameOver = document.getElementById("gameOver");
    let again = document.getElementById("tryAgain");

    white.style.display = "none";
    gameOver.style.display = "none";
    again.style.display = "none";

    newGame();
}

function setTwoOrFour() {
    if (!check()) {
        return;

    }

    let found = false;

    while (!found) {
        let r = Math.floor(Math.random() * 4);
        let c = Math.floor(Math.random() * 4);
        let x = Math.floor(Math.random() * 10);
        if (board[r][c] == 0) {
            if (x == 0) {
                board[r][c] = 4;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "4";
                tile.classList.add("x4");
                found = true;
            }
            else {
                board[r][c] = 2;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "2";
                tile.classList.add("x2");
                found = true;
            }
        }
    }
}

function check() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] == 0) { 
                return true;
            }
        }
    }

    return false;
}

function updateTile(tile, num, effect) {
    tile.innerText = ""; 
    tile.classList.value = ""; 
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            if (effect) {
                tile.classList.add("merged");
                tile.classList.add("x" + num.toString());
                tile.addEventListener("animationend", (e) => {
                    tile.classList.remove('merged')
                })
            }
            else {
                tile.classList.add("x" + num.toString());
            }
        }
        else
            tile.classList.add("x8192");            
    }
}

function copy(boardCopy, board) {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            boardCopy[r][c] = board[r][c];
        }
    }
}

function changed(boardCopy) {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (boardCopy[r][c] != board[r][c]) 
                return true;
        }
    }
    
    return false;
}

document.addEventListener('keyup', (e) => {
    let boardCopy =
       [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]]
    copy(boardCopy, board);

    if (e.code == "ArrowLeft") {
        slideLeft();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
    }
    if (changed(boardCopy))
        setTwoOrFour();

    document.getElementById("scoreNum").innerText = score;
    if (score >= best) {
        best = score;
        document.getElementById("bestScoreNum").innerText = best;
    }
    
    if (!check()) {
        copy(boardCopy, board);
        slideLeft();
        slideRight();
        slideUp();
        slideDown();

        let s = false;
        
        if (!changed(boardCopy)) {
            s = true;
        }

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                board[r][c] = boardCopy[r][c];
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                effect = false;
                updateTile(tile, num, effect);
            }
        }

        if (s) {
            let white = document.getElementById("white");
            let gameOver = document.getElementById("gameOver");
            let again = document.getElementById("tryAgain");
            white.style.display = "block";
            gameOver.style.display = "block";
            again.style.display = "block";
        }
    }
})

function filterZero(row){
    return row.filter(num => num != 0); 
}

function slide(row, index) {
    row = filterZero(row); 
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            index.push(i);
            row[i+1] = 0;
            row = filterZero(row); 
            score += row[i];
        }
    } 
    row = filterZero(row); 
    while (row.length < 4) {
        row.push(0);
    } 

    return row;
}

function slideLeft() {
    for (let r = 0; r < 4; r++) {
        let row = board[r];
        let index = [];
        board[r] = slide(row, index);
        for (let c = 0; c < 4; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            let effect = false;
            for (let i = 0; i < index.length; i++) {
                if (index[i] == c) {
                    effect = true;
                }
            }
            updateTile(tile, num, effect);
        }
    }
}

function slideRight() {
    for (let r = 0; r < 4; r++) {
        let row = board[r];       
        row.reverse();
        let index = [];      
        row = slide(row, index)
        board[r] = row.reverse();   
        for (let c = 0; c < 4; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            let effect = false;
            for (let i = 0; i < index.length; i++) {
                if (index[i] == 3-c) {
                    effect = true;
                }
            }
            updateTile(tile, num, effect);
        }
    }
}

function slideUp() {
    for (let c = 0; c < 4; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let index = [];
        row = slide(row, index);
        for (let r = 0; r < 4; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            let effect = false;
            for (let i = 0; i < index.length; i++) {
                if (index[i] == r) {
                    effect = true;
                }
            }
            updateTile(tile, num, effect);
        }
    }
}

function slideDown() {
    for (let c = 0; c < 4; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        let index = [];
        row = slide(row, index);
        row.reverse();
        for (let r = 0; r < 4; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            let effect = false;
            for (let i = 0; i < index.length; i++) {
                if (index[i] == 3-r) {
                    effect = true;
                }
            }
            updateTile(tile, num, effect);
        }
    }
}