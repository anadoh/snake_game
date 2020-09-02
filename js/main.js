
//canvas

var canvas = document.getElementById("canvas");
var contex = canvas.getContext("2d");

// making canvas width and height
var width = canvas.width;
var height = canvas.height;

//grid element size
var blockSize = 10;
var blockWidth = width / blockSize;
var blockHeigth = height / blockSize;

var result = 0;


var time = setInterval(function () {
    contex.clearRect(0,0,width,height);
    printResult();
    snake.move();
    snake.draw();
    apple.draw();
    printBorder();
}, 100);


// Drawing border
var printBorder = function (){
    contex.fillStyle = "Gray";
    contex.fillRect(0,0,width,blockSize);
    contex.fillRect(0,height-blockSize,width,blockSize);
    contex.fillRect(0,0,blockSize,width);
    contex.fillRect(width-blockSize,0,blockSize,height);
};

var printResult = function() {
    contex.font = "14px Comic Sans MS";
    contex.textBaseline = "top";
    contex.fillStyle = "Black";
    contex.textAlign = "left";
    contex.fillText("Result: " + result, blockSize*2,blockSize*2);
    };

var gameOver = function() {
    clearInterval(time);
    contex.font = "60px Comic Sans MS";
    contex.textBaseline = "middle";
    contex.fillStyle = "Black";
    contex.textAlign = "center";
    contex.fillText("Game Over", 200, 200);
};

// Block
var Block = function (column, row) {
    this.column = column;
    this.row = row;
};

//drawing square in bloks place 
Block.prototype.squarePrint = function(color) {
    var x = this.column * blockSize;
    var y = this.row * blockSize;
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

//if the snake's head and the apple are in the same place
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
    for (var i=0; i< this.section.length; i++) {
        this.section[i].squarePrint("Green");
    }
};

var snake= new Snake();
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
    var leftCollision = (head.column === 0);
    var rightCollision = (head.column === blockWidth -1);
    var upCollision = (head.row === 0);
    var downCollision = (head.row === blockHeigth -1);
    var wallCollision = leftCollision || rightCollision || upCollision || downCollision;
    
    var tailCollision = false;
    for (var i=0; i<this.section.length; i++) {
        if (head.compare(this.section[i])) {
            tailCollision = true;
        }
    }
    return wallCollision || tailCollision;
}

//key operation
var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$("body").keydown(function (press) {
    var newDirection = directions[press.keyCode];
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

//move an apple in new random place
Apple.prototype.move = function () {
    var randomColumn = Math.floor (Math.random() * (blockWidth -2)) + 1;
    var randomRow = Math.floor(Math.random() * (blockHeigth - 2)) + 1;
    this.position = new Block (randomColumn, randomRow); 
};




