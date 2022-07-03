import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) { // a function component
    // apply to those that dont have their own states and only have render function
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
    value={this.props.squares[i]} 
    onClick={()=>this.props.onClick(i)
    }/>;
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

  constructor(props){
    super(props);
    this.state={
       history:[
        {squares: Array(9).fill(null),}
       ],
       xIsNext:false,
       stepNumber:0,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);

    const current = history[history.length-1];
    const squares = current.squares.slice(); //一番最近のsquareをコピーする!!!!!!!!!!!!!!!!!重要！

   // check if there is a winner or the squre already has been filled
   if(calculateWinner(squares)||squares[i])
   {
    return;
   }
   squares[i] = this.state.xIsNext ? 'X' : 'O';  // update

   this.setState({
    xIsNext: !this.state.xIsNext,
    stepNumber:history.length,
    history: history.concat([{squares:squares}])  // append to history
   })
  }

  jumpTo(step){
    this.setState({
        stepNumber:step,
        xIsNext: (step%2)===0, // xIsNext = step的奇偶

    });


  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //construct history react elements from history data
    // step = value, move = index
    const moves = history.map((step,move)=>{
        const describe = move?
        'Go to move #'+move:
        'Go to Game start';
        return (
          <li key={move}>
            <button onClick={()=> this.jumpTo(move)}>{describe}</button>
          </li>  
        );
        // this react element is created by for loop automatically
        // to make it maintain easy, we should assign keys to the element
        // key can not be referenced by props because react used it
        // The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
    })

    let status;
    if(winner)
    {
        status = 'Winner: ' + winner;
    }
    else
    {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          onClick={ (i)=> this.handleClick(i)} 
          squares={current.squares}/>
        </div>
        <div className="game-info">
            <div className="status">{status}</div>
            <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( < Game / > );


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
