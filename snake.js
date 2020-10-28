/* CREATION OF THE WORLD */

var world = [];
var ROWS = 80, COLS = 40;
var EMPTY = "EMPTY", SNAKE = "SNAKE", FRUIT = "FRUIT";

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
            if(world[x][y] === EMPTY)
            {
                canvas_context.fillStyle = "#0ff";
            }

            canvas_context.fillRect(x*widthCell, y*heightCell, widthCell, heightCell);
        }
        
    }
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
    createWorld(COLS, ROWS);
    draw();    
}

main();


