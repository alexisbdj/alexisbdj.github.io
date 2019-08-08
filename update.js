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
    initCurrent(getTetri());
}

function rotate(Game, direction) {
    let baseStat = Game.current.nstat;
    Game.current.nstat += direction;
    while (Game.current.nstat < 0) {
        Game.current.nstat += 4;
    }
    while (Game.current.nstat > 3) {
        Game.current.nstat -= 4;
    }
    setCurrentToStat(Game.current.tetri, Game.current.nstat);

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