const Cyan = '(0, 255, 255)';
const Yellow = '(255, 255, 0)';
const Magenta = '(150, 0, 150)';
const Green = '(0, 255, 0)';
const Blue = '(0, 0, 255)';
const Red = '(255, 0, 0';
const Orange = '(255, 165, 0)';

let colors = [Red, Green, Yellow, Magenta, Cyan, Blue, Orange];

function clear(context, canvas) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function drawBackground(context, canvas) {
    const xShift = canvas.width / 10;
    const yShift = canvas.height / 20;

    context.save();
    context.fillStyle = "rgb(50, 50, 50)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    for (let i = 0; i < 9; i++) {
        let xPos = (xShift * (i + 1));
        context.beginPath();
        context.moveTo(xPos, 0);
        context.lineTo(xPos, canvas.height);
        context.stroke();
        context.restore();
    }
    for (let i = 0; i < 19; i++) {
        let yPos = (yShift * (i + 1));
        context.beginPath();
        context.moveTo(0, yPos);
        context.lineTo(canvas.width, yPos);
        context.stroke();
        context.restore();
    }
}

function drawCurrent(context, Game, xSize, ySize) {
    context.save();
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (Game.current.mat[x][y] != 0) {
                let pos = {x: xSize * (x + Game.current.pos.x), y: ySize * (y + Game.current.pos.y)};
                context.fillStyle = "rgb" + colors[Game.current.mat[x][y] - 1];
                context.fillRect(pos.x, pos.y, xSize, ySize);
                context.restore();
            }
        }
    }
}

function drawBoard(context, canvas, Game) {
    const xSize = canvas.width / 10;
    const ySize = canvas.height / 20;


    context.save();
    for (let x = 0; x < Game.boardSize.x; x++) {
        for (let y = 0; y < Game.boardSize.y; y++) {
            if (Game.board[x][y] != 0) {
                let pos = {x: xSize * x, y: ySize * y};
                context.fillStyle = "rgb" + colors[Game.board[x][y] - 1];
                context.fillRect(pos.x, pos.y, xSize, ySize);
                context.restore();
            }
        }
    }
    drawCurrent(context, Game, xSize, ySize);
}

function render(canvas, context, Game) {
    clear(context, canvas);
    drawBackground(context, canvas);
    drawBoard(context, canvas, Game);
    requestAnimationFrame(() => {
    });
}