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

const pieces = [];

function initPuzzlePiece() {
  for (let index = 0; index < 15; index++) {
    pieces.push(new Pieces(index));
  }
}

class PuzzlePiece extends React.Component {
  render() {
    return (
      <div className="cell" style={this.props.value.getStyle()}>
        {this.props.value.original + 1}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
  render() {
    return (
      <div className="grid">
        {this.props.value[0]}
        {this.props.value.map((p) =>
          <PuzzlePiece key={p.original} value={p} />
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
  componentDidMount() {
    initPuzzlePiece();
  }
  render() {
    return(
      <div className="puzzle">
        <h1>15 Puzzle</h1>
        <Toolbar />
        <PuzzleGrid value={pieces}/>
      </div>
    )
  }
}
export default App;
