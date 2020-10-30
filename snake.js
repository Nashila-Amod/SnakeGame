let world = [];
var ROWS, COLS;
var EMPTY = "EMPTY", SNAKE = "SNAKE", FRUIT = "FRUIT";

let snake = [];
var snakeLength;
var snakeHeadPosition = [];
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3, NONE = -1;
let direction = NONE;

var initialFoodPosition = [];
var foodMove;
var foodDelay;

var canvas,	canvas_context;
var gameActive, gameControl;
var delay; // call step function X times per second
var score;
var level;

var dataJson;

// Audio files
const deadAudio = new Audio();
const eatAudio = new Audio();

deadAudio.src = "dead.mp3";
eatAudio.src = "eat.mp3";


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
					canvas_context.fillStyle = "#292b2c";
                    break;
                    
				case SNAKE:
                    canvas_context.fillStyle = "#f7f7f7";
                    break;
                
                case FRUIT :
                    canvas_context.fillStyle = "#5cb85c";
					break;
			}

            canvas_context.fillRect(y*widthCell, x*heightCell, widthCell, heightCell);
        }
    }

    // changes the fillstyle once more and draws the score
    canvas_context.fillStyle = "#f7f7f7";
	canvas_context.font = "15px Helvetica";
	canvas_context.fillText("SCORE : " + score, canvas.width/2, canvas.height-10);
}


/* CREATION OF THE SNAKE */

function createSnake(x_row,y_col, snakeLength)
{
    insertHead(x_row, y_col);

    for(var x = 1; x < snakeLength ; x++)
    {
        y_col++;
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
    return snake.unshift([x_row, y_col]);
}

function removeTail(x_row,y_col)
{
    setCellWorld(EMPTY, x_row, y_col);
    return snake.shift();
}


/* GENERATING FOOD */

function setInitialFood(x_row, y_col)
{
    setCellWorld(FRUIT, x_row, y_col);
    foodMove = setTimeout(function () { removeFood(x_row, y_col);}, foodDelay);    
}

function setFoodRandom() {

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
    var x_row = fruitCell[0];
    var y_col = fruitCell[1];
    setCellWorld(FRUIT, x_row, y_col);

    foodMove = setTimeout(function () { removeFood(x_row, y_col);}, foodDelay);

}

function removeFood(x_row, y_row)
{    
    
    if(getCellWorld(x_row, y_row) === FRUIT)
    {
        setCellWorld(EMPTY, x_row, y_row);
        setFoodRandom();
        return;
    }
  
}


/* FUNCTION MAIN : STARTS THE GAME */

function startMenu()
{
    var levelSelect = document.getElementById("levelSelect");
    level = levelSelect.value;
    
    var startMenuDiv = document.getElementById("startMenu");
    startMenuDiv.parentNode.removeChild(startMenuDiv);
    initiateLevel();
    initGame();
}


function initGame()
{
    // Create and initiate the canvas element
    canvas = document.createElement("canvas");
    canvas.width = COLS*16; // Multiply by 20 to display the canvas bigger
    canvas.height = ROWS*16;
    canvas_context = canvas.getContext("2d");

    // Add the canvas element to the body of the document
    document.body.appendChild(canvas);

    document.addEventListener("keydown", keyDownEvent);

    gameControl = startGame(delay);
}

function startGame(delay)
{
    gameActive = true;
    init();
    return setInterval(step, delay);
}

function init() 
{
    createWorld(ROWS, COLS);
    score = 0;

    // Initiate the snake
    var snakeX = snakeHeadPosition[0];
    var snakeY = snakeHeadPosition[1];
    createSnake(snakeX, snakeY, snakeLength);

    // Set food on the grid
    setInitialFood(initialFoodPosition[0], initialFoodPosition[1]);
    draw();
}

function initiateLevel()
{
    var request = new XMLHttpRequest();

    // Initiate the game
    if(level === "level1")
    {
        request.open("GET", "../level1.json", false);
        request.send(null)
        dataJson = JSON.parse(request.responseText);
    }
    else if(level === "level2")
    {
        request.open("GET", "../level2.json", false);
        request.send(null)
        dataJson = JSON.parse(request.responseText);
    }
    else if(level === "level3")
    {
        request.open("GET", "../level3.json", false);
        request.send(null)
        dataJson = JSON.parse(request.responseText);
    }

    ROWS = dataJson.dimensions[1];
    COLS = dataJson.dimensions[0];
    delay = dataJson.delay;
    foodDelay = dataJson.foodDelay;

    snakeLength = dataJson.snake.length;
    snakeHeadPosition = Array.from(dataJson.snake[snakeLength-1]);

    initialFoodPosition = Array.from(dataJson.food[0]);
}

function endGame() 
{
    clearInterval(gameControl);  

    gameActive = false;

    canvas.parentNode.removeChild(canvas);

    var divGameOver = document.createElement("div");
    divGameOver.classList += "text-white bg-dark text-center border rounded p-5 w-50"

    var titleGameOver = document.createElement("h1");
    titleGameOver.classList += "my-5";
    titleGameOver.textContent = 'GAME OVER';

    var divButton = document.createElement("div");
    divButton.classList += "d-flex justify-content-center";

    var refreshButton = document.createElement("button");
    refreshButton.classList += "btn btn-danger btn-lg mb-5";
    refreshButton.setAttribute('type', 'button');
    refreshButton.setAttribute('onclick', "window.location.reload();");
    refreshButton.textContent = "RESTART";

    divButton.appendChild(refreshButton);
    divGameOver.appendChild(titleGameOver);
    divGameOver.appendChild(divButton);

    document.body.appendChild(divGameOver);

    deadAudio.play();

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
    if(direction != NONE)
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

        //checks all gameover conditions

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

        if(getCellWorld(headX, headY) === SNAKE && snake.length > snakeLength)
        {
            gameActive = false;
            return;
        }

        // check whether the new position are on the fruit item

        if (getCellWorld(headX, headY) === FRUIT) 
        {
            score++;
            eatAudio.play();
            setFoodRandom();            
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
    
}
