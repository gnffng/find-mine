import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isPlaying : true,
      isInit : true,
      level : 1,
      board_width:10,
      board_height:8,
      count_mine:10
    };
  }

  ChangeLevel = () => {
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

    this.Init();
  }

  Init = () => {
    this.setState({isPlaying : false});
    this.setState({isInit : false});
  }

  ReStart = () => {
    this.setState({isPlaying : true});
    this.setState({isInit : true});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.isPlaying !== nextState.isPlaying){
      return true;
    }
    
    if(this.state.level !== nextState.level){
      return true;
    }

    return false;
  }

  render(){
    return(
      <div id="Game">
        <Header level={this.state.level} count_mine={this.state.count_mine} changeLevel={this.ChangeLevel}/>
        <GameBoard init={this.Init} reStart={this.ReStart} isInit={this.state.isInit} isPlaying={this.state.isPlaying} width={this.state.board_width} height={this.state.board_height} count_mine={this.state.count_mine}/>
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
    if (this.props.count_mine !== prevProps.count_mine || !this.props.isPlaying) {
      let mines = this.getMines(this.props.count_mine, this.props.width, this.props.height);
      let _blocks = this.getBlocks(mines, this.props.count_mine, this.props.width, this.props.height);

      this.setState({
        blocks : _blocks
      });

      this.props.reStart();
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
                      <Block init={this.props.init} number={value} isInit={this.props.isInit}/>
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
      if(mines.indexOf(randomNumber) === -1){
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
      isInit : false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isInit) {
      this.setState({
        isClick : false,
        isFlag : false,
        isInit : false
      })
    }
  }

  render(){
    return <button value={this.props.number} className={"button "+this.WhatClass(this.state.isClick, this.state.isFlag, this.props.number)} onClick={() => this.pressBlock(this.state.isFlag, this.state.isClick, this.props.number)}>{this.props.number}</button>
  }

  WhatClass(isClick, isFlag, number){
    if(isFlag){
      return "flag";
    }
    else if(!isClick){
      return "default";
    }
    else if(number===0){
      return "zero";
    }
    else if(number===1){
      return "one";
    }
    else if(number===2){
      return "two";
    }
    else if(number===3){
      return "three";
    }
    else if(number===4){
      return "four";
    }
    else if(number===5){
      return "five";
    }
    else if(number===6){
      return "six";
    }
    else if(number===7){
      return "seven";
    }
    else if(number===8){
      return "eight";
    }
  }

  pressBlock(isFlag, isClick, number){
    if(isFlag || isClick){
      return;
    }
    else if(number === -1){
      alert("Lose Game");
      this.props.init();
      return;
    }
    else{
      this.setState({isClick : true});
      console.log(number);
      return;
    }
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
