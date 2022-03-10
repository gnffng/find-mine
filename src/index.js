import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component{

  CountMineEnum = { LV1 : 10, LV2 : 40, LV3 : 99 };
  GameBoardWidthEnum = { LV1 : 10, LV2 : 18, LV3 : 24 };
  GameBoardHeightEnum = { LV1 : 8, LV2 : 14, LV3 : 20 };

  constructor(props){
    super(props);
    this.state = {
      level : 1
    };
  }

  render(){
    let count_mine = 0;
    let width = 0;
    let height = 0;

    switch(this.state.level){
      case 1 :
        count_mine = this.CountMineEnum.LV1;
        width = this.GameBoardWidthEnum.LV1;
        height = this.GameBoardHeightEnum.LV1;
        break;
      case 2 :
        count_mine = this.CountMineEnum.LV2;
        width = this.GameBoardWidthEnum.LV2;
        height = this.GameBoardHeightEnum.LV2;
        break;
      case 3 :
        count_mine = this.CountMineEnum.LV3;
        width = this.GameBoardWidthEnum.LV3;
        height = this.GameBoardHeightEnum.LV3;
        break;
    }

    const blocks = this.getBlocks(count_mine, width, height);
    return(
      <div id="Game">
        <Header level={this.state.level} ChangeLevel={this.ChangeLevel} />
        <GameBoard blocks={blocks} Lose={this.Lose} />
      </div>
    );
  }

  ChangeLevel(){
    let selectLevel = document.getElementById("selectLevel");
    let newLevel = selectLevel.options[selectLevel.selectedIndex].value * 1;
    this.setState({level : newLevel});
  }

  Lose(){
    alert("패배했습니다.");
    this.render();
  }

  getBlocks(count_mine, width, height){
    let mines = this.getMines(count_mine, width, height);
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

class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      left_flag : 10
    };
  }

  render(){
    return <div id="header">
      <SelectLevel ChangeLevel={this.props.ChangeLevel} />
        <img src="resource/images/flag_icon.png" />{this.state.left_flag}
        <img src="resource/images/clock_icon.png" />
    </div>
  }
}

class SelectLevel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return <select id="selectLevel" onChange={this.props.ChangeLevel}>
      <option value="1">초급</option>
      <option value="2">중급</option>
      <option value="3">상급</option>
    </select>
  }
}

class GameBoard extends React.Component{
   constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div id="gameBoard">
        {
          this.props.blocks.map(
            (row) => (
              <div>
                {
                  row.map(
                    (value) => (
                      <Block number={value} Lose={this.props.Lose}/>
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
}

class Block extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isClick : false,
      isFlag : false
    };
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
      this.props.Lose();
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
