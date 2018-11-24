import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square' + ' ' + (props.isHighligted ? 'highlight' : '')}
      onClick={ () => props.onClick()}
    >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value = {this.props.squares[i]}
      onClick = {() => this.props.onClick(i)}
      isHighligted = {this.props.highlighted_squares.includes(i)}
      />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        desc: '',
      }],
      xIsNext: true,
      stepNumber: 0,
      highlighted_squares: [],
      isDraw: false,
      isOrderAsc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const desc = genarateDesc(squares[i], i)
    this.setState({
      history: history.concat([{
        squares: squares,
        desc : desc
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      highlighted_squares: calculateWinner(squares).line,
      isDraw: (squares.filter(square => square !== null).length === 9)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleHistoryOrder() {
    const isAsc = this.state.isOrderAsc;
    this.setState({
      isOrderAsc: !isAsc,
    })
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const desc = current.desc

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + (move + 1):
        'Go to game start';

        return (
          <li key={move} style={move === this.state.stepNumber ? {fontWeight:'bold'} : {}}>
            <p>
              <button onClick={()=> this.jumpTo(move)}>{desc}</button>
              <span>{step.desc}</span>
            </p>
          </li>
        )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.isDraw) {
      status = 'Draw';
    } else {
      status = 'NextPlayer: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            highlighted_squares = {this.state.highlighted_squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{desc}</div>
          <button onClick={() => this.toggleHistoryOrder()}>toggle moves</button>
          {this.state.isOrderAsc? <ol>{moves}</ol> : <ol reverse>{moves.reverse()}</ol>}
        </div>
      </div>
    );
  }
}

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
  let winner = null;
  let line = []
  for (let i = 0; i < lines.length ; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a];
      line = [a, b, c];
    }
  }
  return {
    winner: winner,
    line: line
  }
}

function genarateDesc(player, i) {
  const col = i % 3 + 1;
  const row = Math.floor(i / 3) + 1;
  return player + ' markes' + ' row: ' + row + ' col: ' + col
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
