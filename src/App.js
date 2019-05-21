import React from 'react';
// import logo from './logo.svg';
import './App.css';

const pieces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
class PuzzlePiece extends React.Component {
  render() {
    const mark = this.props.mark;
    return (
      <div className="cell">
        {mark}
      </div>
    );
  }
}

class PuzzleGrid extends React.Component {
  render() {
    return (
      <div className="grid">
        {pieces.map((mark) =>
          <PuzzlePiece key={mark.toString()} mark={mark} />
          )}
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
  render() {
    return(
      <div className="puzzle">
        <h1>15 Puzzle</h1>
        <Toolbar />
        <PuzzleGrid />
      </div>
    )
  }
}
export default App;
