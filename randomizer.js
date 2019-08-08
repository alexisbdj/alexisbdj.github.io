let base = [];
let bag = [];

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function newBag() {
    bag = shuffle(base.slice());
}

function initRandomizer(tetriList) {
    base = tetriList.slice();
    newBag();
}

function getTetri() {
    if (bag.length == 0) {
        newBag();
    }
    return bag.shift();
}