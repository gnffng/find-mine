import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      level : 1,
      board_width:10,
      board_height:8,
      count_mine:10
    };
  }

  changeLevel = () => {
    let selectLevel = document.getElementById("selectLevel");
    let newLevel = selectLevel.options[selectLevel.selectedIndex].value*1;
    this.setState({level : newLevel});

    switch(newLevel){
      case 1:
        this.setState({board_width:10, board_height:8, count_mine:10});
        break;
      case 2:
        this.setState({board_width:18, board_height:14, count_mine:40});
        break;
      case 3:
        this.setState({board_width:24, board_height:20, count_mine:99});
        break;
      default:
        break;
    }
  }

  render(){
    return(
      <div id="Game">
        <Header level={this.state.level} count_mine={this.state.count_mine} changeLevel={this.changeLevel}/>
        <GameBoard width={this.state.board_width} height={this.state.board_height} count_mine={this.state.count_mine}/>
      </div>
      
    );
  }
}

class Header extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return <div id="header">
      <SelectLevel changeLevel={this.props.changeLevel}/>
      <img src="resource/images/flag_icon.png" />{this.props.count_mine}
      <img src="resource/images/clock_icon.png" />
    </div>
  }
}

class SelectLevel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      level : 1,
    };
  }

  render(){
    return <select id="selectLevel" onChange={this.props.changeLevel}>
      <option value="1">초급</option>
      <option value="2">중급</option>
      <option value="3">상급</option>
    </select>
  }
}

class GameBoard extends React.Component{
   constructor(props){
    super(props);

    let mines = this.getMines(props.count_mine, props.width, props.height);
    let _blocks = this.getBlocks(mines, props.count_mine, props.width, props.height);

    this.state = {
      blocks : _blocks
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.count_mine !== prevProps.count_mine) {
      let mines = this.getMines(this.props.count_mine, this.props.width, this.props.height);
      let _blocks = this.getBlocks(mines, this.props.count_mine, this.props.width, this.props.height);

      this.setState({
        blocks : _blocks
      });
    }
  }

  render(){
    return (
      <div id="gameBoard">
        {
          this.state.blocks.map(
            (row) => (
              <div>
                {
                  row.map(
                    (value) => (
                      <Block number={value} />
                    )
                  )
                }
              </div>
            )
          )
        }
      </div>
    )
  }

  getMines(count_mine, width, height){
    let mines = [];
    let count_block = width * height;
    while(count_mine>0){
      let randomNumber = Math.floor(Math.random()*(count_block));
      if(mines.indexOf(randomNumber) == -1){
        mines.push(randomNumber);
        count_mine--;
      }
    }

    return mines;
  }

  getBlocks(mines, count_mine, width, height){
    let blocks = [];

    for(let i=0; i<height; i++){
      let row = [];
      for(let j=0; j<width; j++){
        row.push(0);
      }
      blocks.push(row);
    }

    for(let i=0; i<mines.length; i++){
      blocks[Math.floor(mines[i]/width)][mines[i]%width] = -1;
    }

    for(let i=0; i<height; i++){
      for(let j=0; j<width; j++){
        blocks[i][j] = this.countAroundMine(blocks, height, width, i, j);
      }
    }

    return blocks;
  }

  countAroundMine(blocks, height, width, nowI, nowJ){
    if(blocks[nowI][nowJ]===-1){
      return -1;
    }

    let count = 0;
    for(let i=Math.max(0,nowI-1); i<Math.min(height,nowI+2); i++){
      for(let j=Math.max(0,nowJ-1); j<Math.min(width,nowJ+2); j++){
        if(blocks[i][j]===-1){
          count++;
        }
      }
    }

    return count;
  }
}

class Block extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isClick : false,
      isFlag : false,
    };
  }

  render(){
    return <button className="button default" onClick={() => this.pressBlock(this.state.isFlag, this.state.isClick, this.props.number)}>{this.props.number}</button>
  }

  pressBlock(isFlag, isClick, number){
    if(isFlag || isClick){
      return;
    }
    else if(number === -1){
      this.loseGame();
      return;
    }
    else{
      this.setState({isClick : true});
      console.log(number);
      return;
    }
  }

  loseGame(){
    console.log("게임에서 패배했습니다.");
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
