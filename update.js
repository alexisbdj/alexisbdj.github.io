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
                    console.log(x, y);
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
    initCurrent();
}