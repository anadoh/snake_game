
let canvas = document.getElementById("canvas");
let contex = canvas.getContext("2d");
// contex.fillRect(0,0,10,10);
let width = canvas.width;
let height = canvas.height;
let blockSize = 10;
let blockWidth = width / blockSize;
let blockHeigth = height / blockSize;
let result = 0;




let time = setInterval(function () {
    contex.clearRect(0,0,width,height);
    printResult();
    snake.move();
    snake.print();
    apple.print();
    printBorder();
}, 100);



const printBorder = function (){
    contex.fillStyle = "Gray";
    contex.fillRect(0,0,width,blockSize);
    contex.fillRect(0,height-blockSize,width,blockSize);
    contex.fillRect(0,0,blockSize,width);
    contex.fillRect(width-blockSize,0,blockSize,height);
};
printBorder()




const printResult = function() {
    contex.font = "14px Comic Sans MS";
    contex.textBaseline = "top";
    contex.fillStyle = "Black";
    contex.textAlign = "left";
    contex.fillText("Result: " + result,blockSize,blockSize);
    };

printResult()

const gameOver = function() {
    clearInterval(time);
    contex.font = "60px Comic Sans MS";
    contex.textBaseline = "middle";
    contex.fillStyle = "Black";
    contex.textAlign = "center";
    contex.fillText("Game Over", 200, 200);
};

gameOver();

const Block = function (column, row) {
    this.column = column;
    this.row = row;
}

Block.prototype.squarePrint = function(color) {
    let x = this.column * blockSize;
    let y = this.row * blockSize;
    contex.fillStyle = color;
    contex.fillRect(x,y,blockSize,blockSize);
};

// draw an apple
var circle = function (x,y,r) {
    contex.beginPath();
    contex.arc(x,y,r,0,Math.PI *2, false);
    contex.fill();
}

Block.prototype.circlePrint = function (color) {
    var cx = this.column * blockSize + blockSize/2;
    var cy = this.row * blockSize + blockSize/2;
    contex.fillStyle = color;
    circle(cx,cy,blockSize/2, true);
};

var cir = new Block(4,30);
cir.circlePrint("Red")

//if the snake's head and the apple are in the same place//

Block.prototype.compare = function (block) {
    return ((this.column === block.column) && (this.row === block.row));
}

// var apple = new Block(2,3);
// var head = new Block (2,3)
// console.log(head.compare(apple))

var snake = function () {
    this.section = [
        new Block(8,4),
        new Block(7,4),
        new Block(6,4),
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

snake.prototype.draw = function() {
    for (let i=0; i< this.section.length; i++) {
        this.section[i].squarePrint("Green");
    }
};

let snaked = new snake();
snaked.draw();

snake.prototype.move = function() {
    var head = this.section[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.column + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.column, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.column - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.column, head.row - 1);
    }

    if(this.headCollision(newHead)){
        gameOver();
        return;
    }

    this.section.unshift(newHead);

    if (newHead.compare(apple.position)) {
        result++;
        apple.move();
    } else {
        this.section.pop();
    }
};

    

