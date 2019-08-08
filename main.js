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
};

let tetriminos = {
    z: {
        stats: [
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    }
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
    if (key == 'riendutout') {
        Game.keys.left = value;
    }
    else if (key == 'riendutout') {
        Game.keys.right = value;
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

function initCurrent() {
    Game.current = {mat: [], pos: {x: 3, y: 0}};
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 0; i < 4; i++) {
            row.push(0);
        }
        Game.current.mat.push(row);
    }
    for (let i = 0; i < 4; i++) {
        Game.current.mat[i][i] = 1;
    }
}

function init() {
    initBoard();
    initCurrent();
    document.addEventListener('keydown', (event) => {
        console.log(event);
        keysUpdate(event.key, true);
    });
    document.addEventListener('keyup', (event) => {
        keysUpdate(event.key, false);
    });
}

function update() {
    Game.timeLeftToFall -= deltaTime;
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