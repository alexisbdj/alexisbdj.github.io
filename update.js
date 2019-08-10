function isEmpty(Game, x, y) {
    if (x < 0 || x >= Game.boardSize.x || y < 0 || y >= Game.boardSize.y) {
        return false;
    }
    if (Game.board[x][y] != 0) {
        return false;
    }
    return true;
}

function move(Game, xMov, yMov) {
    if (Game.current == undefined)
        return;
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (Game.current.mat[x][y] != 0) {
                if (!isEmpty(Game, x + Game.current.pos.x + xMov, y + Game.current.pos.y + yMov)) {
                    return false;
                }
            }
        }
    }
    Game.current.pos.x += xMov;
    Game.current.pos.y += yMov;
    return true;
}

function getNextTetri(Game) {
    while (Game.next.length < 5) {
        Game.next.push(getTetri());
    }
    initCurrent(Game.next.shift());
}

function tetrisTick(Game, deltaTime) {
    let mv = deltaTime;
    if (Game.movementsToDo.softdrop)
        mv *= 5;
    Game.timeLeftToFall -= mv;
    for (let i = 0; i < Game.movementsToDo.left; i++)
        move(Game, -1, 0);
    for (let i = 0; i < Game.movementsToDo.right; i++)
        move(Game, 1, 0);
    for (let i = 0; i < Game.movementsToDo.rleft; i++)
        rotate(Game, -1);
    for (let i = 0; i < Game.movementsToDo.rright; i++)
        rotate(Game, 1);

    if (Game.movementsToDo.hold) {
        if (Game.hold == undefined) {
            Game.hold = Game.current.tetri;
            getNextTetri(Game);
        }
        else {
            let oldHold = Game.hold;
            Game.hold = Game.current.tetri;
            initCurrent(oldHold);
        }
        Game.movementsToDo.hold = false;
    }
    if (Game.movementsToDo.harddrop) {
        while (move(Game, 0, 1));
        lockCurrent(Game);
        Game.timeLeftToFall = 1.0;
        Game.movementsToDo.harddrop = false;
    }
    else {
        if (Game.timeLeftToFall < 0) {
            Game.timeLeftToFall += 1.0;
            if (!move(Game, 0, 1)) {
                Game.lockDelay -= deltaTime;
                if (Game.lockDelay <= 0)
                    lockCurrent(Game);
            }
            else {
                Game.lockDelay = 0.5;
            }
        }
        else if (Game.lockDelay < 0.5) {
            Game.lockDelay -= 0.5;
        }
    }
}

function lockCurrent(Game)
{
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (Game.current.mat[x][y] != 0) {
                Game.board[x + Game.current.pos.x][y + Game.current.pos.y] = Game.current.mat[x][y];
            }
        }
    }
    clearLines(Game);
    getNextTetri(Game);
}

function rotate(Game, direction) {
    if (Game.current == undefined)
        return;
    let baseStat = Game.current.nstat;
//    let basePos = {x: Game.current.pos.x, y: Game.current.pos.y};
//    let wallKickTab;
    Game.current.nstat += direction;
    while (Game.current.nstat < 0) {
        Game.current.nstat += 4;
    }
    while (Game.current.nstat > 3) {
        Game.current.nstat -= 4;
    }
    setCurrentToStat(Game.current.tetri, Game.current.nstat);
/*
    for (let t = 0; t < 5; t++) {
//        let translation = {x: }
    }
*/


    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (Game.current.mat[x][y] != 0) {
                if (!isEmpty(Game, x + Game.current.pos.x, y + Game.current.pos.y)) {
                    Game.current.nstat = baseStat;
                    setCurrentToStat(Game.current.tetri, Game.current.nstat);
                    return;
                }
            }
        }
    }

}

function singleClear(Game, line) {
    for (let i = line; i > 0; i--) {
        for (let c = 0; c < Game.boardSize.x; c++) {
            Game.board[c][i] = Game.board[c][i - 1];
        }
    }
    for (let c = 0; c < Game.boardSize.x; c++) {
        Game.board[c][0] = 0;
    }
}

