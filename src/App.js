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

class PuzzlePiece extends React.Component {
  render() {
    return (
      <div className="cell" style={this.props.item.getStyle()}>
        {this.props.item.original + 1}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
  render() {
    return (
      <div className="grid">
        {this.props.pieces.map((p) =>
          <PuzzlePiece key={p.original} item={p} />
        )};
      </div>
    )
  }
}

class NewGameBtn extends React.Component {
  render() {
    return (
      <div className="button">
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
      // step: 0,
    }
  }
  render() {
    return (
      <div className="bar">
        <NewGameBtn />
        <DisplayLabel content={this.state.step}>
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
    this.piecesArray = [];
    for (let index = 0; index < 15; index++) {
      this.piecesArray.push(new Pieces(index));
    }
  }
  render() {
    return(
      <div className="puzzle">
        <h1>15 Puzzle</h1>
        <Toolbar />
        <PuzzleGrid pieces={this.piecesArray}/>
      </div>
    )
  }
}
export default App;
