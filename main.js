const canvas = document.getElementById('window');
let context;

let Game = {
    pos: {x: 0, y: 0},
    tileSize: 40,
    keys: {left: false, right: false},
    boardSize: {x: 10, y: 20},
    board: [],
    current: {},
    timeLeftToFall: 1,
    movementsToDo: {left: 0, right: 0, rleft: 0, rright: 0}
};

let tetrList = ['z', 's', 'o', 't', 'i', 'j', 'l'];

let tetriminos = {
    z: {
        stats: [
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    s: {
        stats: [
            [
                [0, 2, 2, 0],
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 2, 0, 0],
                [0, 2, 2, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 2, 2, 0],
                [2, 2, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [2, 0, 0, 0],
                [2, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    o: {
        stats: [
            [
                [0, 3, 3, 0],
                [0, 3, 3, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0],
                [0, 3, 3, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0],
                [0, 3, 3, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0],
                [0, 3, 3, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    t: {
        stats: [
            [
                [0, 4, 0, 0],
                [4, 4, 4, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 4, 0, 0],
                [0, 4, 4, 0],
                [0, 4, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [4, 4, 4, 0],
                [0, 4, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 4, 0, 0],
                [4, 4, 0, 0],
                [0, 4, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    i: {
        stats: [
            [
                [0, 0, 0, 0],
                [5, 5, 5, 5],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 5, 0],
                [0, 0, 5, 0],
                [0, 0, 5, 0],
                [0, 0, 5, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [5, 5, 5, 5],
                [0, 0, 0, 0],
            ],
            [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ],
        ],
    },
    j: {
        stats: [
            [
                [6, 0, 0, 0],
                [6, 6, 6, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 6, 6, 0],
                [0, 6, 0, 0],
                [0, 6, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [6, 6, 6, 0],
                [0, 0, 6, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 6, 0, 0],
                [0, 6, 0, 0],
                [6, 6, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    l: {
        stats: [
            [
                [0, 0, 7, 0],
                [7, 7, 7, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 7, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [7, 7, 7, 0],
                [7, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [7, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
}

const deltaTime = 1/60;

if (canvas.getContext) {
    console.log('supported');
    context = canvas.getContext('2d');
    init();
    mainLoop();
}
else {
    console.log('unsupported');
}

function keysUpdate(key, value) {
    if (value) {
        if (key == 'ArrowLeft') {
            Game.movementsToDo.left++;
        }
        else if (key == 'ArrowRight') {
            Game.movementsToDo.right++;
        }
        else if (key == 'w') {
            Game.movementsToDo.rleft++;
        }
        else if (key == 'x') {
            Game.movementsToDo.rright++;
        }
    }
}

function initBoard() {
    for (let j = 0; j < Game.boardSize.x; j++) {
        let row = [];
        for (let i = 0; i < Game.boardSize.y; i++) {
            row.push(0);
        }
        Game.board.push(row);
    }
/*    for (let i = 0; i < Game.boardSize.x && i < Game.boardSize.y; i++) {
        Game.board[i][i] = 1;
    }
    */
}

function setCurrentToStat(tetri, stat) {
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            Game.current.mat[x][y] = tetriminos[tetri].stats[stat][y][x];
        }
    }
}

function initCurrent(tetri) {
    Game.current = {mat: [], pos: {x: 3, y: 0}, nstat: 0, tetri: tetri};
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 0; i < 4; i++) {
            row.push(0);
        }
        Game.current.mat.push(row);
    }
    setCurrentToStat(tetri, Game.current.nstat);
}

function init() {
    initBoard();
    initRandomizer(tetrList);
    initCurrent(getTetri());
    document.addEventListener('keydown', (event) => {
        keysUpdate(event.key, true);
    });
    document.addEventListener('keyup', (event) => {
        keysUpdate(event.key, false);
    });
}

function update() {
    Game.timeLeftToFall -= deltaTime;
    for (let i = 0; i < Game.movementsToDo.left; i++)
        move(Game, -1, 0);
    for (let i = 0; i < Game.movementsToDo.right; i++)
        move(Game, 1, 0);
    for (let i = 0; i < Game.movementsToDo.rleft; i++)
        rotate(Game, -1);
    for (let i = 0; i < Game.movementsToDo.rright; i++)
        rotate(Game, 1);

    Game.movementsToDo.left = 0;
    Game.movementsToDo.right = 0;
    Game.movementsToDo.rleft = 0;
    Game.movementsToDo.rright = 0;
    if (Game.timeLeftToFall < 0) {
        Game.timeLeftToFall += 1.0;
        if (!move(Game, 0, 1)) {
            lockCurrent(Game);
        }
    }
    if (Game.keys.left) {
        Game.pos.x -= 40 * deltaTime;
    }
    if (Game.keys.right) {
        Game.pos.x += 40 * deltaTime;
    }
}

function mainLoop() {
    update();
    render(canvas, context, Game);
    setTimeout(mainLoop, deltaTime);
}