function clearLines(Game) {
    for (let i = Game.boardSize.y - 1; i >= 0; i--) {
        let full = true;
        while (full == true) {
            for (let c = 0; c < Game.boardSize.x; c++) {
                if (Game.board[c][i] == 0) {
                    full = false;
                    break;
                }
            }
            if (full == true) {
                singleClear(Game, i);
            }
        }
    }
}

let normalWallKickTab = [
    [   // stat 0
        {x: 0, y: 0},   //offset 0-1
        {x: 0, y: 0},   //offset 0-2
        {x: 0, y: 0},   //offset 0-3
        {x: 0, y: 0},   //offset 0-4
        {x: 0, y: 0},   //offset 0-5
    ],
    [   //stat 1 (R)
        {x: 0, y: 0},   //offset 1-1
        {x: 1, y: 0},   //offset 1-2
        {x: 1, y: -1},   //offset 1-3
        {x: 0, y: 2},   //offset 1-4
        {x: 1, y: 2},   //offset 1-5
    ],
    [   //stat 2
        {x: 0, y: 0},   //offset 2-1
        {x: 0, y: 0},   //offset 2-2
        {x: 0, y: 0},   //offset 2-3
        {x: 0, y: 0},   //offset 2-4
        {x: 0, y: 0},   //offset 2-5
    ],
    [   //stat 3 (L)
        {x: 0, y: 0},   //offset 3-1
        {x: -1, y: 0},   //offset 3-2
        {x: -1, y: -1},   //offset 3-3
        {x: 0, y: 2},   //offset 3-4
        {x: -1, y: 2},   //offset 3-5
    ],
]

let iTetriWallKickTab = [
    [   // stat 0
        {x: 0, y: 0},   //offset 0-1
        {x: -1, y: 0},   //offset 0-2
        {x: 2, y: 0},   //offset 0-3
        {x: -1, y: 0},   //offset 0-4
        {x: 2, y: 0},   //offset 0-5
    ],
    [   //stat 1 (R)
        {x: -1, y: 0},   //offset 1-1
        {x: 0, y: 0},   //offset 1-2
        {x: 0, y: 0},   //offset 1-3
        {x: 0, y: 1},   //offset 1-4
        {x: 0, y: -2},   //offset 1-5
    ],
    [   //stat 2
        {x: -1, y: 1},   //offset 2-1
        {x: 1, y: 1},   //offset 2-2
        {x: -2, y: 1},   //offset 2-3
        {x: 1, y: 0},   //offset 2-4
        {x: -2, y: 0},   //offset 2-5
    ],
    [   //stat 3 (L)
        {x: 0, y: 1},   //offset 3-1
        {x: 0, y: 1},   //offset 3-2
        {x: 0, y: 1},   //offset 3-3
        {x: 0, y: -1},   //offset 3-4
        {x: 0, y: 2},   //offset 3-5
    ],
]

let oTetriWallKickTab = [
    [   // stat 0
        {x: 0, y: 0},   //offset 0-1
        {x: 0, y: 0},   //offset 0-2
        {x: 0, y: 0},   //offset 0-3
        {x: 0, y: 0},   //offset 0-4
        {x: 0, y: 0},   //offset 0-5
    ],
    [   //stat 1 (R)
        {x: 0, y: -1},  //offset 1-1
        {x: 0, y: -1},  //offset 1-2
        {x: 0, y: -1},  //offset 1-3
        {x: 0, y: -1},  //offset 1-4
        {x: 0, y: -1},  //offset 1-5
    ],
    [   //stat 2
        {x: -1, y: -1},   //offset 2-1
        {x: -1, y: -1},   //offset 2-2
        {x: -1, y: -1},   //offset 2-3
        {x: -1, y: -1},   //offset 2-4
        {x: -1, y: -1},   //offset 2-5
    ],
    [   //stat 3 (L)
        {x: -1, y: 0},   //offset 3-1
        {x: -1, y: 0},   //offset 3-2
        {x: -1, y: 0},   //offset 3-3
        {x: -1, y: 0},   //offset 3-4
        {x: -1, y: 0},   //offset 3-5
    ],
]