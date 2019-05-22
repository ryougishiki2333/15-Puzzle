import React from 'react';
import ReactDOM from 'react-dom';
import './index.styl';

class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    // this.props.mark: (mine | unknown | flag | wrongflag | 1-8 | undefined)
    // this.props.opened: (true | false)

    getClassName() {
        return `block-${this.props.opened ? 'opened' : 'unopened'}` + (this.props.mark !== undefined ? ` block-mark-${this.props.mark}` : '');
    }

    onContextMenu(e) {
        e.preventDefault();
        this.props.onContextMenu();
    }

    shouldComponentUpdate(next) {
        return next.opened !== this.props.opened || next.mark !== this.props.mark;
    }

    render() {
        console.debug('ok');
        return <div className={this.getClassName()} onClick={this.props.onClick} onContextMenu={(e) => this.onContextMenu(e)}></div>;
    }
}

class Minesweeper extends React.Component {
    constructor() {
        super();
        this.state = {
            diffculty: 3,
            rows: 16,
            columns: 30,
            mines: 99
        }
        this.initBlock(this.state.rows, this.state.columns);
    }

    componentDidMount() {
        this.initState();
    }

    newGame() {
        if ((this.state.gameStarted && !this.state.gameOver) ? confirm('Start New Game?') : this.state.gameStarted) {
            this.stopTimer();
            this.initBlock(this.state.rows, this.state.columns);
            this.initState();
        }
    }

    setDiffculty(id) {
        if ((this.state.gameStarted && !this.state.gameOver) ? confirm('Start New Game?') : true) {
            const list = {
                1: { diffculty: 1, rows: 8, columns: 8, mines: 10 },
                2: { diffculty: 2, rows: 16, columns: 16, mines: 40 },
                3: { diffculty: 3, rows: 16, columns: 30, mines: 99 }
            }
            this.stopTimer();
            this.initBlock(list[id].rows, list[id].columns);
            this.setState(list[id], () => this.initState());
        }
    }

    initBlock(rows, columns, mines) {
        this.blocks = [];
        for (let i = 0; i < rows; i++) {
            this.blocks.push([]);
            for (let j = 0; j < columns; j++) {
                this.blocks[i].push({
                    opened: false,
                    isMine: false,
                    mark: undefined
                });
            }
        }
    }

    initState() {
        this.setState({
            minesLeft: this.state.mines,
            timeSpent: 0,
            startTime: null,
            gameStarted: false,
            gameOver: false
        });
    }

    generateMine(row, column) {
        this.mineList = [];
        this.blockOpened = 0;
        let list = [];
        for (let i = 0; i < this.state.columns * this.state.rows; i++) { list[i] = i; }
        list.splice(row * this.state.columns + column, 1);
        for (let i = 0; i < this.state.mines; i++) { this.mineList.push(list.splice(Math.floor(Math.random() * list.length), 1)[0]); }
        for (let i = 0; i < this.mineList.length; i++) {
            let row = Math.floor(this.mineList[i] / this.state.columns);
            let col = this.mineList[i] % this.state.columns;
            this.mineList[i] = this.blocks[row][col];
            this.mineList[i].isMine = true;
        }
    }

    onClickBlock(i, j) {
        if (!this.state.gameOver) {
            if (!this.state.gameStarted) {
                this.generateMine(i, j);
                this.setState({
                    gameStarted: true,
                    startTime: (new Date()).valueOf()
                }, () => this.startTimer());
            }
            this.openBlock(i, j);
            this.forceUpdate();
        }
    }

