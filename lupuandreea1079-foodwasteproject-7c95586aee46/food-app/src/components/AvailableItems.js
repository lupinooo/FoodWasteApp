import React, {Component} from 'react'
import {Link} from 'react-router-dom'
const SERVER="http://3.134.97.50:8080"

class AvailableItems extends Component{
    constructor(props){
        super(props)
        this.state={
            avItems:[]
        }
    }
    componentDidMount(){
           fetch(`${SERVER}/availableItems`)
            .then((response)=>response.json())
            .then((data)=>{
                console.log(data)
                this.setState({
                    avItems:data
                })
            })
       }
    render(){
        return(
            <div>
            <div className="div1">
        <div id="menu">
        <Link to="/itemList" style={{color:"#FFFFFF", textDecoration:"none", fontWeight:"bold"}}>My Food List</Link>
        </div>
        <br></br>
        <div id="menu">
        <Link to="/friends" style={{color:"#FFFFFF", textDecoration:"none", fontWeight:"bold"}}>My Friends List</Link>
        </div>
        </div>
        <div className="forms">
        <h4>Available Items</h4>
        <br></br>
        {
            this.state.avItems.map((e,i)=>
            <div key={i}>
            <input type="radio" id="av" value="av"/>
            <label htmlFor="av">{e.name} {e.quantity} {e.expDate}</label>
            </div>)
        }
        </div>
           </div> )
    }
    
}
export default AvailableItems