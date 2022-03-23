import React from 'react';

import Header from './Header.js';
import GameBoard from './GameBoard.js';

export default class Game extends React.Component{

    BlockStateEnum = { NONECLICKED : "default", FLAG : "flag",
                       ZERO : "zero", ONE : "one", TWO : "two", THREE : "three", FOUR : "four", FIVE : "five", SIX : "six", SEVEN : "seven", EIGHT : "eight" };
  
    CountMineEnum = { LV1 : 10, LV2 : 40, LV3 : 99 };
    GameBoardWidthEnum = { LV1 : 10, LV2 : 18, LV3 : 24 };
    GameBoardHeightEnum = { LV1 : 8, LV2 : 14, LV3 : 20 };
  
    constructor(props){
      super(props);
  
      let timer = setInterval(()=>{ this.setState({ time : this.state.time+1 }) }, 1000);
  
      this.state = {
        level : 1,
        gameBoardWidth : this.GameBoardWidthEnum.LV1,
        gameBoardheight : this.GameBoardHeightEnum.LV1,
        leftFlagCount : this.CountMineEnum.LV1,
        leftBlockCount : this.GameBoardWidthEnum.LV1 * this.GameBoardHeightEnum.LV1 - this.CountMineEnum.LV1,
        blocks : this.getBlocks(1),
        isKeyPress : false,
        time : 0,
        timer : timer
      };
  
      this.changeLevel = this.changeLevel.bind(this);
      this.leftClick = this.leftClick.bind(this);
      this.rightClick = this.rightClick.bind(this);
      this.lose = this.lose.bind(this);
    }
  
    render(){
      return(
        <div id="game" onKeyDown={(e)=>this.keyDown(e)} onKeyUp={(e)=>this.keyUp(e)} tabIndex="0" style={{width:(this.state.gameBoardWidth*40)+"px"}}>
          <Header
            leftFlagCount = {this.state.leftFlagCount} 
            level = {this.state.level}
            time = {this.state.time}
            gameBoardWidth = {this.state.gameBoardWidth}
            changeLevel = {this.changeLevel}/>
          <GameBoard
            blocks = {this.state.blocks}
            leftClick = {this.leftClick}
            rightClick = {this.rightClick}/>
        </div>
      );
    }
  
    componentDidUpdate(prevProps, prevState){
      if(prevState.level != this.state.level || (this.state.leftBlockCount===0 && prevState.leftBlockCount!==0)){
        switch(this.state.level){
          case 1:
            this.setState({ 
              gameBoardWidth : this.GameBoardWidthEnum.LV1,
              gameBoardheight : this.GameBoardHeightEnum.LV1,
              leftFlagCount : this.CountMineEnum.LV1,
              leftBlockCount : this.GameBoardWidthEnum.LV1 * this.GameBoardHeightEnum.LV1 - this.CountMineEnum.LV1,
             });
            break;
          case 2:
            this.setState({ 
              gameBoardWidth : this.GameBoardWidthEnum.LV2,
              gameBoardheight : this.GameBoardHeightEnum.LV2,
              leftFlagCount : this.CountMineEnum.LV2,
              leftBlockCount : this.GameBoardWidthEnum.LV2 * this.GameBoardHeightEnum.LV2 - this.CountMineEnum.LV2
             });
            break;
          case 3:
            this.setState({ 
              gameBoardWidth : this.GameBoardWidthEnum.LV3,
              gameBoardheight : this.GameBoardHeightEnum.LV3,
              leftFlagCount : this.CountMineEnum.LV3,
              leftBlockCount : this.GameBoardWidthEnum.LV3 * this.GameBoardHeightEnum.LV3 - this.CountMineEnum.LV3
             });
            break;
        }
  
        clearInterval(this.state.timer);
        this.setState({ time : 0 });
        let timer = setInterval(()=>{ this.setState({ time : this.state.time+1 }) }, 1000);
        this.setState({ 
          timer : timer,
          blocks : this.getBlocks(this.state.level) 
        });
      }
  
      if(this.state.leftBlockCount===0){
        this.win();
      }
    }
  