    openBlock(i, j) {
        const block = this.blocks[i][j];
        const around = [
            [i - 1, j - 1],
            [i, j - 1],
            [i + 1, j - 1],
            [i - 1, j],
            [i + 1, j],
            [i - 1, j + 1],
            [i, j + 1],
            [i + 1, j + 1],
        ];
        block.opened = true;
        this.blockOpened++;
        if (!block.isMine) {
            let count = 0;
            around.forEach((v) => {
                if (((this.blocks[v[0]] || {})[v[1]] || {}).isMine) count++;
            });
            if (count === 0) {
                around.forEach((v) => {
                    const block = (this.blocks[v[0]] || {})[v[1]] || {};
                    if (block.opened === false && block.mark !== 'flag') this.openBlock(v[0], v[1]);
                });
            } else {
                block.mark = count;
            }
            if (this.blockOpened === this.state.rows * this.state.columns - this.state.mines) {
                this.gameOver(`You Win! Cost ${((new Date()).valueOf() - this.state.startTime) / 1000}s.`);
            }
        } else {
            this.mineList.forEach((block) => {
                if (block.mark !== 'flag') block.mark = 'mine';
            })
            this.blocks.forEach((row) => {
                row.forEach((block) => {
                    if (block.mark === 'flag' && !block.isMine) block.mark = 'wrongflag';
                });
            });
            this.gameOver('Oops! Game Over!');
        }
    }

    gameOver(message) {
        this.stopTimer();
        this.setState({
            gameOver: true
        });
        setTimeout(() => alert(message), 500);
    }

    startTimer() {
        this.timer = setInterval(() => {
            const time = Math.round(((new Date()).valueOf() - this.state.startTime) / 1000);
            this.setState({
                timeSpent: (time < 1000 ? time : 999)
            });
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    onRightClickBlock(i, j) {
        const block = this.blocks[i][j];
        if (!block.opened && !this.state.gameOver) {
            switch (block.mark) {
                case undefined:
                    block.mark = 'flag';
                    this.setState((prev) => ({
                        minesLeft: prev.minesLeft - 1
                    }));
                    break;
                case 'flag':
                    block.mark = 'unknown';
                    this.setState((prev) => ({
                        minesLeft: prev.minesLeft + 1
                    }));
                    break;
                case 'unknown':
                    block.mark = undefined;
                    this.forceUpdate();
                    break;
            }
        }
    }

    render() {
        return (
            <div id="main">
                <div id="title">Minesweeper</div>
                <div id="bar">
                    <div className="label">
                        <div className="label-button" onClick={() => this.newGame()}>New Game</div>
                    </div>
                    <div className="label">
                        <div className={'label-option' + (this.state.diffculty === 1 ? '-selected' : '')} onClick={() => this.setDiffculty(1)}>Beginner</div>
                        <div className={'label-option' + (this.state.diffculty === 2 ? '-selected' : '')} onClick={() => this.setDiffculty(2)}>Intermediate</div>
                        <div className={'label-option' + (this.state.diffculty === 3 ? '-selected' : '')} onClick={() => this.setDiffculty(3)}>Expert</div>
                    </div>
                    <div className="label" style={{ width: '120px' }}>
                        <div className="label-icon">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <div className="label-content">{this.state.minesLeft}</div>
                    </div>
                    <div className="label" style={{ width: '120px' }}>
                        <div className="label-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="label-content">{this.state.timeSpent}</div>
                    </div>
                </div>
                <div id="grid" style={{ width: this.state.columns * 30 + 'px', height: this.state.rows * 30 + 'px' }}>
                    {(() => {
                        let rows = [];
                        for (let i = 0; i < this.state.rows; i++) {
                            rows.push(<div className="row" key={i}>
                                {(() => {
                                    let blocks = [];
                                    for (let j = 0; j < this.state.columns; j++) {
                                        blocks.push(<Block key={j} opened={this.blocks[i][j].opened} mark={this.blocks[i][j].mark} onClick={() => this.onClickBlock(i, j)} onContextMenu={() => this.onRightClickBlock(i, j)} />);
                                    }
                                    return blocks;
                                })()}
                            </div>);
                        }
                        return rows;
                    })()}
                </div>
            </div>
        );
    }
}

window.onload = () => ReactDOM.render(<Minesweeper />, document.getElementById('root'));