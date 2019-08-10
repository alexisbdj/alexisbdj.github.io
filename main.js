const canvas = document.getElementById('window');
let context;

var statusCodes = {
    playing: 0,
    lost: 1,
}

let Game = {
    tileSize: 40,
    keys: {left: false, right: false},
    boardSize: {x: 10, y: 20},
    board: [],
    current: {},
    timeLeftToFall: 1,
    movementsToDo: {left: 0, right: 0, rleft: 0, rright: 0, harddrop: false, softdrop: false, hold: false},
    status: statusCodes.playing,
    lockDelay: 0.5,
    next: [],
    hold: undefined,
    rect: {left: 0, top: canvas.height*0.2, width: canvas.width*0.8, height: canvas.height*0.8},
};
let tetrList = ['z', 's', 'o', 't', 'i', 'j', 'l'];

let tetriminos = {
    z: {
        stats: [
            [
                [1, 1, 0, 0, 0],
                [0, 1, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0, 0],
                [0, 1, 1, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0],
                [0, 1, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0, 0],
                [1, 1, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    s: {
        stats: [
            [
                [0, 2, 2, 0, 0],
                [2, 2, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 2, 0, 0, 0],
                [0, 2, 2, 0, 0],
                [0, 0, 2, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [0, 2, 2, 0, 0],
                [2, 2, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [2, 0, 0, 0, 0],
                [2, 2, 0, 0, 0],
                [0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    o: {
        stats: [
            [
                [0, 3, 3, 0, 0],
                [0, 3, 3, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0, 0],
                [0, 3, 3, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0, 0],
                [0, 3, 3, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 3, 3, 0, 0],
                [0, 3, 3, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    t: {
        stats: [
            [
                [0, 4, 0, 0, 0],
                [4, 4, 4, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 4, 0, 0, 0],
                [0, 4, 4, 0, 0],
                [0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0 ,0],
            ],
            [
                [0, 0, 0, 0, 0],
                [4, 4, 4, 0, 0],
                [0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 4, 0, 0, 0],
                [4, 4, 0, 0, 0],
                [0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    i: {
        stats: [
            [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 5, 5, 5, 5],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [5, 5, 5, 5, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 5, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    j: {
        stats: [
            [
                [6, 0, 0, 0, 0],
                [6, 6, 6, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 6, 6, 0, 0],
                [0, 6, 0, 0, 0],
                [0, 6, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [6, 6, 6, 0, 0],
                [0, 0, 6, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 6, 0, 0, 0],
                [0, 6, 0, 0, 0],
                [6, 6, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        ],
    },
    l: {
        stats: [
            [
                [0, 0, 7, 0, 0],
                [7, 7, 7, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 7, 0, 0, 0],
                [0, 7, 0, 0, 0],
                [0, 7, 7, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [7, 7, 7, 0, 0],
                [7, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
            [
                [7, 7, 0, 0, 0],
                [0, 7, 0, 0, 0],
                [0, 7, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
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
        else if (key == ' ') {
            Game.movementsToDo.harddrop = true;
        }
        else if (key == 'c') {
            Game.movementsToDo.hold = true;
        }
        else if (key == 'm') {
            localStorage.setItem('board', JSON.stringify(Game.board));
        }
        else if (key == 'l') {
            Game.board = JSON.parse(localStorage.getItem('board'));
            console.log('ok');
        }
    }
    if (key == 'ArrowDown') {
        Game.movementsToDo.softdrop = value;
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
}

function setCurrentToStat(tetri, stat) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            Game.current.mat[x][y] = tetriminos[tetri].stats[stat][y][x];
        }
    }
}

function initCurrent(tetri) {
    Game.current = {mat: [], pos: {x: 3, y: 0}, nstat: 0, tetri: tetri};
    if (tetri == 'i') {
        Game.current.pos.x = 2;
        Game.current.pos.y = -2;
    }
    for (let j = 0; j < 5; j++) {
        let row = [];
        for (let i = 0; i < 5; i++) {
            row.push(0);
        }
        Game.current.mat.push(row);
    }
    setCurrentToStat(tetri, Game.current.nstat);
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (Game.current.mat[x][y] != 0) {
                if (!isEmpty(Game, x + Game.current.pos.x, y + Game.current.pos.y)) {
                    Game.current = undefined;
                    Game.status = statusCodes.lost;
                    return;
                }
            }
        }
    }
}

function init() {
    initBoard();
    initRandomizer(tetrList);
    getNextTetri(Game);
    document.addEventListener('keydown', (event) => {
        if (event.code == 'ArrowDown' || event.code == 'ArrowUp' || event.code == 'Space')
            event.preventDefault();
        keysUpdate(event.key, true);
    });
    document.addEventListener('keyup', (event) => {
        if (event.code == 'ArrowDown' || event.code == 'ArrowUp' || event.code == 'Space')
            event.preventDefault();
        keysUpdate(event.key, false);
    });
}


function update() {
    if (Game.status == statusCodes.playing)
        tetrisTick(Game, deltaTime);

    Game.movementsToDo.left = 0;
    Game.movementsToDo.right = 0;
    Game.movementsToDo.rleft = 0;
    Game.movementsToDo.rright = 0;
}

function mainLoop() {
    update();
    render(canvas, context, Game);
    setTimeout(mainLoop, deltaTime);
}