    changeLevel(){
      let selectLevel = document.getElementById("selectLevel");
      let newLevel = selectLevel.options[selectLevel.selectedIndex].value * 1;
      this.setState({
        level : newLevel
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
  
    isPossibleZeroClick(blocks, rowIndex, columnIndex, width, height){
      let count = 0;
      for(let i=Math.max(0,rowIndex-1); i<Math.min(height,rowIndex+2); i++){
        for(let j=Math.max(0,columnIndex-1); j<Math.min(width,columnIndex+2); j++){
          if(blocks[i][j].getBtnState() === this.BlockStateEnum.NONECLICKED){
            count++;
          }
        }
      }
    
      return count>0;
    }
  
    leftClick(rowIndex, columnIndex){
      if(this.state.isKeyPress){
        var count = 0;
        for(let i=Math.max(0,rowIndex-1); i<Math.min(this.state.gameBoardheight,rowIndex+2); i++){
          for(let j=Math.max(0,columnIndex-1); j<Math.min(this.state.gameBoardWidth,columnIndex+2); j++){
            var pressResult = this.pressButton(i, j);
            if(pressResult===-1){
              return;
            }
            else if(pressResult===1){
              count++;
            }
          }
        }
  
        this.setState({
          blocks : this.state.blocks
        });
      }
      else{
        this.pressButton(rowIndex, columnIndex);
      }
  
      for(var i=0; i<this.state.blocks.length; i++){
        for(var j=0; j<this.state.blocks[i].length; j++){
          if(this.state.blocks[i][j].getBtnState()===this.BlockStateEnum.NONECLICKED && this.state.blocks[i][j].getNumber()!==-1){
            return;
          }
        }
      }
      this.win();
    }
  
    pressButton(rowIndex, columnIndex){
      var block = this.state.blocks[rowIndex][columnIndex];
      if(block.getBtnState()===this.BlockStateEnum.NONECLICKED){
        switch(block.getNumber()){
          case -1:
            this.lose();
            return -1;
          case 0:
            if(this.isPossibleZeroClick(this.state.blocks, rowIndex, columnIndex, this.state.gameBoardWidth, this.state.gameBoardheight)){
              this.zeroClick(rowIndex, columnIndex);
            }
            return 1;
          default:
            block.setBtnState(this.getBlockStateByNumber(block.getNumber()));
            this.setState({
              blocks : this.state.blocks
            });
            return 1;
        }
      }
      return 0;
    }
  
    zeroClick(rowIndex, columnIndex){
      var deleteBlockCount = 0;
      for(let i=Math.max(0,rowIndex-1); i<Math.min(this.state.gameBoardheight,rowIndex+2); i++){
        for(let j=Math.max(0,columnIndex-1); j<Math.min(this.state.gameBoardWidth,columnIndex+2); j++){
          var block = this.state.blocks[i][j];
          if(block.getBtnState() === this.BlockStateEnum.NONECLICKED){
            block.setBtnState(this.getBlockStateByNumber(block.getNumber()));
            deleteBlockCount++;
          }
        }
      }
  
      for(let i=Math.max(0,rowIndex-1); i<Math.min(this.state.gameBoardheight,rowIndex+2); i++){
        for(let j=Math.max(0,columnIndex-1); j<Math.min(this.state.gameBoardWidth,columnIndex+2); j++){
          block = this.state.blocks[i][j];
          if(block.getNumber()===0 && this.isPossibleZeroClick(this.state.blocks, i, j, this.state.gameBoardWidth, this.state.gameBoardheight)){
            deleteBlockCount += this.zeroClick(i, j);
          }
        }
      }
  
      this.setState({
        blocks : this.state.blocks
      })
  
      return deleteBlockCount;
  
    }
  
    rightClick(rowIndex, columnIndex, e){
      e.preventDefault();
  
      var block = this.state.blocks[rowIndex][columnIndex];
      if(block.getBtnState()===this.BlockStateEnum.FLAG){
        block.setBtnState(this.BlockStateEnum.NONECLICKED);
        this.setState({ leftFlagCount : this.state.leftFlagCount+1 });
      }
      else if(block.getBtnState() === this.BlockStateEnum.NONECLICKED){
        block.setBtnState(this.BlockStateEnum.FLAG);
        this.setState({ leftFlagCount : this.state.leftFlagCount-1});
      }
    }
  
    keyDown(e){
      var key = e.key;
      console.log("Key Down : " + key);
      if(key === "A" || key === "a"){
        this.setState({ isKeyPress : true });
      }
    }
  
    keyUp(e){
      console.log("Key Up");
      this.setState({ isKeyPress : false });
    }
  
    getBlockStateByNumber(number){
      switch(number){
        case 0:
          return this.BlockStateEnum.ZERO;
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
  
    win(){
      clearInterval(this.state.timer);
      alert("승리했습니다.\n걸린시간 : "+this.state.time+"초");
  
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
  
      let timer = setInterval(()=>{ this.setState({ time : this.state.time+1 }) }, 1000);
      this.setState({
        time : 0,
        timer : timer,
        blocks : this.getBlocks(this.state.level)
      });
    }
  
    lose(){
      clearInterval(this.state.timer);
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
      
      let timer = setInterval(()=>{ this.setState({ time : this.state.time+1 }) }, 1000);
      this.setState({
        time : 0,
        timer : timer,
        blocks : this.getBlocks(this.state.level)
      });
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