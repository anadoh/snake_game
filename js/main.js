
//canvas

let canvas = document.getElementById("canvas");
let contex = canvas.getContext("2d");

// making canvas width and height
let width = canvas.width;
let height = canvas.height;
//net size
let blockSize = 10;
let blockWidth = width / blockSize;
let blockHeigth = height / blockSize;

let result = 0;


let time = setInterval(function () {
    contex.clearRect(0,0,width,height);
    printResult();
    snake.move();
    snake.draw();
    apple.draw();
    printBorder();
}, 100);


// Drawing border
const printBorder = function (){
    contex.fillStyle = "Gray";
    contex.fillRect(0,0,width,blockSize);
    contex.fillRect(0,height-blockSize,width,blockSize);
    contex.fillRect(0,0,blockSize,width);
    contex.fillRect(width-blockSize,0,blockSize,height);
};

const printResult = function() {
    contex.font = "14px Comic Sans MS";
    contex.textBaseline = "top";
    contex.fillStyle = "Black";
    contex.textAlign = "left";
    contex.fillText("Result: " + result,blockSize,blockSize);
    };

const gameOver = function() {
    clearInterval(time);
    contex.font = "60px Comic Sans MS";
    contex.textBaseline = "middle";
    contex.fillStyle = "Black";
    contex.textAlign = "center";
    contex.fillText("Game Over", 200, 200);
};

// Block
const Block = function (column, row) {
    this.column = column;
    this.row = row;
}
//drawing square in bloks place 
Block.prototype.squarePrint = function(color) {
    let x = this.column * blockSize;
    let y = this.row * blockSize;
    contex.fillStyle = color;
    contex.fillRect(x,y,blockSize,blockSize);
};

// drawing circle in bloks place 
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

//if the snake's head and the apple are in the same place//
Block.prototype.compare = function (block) {
    return ((this.column === block.column) && (this.row === block.row));
}

//snake 
var Snake = function () {
    this.section = [
        new Block(8,4),
        new Block(7,4),
        new Block(6,4),
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

//each of the snakes part draw by square 
Snake.prototype.draw = function() {
    for (let i=0; i< this.section.length; i++) {
        this.section[i].squarePrint("Green");
    }
};

let snake= new Snake();
snake.draw();


// make a new head of snake and put it in front of snake 
Snake.prototype.move = function() {
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

//collision - game over
Snake.prototype.headCollision = function(head) {
    let leftCollision = (head.column === 0);
    let rightCollision = (head.column === blockWidth -1);
    let upCollision = (head.row === 0);
    let downCollision = (head.row === blockHeigth -1);
    let wallCollision = leftCollision || rightCollision || upCollision || downCollision;
    
    let tailCollision = false;
    for (let i=0; i<this.section.length; i++) {
        if (head.compare(this.section[i])) {
            tailCollision = true;
        }
    }
    return wallCollision || tailCollision;
}

//key operation
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$("body").keydown(function (press) {
    let newDirection = directions[press.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    };

this.nextDirection = newDirection;
};

//Apple
var Apple = function () {
    this.position = new Block(10,10);
};

Apple.prototype.draw = function() {
    this.position.circlePrint("Red");
};

var apple = new Apple();
apple.draw();

//move an apple in mew random place
Apple.prototype.move = function () {
    let randomColumn = Math.floor (Math.random() * (blockWidth -2)) + 1;
    let randomRow = Math.floor(Math.random() * (blockHeigth - 2)) + 1;
    this.position = new Block (randomColumn, randomRow); 
};




