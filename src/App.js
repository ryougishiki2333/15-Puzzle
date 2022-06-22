import React from "react";
import "./App.css";

class Pieces {
  constructor(val, width) {
    this.coordinate = val;
    this.original = val;
    this.width = width;
  }
  getStyle() {
    const x = (this.coordinate % this.width) * 82;
    const y = ((this.coordinate / this.width) >> 0) * 82;
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  }
}
class PuzzlePiece extends React.Component {
  render() {
    const index = this.props.pieces.original;
    return (
      <div
        className="cell"
        style={this.props.pieces.getStyle()}
        onClick={() => {
          this.props.movePiece(index);
        }}
      >
        {index + 1}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
  render() {
    return (
      <div
        className="grid"
        style={{ width: this.props.width * 82, height: this.props.height * 82 }}
      >
        {this.props.piecesArrayProps.map((p) => (
          <PuzzlePiece
            key={p.original}
            pieces={p}
            movePiece={this.props.movePiece}
          />
        ))}
        ;
      </div>
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      piecesArray: [],
      emptyCoordinate: 8,
      width: 3,
      height: 3,
      
    };
  }

  initPiecesArray() {
    const tmp = [];
    for (
      let index = 0;
      index < this.state.width * this.state.height - 1;
      index++
    ) {
      tmp.push(new Pieces(index, this.state.width));
    }
    return tmp;
  }

  componentDidMount() {
    this.setState({ piecesArray: this.initPiecesArray() }, this.shufflePuzzle);
  }

  shufflePuzzle = () => {
    this.moveSinglePiece(
      ((this.state.height * this.state.width - 1) / 2) >> 0,
      ((this.state.height * this.state.width - 1) / 2) >> 0
    );
    let pNum = this.state.width * this.state.height - 1,
      newPiecesArray = this.state.piecesArray,
      i = 0;
    while (pNum) {
      pNum--;
      i = Math.floor(Math.random() * pNum);
      [newPiecesArray[pNum].coordinate, newPiecesArray[i].coordinate] = [
        newPiecesArray[i].coordinate,
        newPiecesArray[pNum].coordinate,
      ];
    }

    this.setState({ piecesArray: newPiecesArray });
  };
  movePiece = (index) => {
    const cell = this.state.piecesArray,
      iPos = cell[index].coordinate,
      ePos = this.state.emptyCoordinate,
      indexDiff = ePos - iPos;

    //余数相等在同一列
    if (iPos % this.state.width === ePos % this.state.width) {
      if (Math.abs(indexDiff / this.state.width) === 1) {
        this.moveSinglePiece(iPos, index);
      }
    }
    //商向下取整说明在同一行
    if ((iPos / this.state.width) >> 0 === (ePos / this.state.width) >> 0) {
      if (Math.abs(indexDiff) === 1) {
        this.moveSinglePiece(iPos, index);
      }
    }
  };
  //第一个参数是空格的新位置，第二个参数是要移动的方块的原始编号
  moveSinglePiece = (newLocation, index) => {
    const newPiecesArray = this.state.piecesArray;
    newPiecesArray[index].coordinate = this.state.emptyCoordinate;
    // 避免state的异步性导致取值问题
    this.setState((state) => {
      return {
        piecesArray: newPiecesArray,
        emptyCoordinate: newLocation,
      };
    });
  };

  changeWidth=(event)=>{
    this.setState({width:event.target.value},this.restart)
  }
  
  changeHeight=(event)=>{
    this.setState({height:event.target.value},this.restart)
  }

  restart=()=>{
    this.setState({ emptyCoordinate:this.state.height*this.state.width -1,piecesArray: this.initPiecesArray() }, this.shufflePuzzle);
  }

  render() {
    return (
      <div className="puzzle">
        <PuzzleGrid
          piecesArrayProps={this.state.piecesArray}
          movePiece={this.movePiece}
          width={this.state.width}
          height={this.state.height}
        />
        <div className="choose">
       
        <label>选择width以全部重置</label>
          <select value={this.state.width} onChange={this.changeWidth}>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
          <label>选择height以全部重置</label>
          <select value={this.state.height} onChange={this.changeHeight}>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
        </div>
      </div>
    );
  }
}
export default App;
