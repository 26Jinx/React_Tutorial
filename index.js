import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            { props.value }
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(n) {
        const numOfSquares = 3;
        const boardRow = [];

        for (let i=0; i<numOfSquares; i++) {
            boardRow.push(this.renderSquare(i+(n*3)))
        }

        return (
            <div className='board-row'>
                {boardRow}
            </div>
        )
    }

    render() {
        const numOfRows = 3;
        const allRows = [];

        for (let j=0; j<numOfRows; j++) {
            allRows.push(this.renderRow(j));
        }

        return (
            <div>
                {allRows}
            </div>
        );
    }

}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),  // [null, null, ..., null] (length 9)
                coordinates: [0, 0],         // current coordinates
            }],
            stepNumber: 0,
            xIsNext: true,
            isSelected: false,
            movesListAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                coordinates: get_coordinates(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleToggle() {
        this.setState({
            movesListAscending: !this.state.movesListAscending
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];    // current step
        const winner = calculateWinner(current.squares);
        const movesListOrder = this.state.movesListAscending ? "Ascending" : "Descending";

        const moves = history.map((step, move) => {
            const desc = (move ? 'Go to move #' + move : 'Go to game start') + ' | Location (Row: ' + step.coordinates[0] + ' Column:' +
                ' ' + step.coordinates[1] + ')';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> { desc } </button>
                </li>
            );
        });

        const movesList = movesListOrder === "Ascending" ? moves : moves.reverse();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <div id="status">{ status }</div>
                        <div id="toggleBtn">
                            <button id="toggleOrder" onClick={() => this.handleToggle()}>
                                { movesListOrder }
                            </button>
                        </div>
                    </div>
                    <ol>{ movesList }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function get_coordinates(square) {
    const coordinates = {
        0: [1, 1],
        1: [1, 2],
        2: [1, 3],
        3: [2, 1],
        4: [2, 2],
        5: [2, 3],
        6: [3, 1],
        7: [3, 2],
        8: [3, 3]
    };

    return coordinates[square];
}