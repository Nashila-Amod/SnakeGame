let world = [];
var ROWS = 40, COLS = 80;
var EMPTY = "EMPTY", SNAKE = "SNAKE", FRUIT = "FRUIT";

let snake = [];
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3, NONE = -1;
let direction = NONE;

var canvas,	canvas_context;
var gameActive, gameControl;
// render X times per second
var x = 10;

/* CREATION OF THE WORLD */

function createWorld(rowCount, columnCount)
{
    for(var x = 0; x < rowCount ; x++)
    {
        var row = [];

        for(var y = 0; y < columnCount ; y++)
        {
            row.push(EMPTY);
        }

        world.push(row); // Add new row to the world
    }
}

function setCellWorld(value, row, column)
{
    world[row][column] = value;
}

function getCellWorld(row, column)
{
    return world[row][column];
}

/* Render the world grid to the canvas */

function draw()
{
    var widthCell = canvas.width/COLS;
    var heightCell = canvas.height/ROWS;
    
    // Iterate through the world grid and draw all cells
    for(var x = 0; x < ROWS ; x++)
    {
        for(var y = 0 ; y < COLS ; y++)
        {
            // sets the fillstyle depending on the content of the cell
            switch (getCellWorld(x,y)) {
                
				case EMPTY:
					canvas_context.fillStyle = "#0ff";
                    break;
                    
				case SNAKE:
                    canvas_context.fillStyle = "#ff0000";
                    break;
                
                case FRUIT :
                    canvas_context.fillStyle = "#000";
					break;
			}

            canvas_context.fillRect(y*widthCell, x*heightCell, widthCell, heightCell);
        }
    }
}


/* CREATION OF THE SNAKE */

function createSnake(x_row,y_col, snakeLength)
{
    insertHead(x_row, y_col);

    for(var x = 1; x < snakeLength ; x++)
    {
        x_row++;
        grow(x_row, y_col);
    }
}

function insertHead(x_row, y_col)
{
    setCellWorld(SNAKE, x_row, y_col);
    snake.push([x_row, y_col]); // Add the new position of the head at the end of the snake array
}

function grow(x_row, y_col)
{
    setCellWorld(SNAKE, x_row, y_col);
    return snake.unshift(x_row, y_col);
}

function removeTail(x_row,y_col)
{
    setCellWorld(EMPTY, x_row, y_col);
    return snake.shift();
}


/* GENERATING FOOD */

function setFood() {

    var empty = [];
    
	// iterate through the grid and find all empty cells
	for (var x= 0; x < ROWS; x++) {

		for (var y = 0; y < COLS; y++) {

			if (getCellWorld(x,y) === EMPTY) {
                
				empty.push([x,y]);
			}
		}
    }
    
	// chooses a random cell
    var fruitCell = empty[Math.round(Math.random()*(empty.length - 1))];
    setCellWorld(FRUIT, fruitCell[0], fruitCell[1]);
}


/* FUNCTION MAIN : STARTS THE GAME */

window.onload = function() {

    // Create and initiate the canvas element
    canvas = document.createElement("canvas");
    canvas.width = COLS*16; // Multiply by 20 to display the canvas bigger
    canvas.height = ROWS*16;
    canvas_context = canvas.getContext("2d");

    // Add the canvas element to the body of the document
    document.body.appendChild(canvas);

    document.addEventListener("keydown", keyDownEvent);

    gameControl = startGame(x);

};

function startGame(x)
{
    gameActive = true;
    init();
    draw();
    return setInterval(step, 1000/x);
}

function init() 
{
    // Initiate the game
    createWorld(ROWS, COLS);

    // Initiate the snake
    var snakeX = Math.floor(ROWS/2);
    var snakeY = Math.floor(COLS/ 2);
    createSnake(snakeX - 1, snakeY - 1, 1);

    // Set food on the grid
    setFood();
}

function endGame() 
{
    clearInterval(gameControl);
    gameActive = false;

    canvas_context.fillStyle = 'white';
    canvas_context.textBaseline = 'middle'; 
    canvas_context.textAlign = 'center'; 
    canvas_context.font = 'normal bold 18px serif';
    canvas_context.fillText('Game over', canvas.width/2, canvas.height/2);

}


function step()
{
    if(gameActive)
    {
        move_snake();
        draw();
    }
    else
    {
        endGame();
    }

}


function keyDownEvent(e) {
    
    var keyPressed = e.keyCode;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (keyPressed === LEFT_KEY && direction !== RIGHT) {
        
        direction = LEFT;
    }

    if (keyPressed === UP_KEY && direction !== DOWN) {
        
        direction = UP;
    }

    if (keyPressed === RIGHT_KEY && direction !== LEFT) {
        
        direction = RIGHT;
    }

    if (keyPressed === DOWN_KEY && direction !== UP) {
       
        direction = DOWN;   
    }

}


function move_snake()
{
    // Get the position of the head :
    var head = snake[snake.length - 1]
    var headX = head[0];
    var headY = head[1];

    switch (direction) {

        case LEFT:
            headY--; //decrease column
            break;

        case UP:
            headX--; //decrease row
            break;

        case RIGHT:
           headY++;
            break;

        case DOWN:
            headX++;
            break;
    }

    // checks all gameover conditions

    if (0 > headX || headX > ROWS-1) 
    {
        gameActive = false;
        return;
    }

    if (0 > headY || headY > COLS-1) 
    {
        gameActive = false;
        return;
    }

    if(getCellWorld(headX, headY) === SNAKE && snake.length > 1)
    {
        gameActive = false;
        return;
    }
    

    // check whether the new position are on the fruit item
    
    if (getCellWorld(headX, headY) === FRUIT) 
    {
        setFood();
    } 
    else 
    {
        // Get the position of the tail
        var tail = snake[0];
        var tailX = tail[0];
        var tailY = tail[1];

        // Remove the last position of the tail
        removeTail(tailX, tailY);
    }

    // Add new head 
    insertHead(headX, headY);
}
