import React from 'react';
import './App.css';

const piecesNum = 3
class Pieces {
  constructor(val) {
    this.coordinate = val;
    this.original = val;
  }
  getStyle() {
    const x = this.coordinate % piecesNum * 102;
    const y = ((this.coordinate / piecesNum) >> 0) * 102;
    return {
      transform: `translate(${x}px, ${y}px)`
    }
  }
}

function initPiecesArray() {
  const tmp = [];
  for (let index = 0; index < (piecesNum * piecesNum -1); index++) {
    tmp.push(new Pieces(index));
  }
  return tmp;
}

class PuzzlePiece extends React.Component {
  render() {
    const index = this.props.pieces.original;
    return (
      <div className="cell" style={this.props.pieces.getStyle()} onClick={() => {this.props.movePiece(index)}}>
        {index + 1}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
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
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      piecesArray: initPiecesArray(),
      emptyCoordinate: (piecesNum * piecesNum -1),
    };
  }

  componentDidMount(){
    this.shufflePuzzle();
  }
  
  shufflePuzzle = () => {
    let pNum = (piecesNum * piecesNum -1),
      cell = this.state.piecesArray,
      i = 0;
    while (pNum) {
      pNum--;
      i = Math.floor(Math.random() * pNum);
      [cell[pNum].coordinate, cell[i].coordinate] = [cell[i].coordinate, cell[pNum].coordinate];
    }
    this.setState({piecesArray: cell});
  }
  movePiece = (index) => {
    const cell = this.state.piecesArray,
      iPos = cell[index].coordinate,
      ePos = this.state.emptyCoordinate,
      indexDiff = ePos - iPos;
    
        //vertical
      if (iPos % piecesNum === ePos % piecesNum) {
        if (Math.abs(indexDiff / piecesNum) > 1) {
          this.moveDoubleAndTriple((indexDiff / piecesNum), index, piecesNum);
        } else if (Math.abs(indexDiff / piecesNum) === 1) {
          this.moveSinglePiece(iPos, index);
        }
      }
      //horizontal
      if ((iPos / piecesNum) >> 0 === (ePos / piecesNum) >> 0) {
        if (Math.abs(indexDiff) > 1) {
          this.moveDoubleAndTriple(indexDiff, index, 1);
        } else if (Math.abs(indexDiff) === 1) {
          this.moveSinglePiece(iPos, index);
        }
      }
    
  }
  moveSinglePiece = (indexDiff, index) => {
    const cell = this.state.piecesArray;
    cell[index].coordinate = this.state.emptyCoordinate;
    this.setState((state) => {
      return {
        piecesArray: cell,
        emptyCoordinate: indexDiff,
      }
    });
  }
  moveDoubleAndTriple = (indexDiff, index, moveLength) => {
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
      }
    });
  }
  findPuzzleIndex = (val) => {
    for (let i = 0; i < (piecesNum * piecesNum -1); i++) {
      if (this.state.piecesArray[i].coordinate === val) return i;
    }
  }

  render() {
    return(
      <div className="puzzle">
        <PuzzleGrid piecesArrayProps={this.state.piecesArray} movePiece={this.movePiece}/>
      </div>
    )
  }
}
export default App;
