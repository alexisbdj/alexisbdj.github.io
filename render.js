const Cyan = '(0, 255, 255, 0.8)';
const Yellow = '(255, 255, 0, 0.8)';
const Magenta = '(150, 0, 150, 0.8)';
const Green = '(0, 255, 0, 0.8)';
const Blue = '(0, 0, 255, 0.8)';
const Red = '(255, 0, 0, 0.8)';
const Orange = '(255, 165, 0, 0.8)';

let colors = [Red, Green, Yellow, Magenta, Cyan, Blue, Orange];

function clear(context, canvas) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function drawBackground(context, Game) {
    const xShift = Game.rect.width / 10;
    const yShift = Game.rect.height / 20;

    context.save();
    context.fillStyle = "rgb(50, 50, 50)";
    context.fillRect(Game.rect.left, Game.rect.top, Game.rect.width, Game.rect.height);
    context.restore();
    for (let i = 0; i < 9; i++) {
        let xPos = Game.rect.left + (xShift * (i + 1));
        context.beginPath();
        context.moveTo(xPos, 0);
        context.lineTo(xPos, Game.rect.height + Game.rect.top);
        context.stroke();
        context.restore();
    }
    for (let i = 0; i < 19; i++) {
        let yPos = Game.rect.top + (yShift * (i + 1));
        context.beginPath();
        context.moveTo(0, yPos);
        context.lineTo(Game.rect.width + Game.rect.left, yPos);
        context.stroke();
        context.restore();
    }
}

function drawTetri(context, gpos, xSize, ySize, tetri)
{
    let stat = tetriminos[tetri].stats[0];
    context.save();
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (stat[y][x] != 0) {
                let pos = {x: gpos.x + xSize * x, y: gpos.y + ySize * y};
                if (tetri == 'i' || tetri == 'o') {
                    pos.x -= xSize;
                }
                context.fillStyle = "rgb" + colors[stat[y][x] - 1];
                context.fillRect(pos.x, pos.y, xSize, ySize);
                context.restore();
            }
        }
    }
}

function drawCurrent(context, Game, xSize, ySize) {
    context.save();
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (Game.current.mat[x][y] != 0) {
                let pos = {x: Game.rect.left + xSize * (x + Game.current.pos.x), y: Game.rect.top + ySize * (y + Game.current.pos.y)};
                context.fillStyle = "rgb" + colors[Game.current.mat[x][y] - 1];
                context.fillRect(pos.x, pos.y, xSize, ySize);
                context.restore();
            }
        }
    }
}

function drawBoard(context, Game) {
    const xSize = Game.rect.width / 10;
    const ySize = Game.rect.height / 20;


    context.save();
    for (let x = 0; x < Game.boardSize.x; x++) {
        for (let y = 0; y < Game.boardSize.y; y++) {
            if (Game.board[x][y] != 0) {
                let pos = {x: Game.rect.left + xSize * x, y: Game.rect.top + ySize * y};
                context.fillStyle = "rgb" + colors[Game.board[x][y] - 1];
                context.fillRect(pos.x, pos.y, xSize, ySize);
                context.restore();
            }
        }
    }
    if (Game.current != undefined)
        drawCurrent(context, Game, xSize, ySize);
}

function drawMessage(context, Game, message)
{
    context.save();
    context.font = '100px serif';
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillText(message, Game.rect.left + 90, Game.rect.top + Game.rect.height / 2);
    context.fillStyle = 'rgb(0, 0, 0)';
    context.lineWidth = 2;
    context.strokeText(message, Game.rect.left + 90, Game.rect.top + Game.rect.height / 2);
    context.restore();
}

function drawNext(context, Game) {
    const basePos = {x: Game.rect.left + Game.rect.width, y: Game.rect.top};
    const sizeX = 20;
    const sizeY = 20;
    for (let i = 0; i < Game.next.length; i++) {
        drawTetri(context, {x: basePos.x, y: basePos.y + sizeY * 4 * i}, sizeX, sizeY, Game.next[i]);
    }
}

function drawHold(context, Game) {
    if (Game.hold != undefined) {
        drawTetri(context, {x: 0, y: 0}, 20, 20, Game.hold);
    }
}

function render(canvas, context, Game) {
    clear(context, canvas);
    drawBackground(context, Game);
    drawBoard(context, Game);
    if (Game.status == statusCodes.lost)
        drawMessage(context, Game, 't nul');
    drawNext(context, Game);
    drawHold(context, Game);
    requestAnimationFrame(() => {
    });
}