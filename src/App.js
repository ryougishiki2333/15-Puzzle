import React from 'react';
// import logo from './logo.svg';
import './App.css';

class Pieces {
  constructor(val) {
    this.coordinate = val;
    this.original = val;
  }
  getStyle() {
    const x = this.coordinate % 4 * 102;
    const y = ((this.coordinate / 4) >> 0) * 102;
    return {
      transform: `translate(${x}px, ${y}px)`
    }
  }
}

function initPiecesArray() {
  const tmp = [];
  for (let index = 0; index < 15; index++) {
    tmp.push(new Pieces(index));
  }
  return tmp;
}

class PuzzlePiece extends React.Component {
  render() {
    const index = this.props.pieces.original;
    return (
      <div className="cell" style={this.props.pieces.getStyle()} onClick={() => this.props.movePiece(index)}>
        {index + 1}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.hmove = this.hmove.bind(this);
  //   this.state = {data: 0}
  // }
  // hmove(e,index) {
  //   console.log(index)
  //   // console.log(e)
  //   this.setState({data: index})
  // }
  render() {
    return (
      <div className="grid">
        {this.props.piecesArrayProps.map((p) =>
          <PuzzlePiece key={p.original} pieces={p} movePiece={this.props.movePiece}/>
        )};
      </div>
    )
  }
}

class NewGameBtn extends React.Component {
  render() {
    return (
      <div className="button" onClick={() => this.props.newGame()}>
        New Game
      </div>
    )
  }
}

class DisplayLabel extends React.Component {
  render() {
    return (
      <div className="label">
        <div className="label-icon">
          {this.props.children}
        </div>
        <div className="label-content">
          {this.props.content}
        </div>
      </div>
    )
  }
}

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    }
  }
  render() {
    return (
      <div className="bar">
        <NewGameBtn newGame={this.props.newGame}/>
        <DisplayLabel content={this.props.step}>
          <i className="fas fa-shoe-prints" />
        </DisplayLabel>
        <DisplayLabel content={this.state.time}>
          <i className="fas fa-clock" />
        </DisplayLabel>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      piecesArray: initPiecesArray(),
      emptyCoordinate: 15,
      step: 0,
      isEnd: true,
    };
    this.initGame = this.initGame.bind(this);
    this.newGame = this.newGame.bind(this);
    this.shufflePuzzle = this.shufflePuzzle.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.moveSinglePiece = this.moveSinglePiece.bind(this);
    this.moveDoubleAndTriple = this.moveDoubleAndTriple.bind(this);
    this.findPuzzleIndex = this.findPuzzleIndex.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.checkWin = this.checkWin.bind(this);
  }
  initGame() {
    this.setState((state) => {
      return {
        piecesArray: initPiecesArray(),
        emptyCoordinate: 15,
        step: 0,
        isEnd: false,
        isTimerOn: false
      }
    });
    this.shufflePuzzle();
  }
  newGame() {
    if (this.state.isEnd || window.confirm('New Game?')) this.initGame();
  }
  shufflePuzzle() {
    let pNum = 15,
      cell = this.state.piecesArray,
      i = 0;
      console.log(pNum)
    while (pNum) {
      pNum--;
      i = Math.floor(Math.random() * pNum);
      [cell[pNum].coordinate, cell[i].coordinate] = [cell[i].coordinate, cell[pNum].coordinate];
    }
    this.setState({piecesArray: cell});
  }
  movePiece(index) {
    const cell = this.state.piecesArray,
      iPos = cell[index].coordinate,
      ePos = this.state.emptyCoordinate,
      indexDiff = ePos - iPos;
    if (!this.state.isEnd) {
        //vertical
      if (iPos % 4 === ePos % 4) {
        if (Math.abs(indexDiff / 4) > 1) {
          this.moveDoubleAndTriple((indexDiff / 4), index, 4);
        } else if (Math.abs(indexDiff / 4) === 1) {
          this.moveSinglePiece(iPos, index);
        }
      }
      //horizontal
      if ((iPos / 4) >> 0 === (ePos / 4) >> 0) {
        if (Math.abs(indexDiff) > 1) {
          this.moveDoubleAndTriple(indexDiff, index, 1);
        } else if (Math.abs(indexDiff) === 1) {
          this.moveSinglePiece(iPos, index);
        }
      }
    }
  }
  moveSinglePiece(indexDiff, index) {
    const cell = this.state.piecesArray;
    cell[index].coordinate = this.state.emptyCoordinate;
    this.setState((state) => {
      return {
        piecesArray: cell,
        emptyCoordinate: indexDiff,
        step: state.step + 1
      }
    });
    this.checkWin();
  }
  moveDoubleAndTriple(indexDiff, index, moveLength) {
    const cell = this.state.piecesArray,
      iPos = cell[index].coordinate,
      sign = Math.sign(indexDiff),
      indexTmp = [];
    for (let i = 0; i < Math.abs(indexDiff); i++) {
      indexTmp.push(this.findPuzzleIndex(iPos + sign * moveLength * i));
    }
    for (const index of indexTmp) {
      cell[index].coordinate += moveLength * sign;
    }
    this.setState((state) => {
      return {
        piecesArray: cell,
        emptyCoordinate: iPos,
        step: state.step + 1
      }
    });
    this.checkWin();
  }
  findPuzzleIndex(val) {
    for (let i = 0; i < 15; i++) {
      if (this.state.piecesArray[i].coordinate === val) return i;
    }
  }
  showMessage(message) {
    setTimeout(() => alert(message), 600);
  }
  checkWin() {
    if (this.state.piecesArray.every((p) => p.original === p.coordinate)) {
      this.showMessage('You Win!');
      this.stopTimer();
      this.setState({
        isEnd: true
      });
    }
  }

  render() {
    return(
      <div className="puzzle">
        <h1>15 Puzzle</h1>
        <Toolbar newGame={this.newGame} step={this.state.step} timer={this.state.isTimerOn}/>
        <PuzzleGrid piecesArrayProps={this.state.piecesArray} movePiece={this.movePiece}/>
      </div>
    )
  }
}
export default App;
