
var canvas,
    ctx,
    cWidth,
    cHeight,
    cellSize = 150,
    mousePos,
    map,
    cFillStyle,
    imageCord = [];



$( document).ready(function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cFillStyle = "#000";
    cWidth = canvas.width;
    cHeight = canvas.height;

    load('puzzle.jpg');

    map = new Grid();
    map.init();





    canvas.addEventListener('click',function (evt) {
        mousePos = getMousePos(canvas, evt);
        var clickedCell = map.clickedCell(mousePos);
        var emptyCell = map.emptyCell();

        map.checkCollision(clickedCell,emptyCell);
        map.refresh();
        map.draw();
    },false);
});

function startGame () {
    map.shuffleImage();
    map.refresh();
    map.draw();
}



function Grid () {

    this.map = [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
    ];

    this.cols = this.map.length;
    this.rows = this.map[0].length;
}

Grid.prototype = {
    init: function () {

console.log("called");
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0 ; j < this.cols; j++) {
                this.map [j][i] = new Cell(i * cellSize, j * cellSize);
                this.map [j][i].setIndex(j,i);
                this.map [j][i].setImage('puzzle.jpg');
                imageCord.push({iX: this.map[j][i].iX,
                                iY: this.map[j][i].iY});
            }
        }
    },

    draw: function () {
        for (var i = 0; i < this.map[0].length; i++) {
            for (var j = 0 ; j < this.map.length; j++) {
                if (this.map [j][i].dead != true) {

                    this.map [j][i].draw();
                }
            }
        }
    },

    clickedCell: function (mouse) { // Findet anhand des mausklicks die Zelle
        var mouseX = mouse.x;
        var mouseY = mouse.y;
        var clickedCell = null;

        for (var i = 0; i < this.map[0].length; i++) {
            for (var j = 0 ; j < this.map.length; j++) {

                if (mouseX > this.map [j][i].x &&
                    mouseX < this.map [j][i].x + cellSize &&
                    mouseY > this.map [j][i].y &&
                    mouseY < this.map [j][i].y + cellSize) {
                        clickedCell = this.map [j][i];
                }
            }
        }
        return clickedCell;
    },

    emptyCell: function () {
        var emptyCell;
        for (var i = 0; i < this.map[0].length; i++) {
            for (var j = 0 ; j < this.map.length; j++) {
                if (this.map [j][i].isEmpty()) {
                    emptyCell = this.map [j][i];
                }
            }
        }
        return emptyCell;
    },

    checkCollision: function (cell) {
        var range;
        for (var i = 0; i < this.map[0].length; i++) {
            for (var j = 0 ; j < this.map.length; j++) {
                range = getRange(cell, this.map [j][i]);

                if (range == cellSize && this.map [j][i].isEmpty()) {
                    this.map[j][i].iX = this.map [cell.rowIndex][cell.colIndex].iX;
                    this.map[j][i].iY = this.map [cell.rowIndex][cell.colIndex].iY;
                    this.map [j][i].dead = false;
                    this.map [cell.rowIndex][cell.colIndex].dead = true;
                }
            }
        }
    },

    shuffleImage: function () {

        var array = shuffleArray();

        var c = 0;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0 ; j < this.cols; j++) {
                this.map [j][i].iX = array[c].iX;
                this.map [j][i].iY = array[c].iY;

                if(this.map[j][i].iX == 450 && this.map[j][i].iY == 300) {
                    this.map[j][i].dead = true;
                }else {
                    this.map[j][i].dead = false;
                }

                c++;
            }
        }

        //this.refresh();
        //this.draw();
    },

    refresh: function () {
        ctx.fillStyle = cFillStyle;
        ctx.fillRect(0,0, cWidth, cHeight);
    }
}
;

//KLASSE FÜR EINZELNE ZELLE
function Cell (x, y) {
    this.x = x;
    this.y = y;
    this.rowIndex = null;
    this.colIndex = null;
    this.size = cellSize;
    this.dead = null;
    this.image = null;
    this.iX = null;
    this.iY = null;
}
Cell.prototype = {
    draw: function () {

            ctx.drawImage(this.image,this.iX, this.iY, this.size, this.size, this.x, this.y, this.size, this.size);



    },

    isEmpty: function () {
        return this.dead;
    },

    setIndex: function (row, col) {
        this.rowIndex = row;
        this.colIndex = col;
    },

    setImage: function (imageSrc) {
        this.image = new Image (this.size * this.size);
        this.image.src   = imageSrc;
        this.iX = this.x;
        this.iY = this.y;
    }
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getRange(cellA, cellB) {
    var xRange = Math.abs(cellA.x-cellB.x);
    var yRange = Math.abs(cellA.y-cellB.y);

    return Math.sqrt(Math.pow(xRange, 2) + Math.pow(yRange, 2));
}

function load (imageSrc) {
    var i = new Image ();

    i.onload = function () {
        ctx.drawImage(i,0,0);
    };
    i.src = imageSrc;
}

function shuffleArray () {
    var j, array, i;
    var tmpArray = imageCord;
    for (i = tmpArray.length; i; i--) {
        j = Math.floor(Math.random() * i);
        array = tmpArray[i - 1];
        tmpArray[i - 1] = tmpArray[j];
        tmpArray[j] = array;
    }
    return tmpArray;
}

function start () {
    map.refresh();
    map.draw();
    console.log(imageCord);
}
