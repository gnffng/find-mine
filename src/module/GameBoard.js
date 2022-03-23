import React from 'react';

export default class GameBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return (
            <div id="gameBoard">
            {
                this.props.blocks.map(
                    (row, rowIndex) => (
                        <div className="row">
                        {
                            row.map(
                                (value, columnIndex) => (
                                    <button
                                        className = {"button " + value.getBtnState() + ((value.getBtnState()==="default" || value.getBtnState()==="zero") ? ((rowIndex+columnIndex)%2===0)?1:2 : "")} 
                                        onClick = {() => this.props.leftClick(rowIndex, columnIndex)}
                                        onContextMenu = {(e) => this.props.rightClick(rowIndex, columnIndex, e) }>
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