var speed = 10;

class Board
{
    constructor(board) 
    {
        this.xpos = 0;
        this.ypos = 0;
        this.board = board;
    }

    async process()
    {
        let first_cell = this.get_first();
        if(first_cell == undefined)
        {
            return this.board;
        }

        for(let i = 1; i < 10; i++)
        {
            if(speed > 1)
            {
                await sleep(speed);
                render(this, first_cell);
            }
            this.board[first_cell.row][first_cell.column] = i;
            if(this.is_valid_cell(first_cell.row, first_cell.column))
            {
                if(await this.process() != false)
                {
                    return this.board;
                }
            }
        }
        
        this.board[first_cell.row][first_cell.column] = 0;
        return false;
    }

    is_valid_cell(xpos, ypos)
    {
        let valid = 0;
        valid += this.is_valid_square(xpos, ypos);
        valid += this.is_valid_row(xpos, ypos);
        valid += this.is_valid_column(xpos, ypos);
        return valid == 3;
    }

    is_valid_square(xpos, ypos)
    {
        let value = this.board[xpos][ypos];
        let square_x = parseInt(xpos / 3) * 3;
        let square_y = parseInt(ypos / 3) * 3;
        
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                if(!(square_x + j == xpos && square_y + i == ypos))
                {
                    if(this.board[square_x + j][square_y + i] == value)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    is_valid_row(xpos, ypos)
    {
        let value = this.board[xpos][ypos];
        for(let i = 0; i < 9; i++)
        {
            if(this.board[xpos][i] == value && ypos != i)
            {
                return false;
            }
        }
        return true;
    }

    is_valid_column(xpos, ypos)
    {
        let value = this.board[xpos][ypos];
        for(let i = 0; i < 9; i++)
        {
            if(this.board[i][ypos] == value && xpos != i)
            {
                return false;
            }
        }
        return true;
    }

    is_finished()
    {
        if(!this.is_valid_board())
        {
            return false;
        }
        
        for (let boardRow = 0; boardRow < 9; boardRow++)
        {
            for (let boardColumn = 0; boardColumn < 9; boardColumn++)
            {
                if (!this.is_valid_cell(boardRow, boardColumn))
                {
                    return false;
                }
            }
        }
        return true;
    }

    is_valid_board()
    {
        for (let boardRow = 0; boardRow < 9; boardRow++)
        {
            if(this.board[boardRow].includes(0))
            {
                return false;
            }
        }
        return true;
    }

    get_first()
    {
        for (let boardRow = 0; boardRow < 9; boardRow++)
        {
            if(this.board[boardRow].includes(0))
            {
                for (let boardColumn = 0; boardColumn < 9; boardColumn++)
                {
                    if(this.board[boardRow][boardColumn] == 0)
                    {
                        return {
                            row: boardRow,
                            column: boardColumn
                        };
                    }
                }
            }
        }
    }
}


let board = [
    [0, 0, 0, 8, 3, 0, 0, 0, 5],
    [8, 0, 0, 7, 9, 0, 0, 0, 1],
    [5, 0, 9, 0, 1, 0, 0, 4, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 1, 3, 0, 0],
    [0, 4, 0, 3, 0, 0, 1, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 8, 9, 0],
    [3, 0, 0, 0, 8, 0, 4, 7, 2],
    /*[0,0,4,1,8,6,9,2,5],
    [6,1,2,9,7,5,8,4,3],
    [5,8,9,4,3,2,6,7,1],
    [1,2,6,8,4,7,3,5,9],
    [4,9,8,3,5,1,2,6,7],
    [3,7,5,6,2,9,1,8,4],
    [9,4,1,7,6,8,5,3,2],
    [8,5,3,2,1,4,7,9,6],
    [2,6,7,5,9,3,4,1,8]*/
];

async function run(){
    let sudoku_solver = new Board(board);
    await sudoku_solver.process();
    if(sudoku_solver.is_finished())
    {
        console.log(sudoku_solver.board);
    }
    else
    {
        console.log("unsolvable");
    }
    render(sudoku_solver, {row: 8, column: 8});
    await sleep(10);
    alert("finished!");
}


function render(board, first_cell)
{
    var sudoku_board = $("#board");
    sudoku_board.empty();
    var str = ""
    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            if(first_cell.row == i && first_cell.column == j)
            {
                str += '<div class="flex-item" style="background-color: rgba(255, 0, 0, 0.4);">' + board.board[i][j] + '</div>';
            }
            else
            {
                str += '<div class="flex-item">' + board.board[i][j] + '</div>';
            }
        }
    }
    sudoku_board.append(str);
}

function sleep(ms) 
{
    return new Promise((resolve) => 
    {
        setTimeout(resolve, ms);
    });
}

$(document).ready(function()
{
    run();
    $("#speed").change(function(){
        let speed_value = $("#speed").val();
        speed = 100 - speed_value / 10;
        console.log(speed);
    });
});