import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component{

  BlockStateEnum = { NONECLICKED : "default", FLAG : "flag",
                     EMPTY : "empty", ONE : "one", TWO : "two", THREE : "three", FOUR : "four", FIVE : "five", SIX : "six", SEVEN : "seven", EIGHT : "eight" };

  CountMineEnum = { LV1 : 10, LV2 : 40, LV3 : 99 };
  GameBoardWidthEnum = { LV1 : 10, LV2 : 18, LV3 : 24 };
  GameBoardHeightEnum = { LV1 : 8, LV2 : 14, LV3 : 20 };

  constructor(props){
    super(props);
    this.state = {
      level : 1,
      leftFlagCount : this.CountMineEnum.LV1,
      leftBlockCount : this.GameBoardWidthEnum.LV1 * this.GameBoardHeightEnum.LV1 - this.CountMineEnum.LV1,
      blocks : this.getBlocks(1)
    };

    this.changeLevel = this.changeLevel.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClick = this.rightClick.bind(this);
    this.lose = this.lose.bind(this);
  }

  render(){
    return(
      <div id="Game">
        <Header
          leftFlagCount = {this.state.leftFlagCount} 
          level = {this.state.level}
          changeLevel = {this.changeLevel}/>
        <GameBoard
          blocks = {this.state.blocks}
          leftClick = {this.leftClick}
          rightClick = {this.rightClick}/>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.level != this.state.level || this.state.leftBlockCount===0 && prevState.leftBlockCount!==0){
      switch(this.state.level){
        case 1:
          this.setState({ 
            leftFlagCount : this.CountMineEnum.LV1,
            leftBlockCount : this.GameBoardWidthEnum.LV1 * this.GameBoardHeightEnum.LV1 - this.CountMineEnum.LV1
           });
          break;
        case 2:
          this.setState({ 
            leftFlagCount : this.CountMineEnum.LV2,
            leftBlockCount : this.GameBoardWidthEnum.LV2 * this.GameBoardHeightEnum.LV2 - this.CountMineEnum.LV2
           });
          break;
        case 3:
          this.setState({ 
            leftFlagCount : this.CountMineEnum.LV3,
            leftBlockCount : this.GameBoardWidthEnum.LV3 * this.GameBoardHeightEnum.LV3 - this.CountMineEnum.LV3
           });
          break;
      }
      
      this.setState({ blocks : this.getBlocks(this.state.level) });
    }
  }

  changeLevel(){
    let selectLevel = document.getElementById("selectLevel");
    let newLevel = selectLevel.options[selectLevel.selectedIndex].value * 1;
    this.setState({
      level : newLevel,
      isRestart : true
    });
  }

  getBlocks(level){
    let count_mine = 0;
    let width = 0;
    let height = 0;

    switch(level){
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

    let mines = this.getMines(count_mine, width, height);
    let blocks = [];

    for(let i=0; i<height; i++){
      let row = [];
      for(let j=0; j<width; j++){
        row.push(new Block(0, this.BlockStateEnum.NONECLICKED));
      }
      blocks.push(row);
    }

    for(let i=0; i<mines.length; i++){
      var row = Math.floor(mines[i]/width);
      var column = mines[i]%width;
      blocks[row][column].setNumber(-1);
    }

    for(let i=0; i<height; i++){
      for(let j=0; j<width; j++){
        blocks[i][j].setNumber(this.countAroundMine(blocks, height, width, i, j));
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
    if(blocks[nowI][nowJ].getNumber()===-1){
      return -1;
    }
  
    let count = 0;
    for(let i=Math.max(0,nowI-1); i<Math.min(height,nowI+2); i++){
      for(let j=Math.max(0,nowJ-1); j<Math.min(width,nowJ+2); j++){
        if(blocks[i][j].getNumber()===-1){
          count++;
        }
      }
    }
  
    return count;
  }

  leftClick(rowIndex, columnIndex){
    var block = this.state.blocks[rowIndex][columnIndex];
    switch(block.getNumber()){
      case 0:
        block.setBtnState(this.getBlockStateByNumber(block.getNumber()));
        this.setState({ blocks : this.state.blocks });
        break;
      case -1:
        this.lose();
        break;
      default:
        block.setBtnState(this.getBlockStateByNumber(block.getNumber()));
        this.setState({ blocks : this.state.blocks });
        break;
    }
  }

  rightClick(rowIndex, columnIndex){

  }

  getBlockStateByNumber(number){
    switch(number){
      case 0:
        return this.BlockStateEnum.EMPTY;
        break;
      case 1:
        return this.BlockStateEnum.ONE;
        break;
      case 2:
        return this.BlockStateEnum.TWO;
        break;
      case 3:
        return this.BlockStateEnum.THREE;
        break;
      case 4:
        return this.BlockStateEnum.FOUR;
        break;
      case 5:
        return this.BlockStateEnum.FIVE;
        break;
      case 6:
        return this.BlockStateEnum.SIX;
        break;
      case 7:
        return this.BlockStateEnum.SEVEN;
        break;
      case 8:
        return this.BlockStateEnum.EIGHT;
        break;
      
    }
  }

  lose(){
    alert("패배했습니다.");
    switch(this.state.level){
      case 1:
        this.setState({ 
          leftFlagCount : this.CountMineEnum.LV1,
          leftBlockCount : this.GameBoardWidthEnum.LV1 * this.GameBoardHeightEnum.LV1 - this.CountMineEnum.LV1
         });
        break;
      case 2:
        this.setState({ 
          leftFlagCount : this.CountMineEnum.LV2,
          leftBlockCount : this.GameBoardWidthEnum.LV2 * this.GameBoardHeightEnum.LV2 - this.CountMineEnum.LV2
         });
        break;
      case 3:
        this.setState({ 
          leftFlagCount : this.CountMineEnum.LV3,
          leftBlockCount : this.GameBoardWidthEnum.LV3 * this.GameBoardHeightEnum.LV3 - this.CountMineEnum.LV3
         });
        break;
    }
    
    this.setState({ blocks : this.getBlocks(this.state.level) });
  }

}

class Block{
  constructor(number, btnState){
    this.number = number;
    this.btnState = btnState;

    this.getBtnState = this.getBtnState.bind(this);
    this.setBtnState = this.setBtnState.bind(this);

    this.getNumber = this.getNumber.bind(this);
    this.setNumber = this.setNumber.bind(this);
  }

  getBtnState(){ return this.btnState; }
  setBtnState(newBtnState){ this.btnState = newBtnState; }

  getNumber(){ return this.number; }
  setNumber(newNumber){ this.number = newNumber; }
}

class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return <div id="header">
      <SelectLevel changeLevel={this.props.changeLevel} />
        <img src="resource/images/flag_icon.png" />{this.props.leftFlagCount}
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
    this.state = {
    };
  }

  render(){
    return (
      <div id="gameBoard">
        {
          this.props.blocks.map(
            (row, rowIndex) => (
              <div>
                {
                  row.map(
                    (value, columnIndex) => (
                      <button
                          className = {"button " + value.getBtnState()} 
                          onClick = {() => this.props.leftClick(rowIndex, columnIndex)}
                          onContextMenu = {() => this.props.rightClick(rowIndex, columnIndex) }>
                        {value.getNumber()+":"+rowIndex+","+columnIndex}
                      </button>
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

  componentDidUpdate(){
    if(this.props.isRestart){
      this.props.Restart();
    }
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
