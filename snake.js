let world = [];
var ROWS = 40, COLS = 80;
var EMPTY = "EMPTY", SNAKE = "SNAKE", FRUIT = "FRUIT";

let snake = [];
var LEFT = 0, UP = 1, RIGHT = 2, DOWN  = 3;
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN  = 40;

var canvas,	canvas_context;

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
					canvas_context.fillStyle = "#fff";
					break;
			}

            canvas_context.fillRect(y*widthCell, x*heightCell, widthCell, heightCell);
        }
    }
}


/* CREATION OF THE SNAKE */


function createSnake(x_row,y_col, snakeLength)
{
    setCellWorld(SNAKE, x_row, y_col);
    snake.push([x_row, y_col]); // Add the new position of the head at the end of the snake array

    for(var x = 0; x < snakeLength ; x++)
    {
        x_row++;
        grow(x_row, y_col);
    }
}

function grow(x_row, y_col)
{
    setCellWorld(SNAKE, x_row, y_col);
    return snake.unshift(x_row, y_col);
}

function removeTail()
{
    return snake.shift();
}



/* FUNCTION MAIN : STARTS THE GAME */

function main()
{
    // Create and initiate the canvas element
    canvas = document.createElement("canvas");
    canvas.width = COLS*16; // Multiply by 20 to display the canvas bigger
    canvas.height = ROWS*16;
    canvas_context = canvas.getContext("2d");

    // Add the canvas element to the body of the document
    document.body.appendChild(canvas);

    // Initiate the game
    createWorld(ROWS, COLS);

    var snakeX = Math.floor(ROWS/2);
    var snakeY = Math.floor(COLS/ 2);
	createSnake(snakeX - 1, snakeY - 1, 15);
   
    loop();    
}

function loop() {
    draw();
}



main();


