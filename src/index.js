import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.isWinCause ? "square win-cause" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isWinCause={isWinCause(this.props.squares, i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for (let row = 0; row < 3; row++) {
      var cols = [];
      for (let col = 0; col < 3; col++) {
        cols.push(this.renderSquare(row * 3 + col));
      }

      rows.push(
        <div className="board-row" key={row}>{cols}</div>
      );
    }

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastPassedIndex: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    console.log(i);
    this.setState({
      history: history.concat([{
        squares: squares,
        lastPassedIndex: i,
      }]),
        stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleMovesOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const row = Math.floor(step.lastPassedIndex / 3);
      const col = step.lastPassedIndex % 3;
      const desc = move ?
        `Go to move #${move}(row: ${row}, col: ${col})` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={move === this.state.stepNumber ? "selected-item" : ""}
          >
            {desc}
          </button>
        </li>
      )
    })

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
          <div>{status}</div>
          <ol>{this.state.isAscending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.toggleMovesOrder()}>Sort buttons</button>
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
  const line = calculateWinCauseSquares(squares);
  return line.length !== 0
    ? squares[line[0]]
    : null;
}

function isWinCause(squares, squareIndex) {
  return calculateWinCauseSquares(squares).includes(squareIndex);
}

function calculateWinCauseSquares(squares) {
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
      return lines[i];
    }
  }

  return [];
}
