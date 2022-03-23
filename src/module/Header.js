import React from 'react';

export default class Header extends React.Component{
    constructor(props){
      super(props);
      this.state = {
      };
    }
  
    render(){
      return<div id="header">
        <SelectLevel changeLevel={this.props.changeLevel} />
        <span id="info" style={{"margin-left":(this.props.gameBoardWidth*40/2-135)+"px"}}>
          <img src="resource/images/flag_icon.png" className="icon"/>{this.props.leftFlagCount}
          <img src="resource/images/clock_icon.png" className="icon" style={{"margin-left" : 15+"px"}}/>{this.props.time}
        </span>
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