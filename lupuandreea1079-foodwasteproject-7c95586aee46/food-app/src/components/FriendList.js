import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Friend from './Friend.js'
const SERVER="http://3.134.97.50:8080"

class FriendList extends Component{
        constructor() {
        super();
        this.state = {
            friends: [],
            allCategories: [],
            newFriendUsername: '',
            newFriendCategory: 'MeatLovers',
            searchMessage: '',
            message: ''
        }
    }
    componentDidMount() {
        const id = localStorage.getItem('id');
        if (!id) {
            this.setState({ message: 'You are not logged in' });
        } else {
          fetch(`${SERVER}/users/${id}/friends`)
             .then((response)=>response.json())
            .then((data)=>{
                 this.setState({
                     friends:data
                 })
                 console.log(data)
             })
             
             fetch(`${SERVER}/friends/categories`)
             .then((response)=>response.json())
             .then((data)=>{
                 this.setState({
                     allCategories:data
                 })
             })
        }
    }

    handleSearchBarChange(event) {
        this.setState({ newFriendUsername: event.target.value });
    }


    handleAdd() {
        const userId=localStorage.getItem("id");
        let username=this.state.newFriendUsername
        let category=this.state.newFriendCategory
        console.log(username, category)
        fetch(`${SERVER}/users/${userId}/friends`,{
             method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({username:username, category:category})
                
            })
            .then((response) => response.json())
            .then((response) => {
                //console.log('Success:', friend)
                this.state.friends.push({username:this.state.newFriendUsername, category:this.state.newFriendCategory})
                this.setState({
                    friends:this.state.friends
                })
                
            })
            .catch((error) => {
            console.error('Error:', error);
            })
    }

    handleNewFriendCategoryChange(event) {
        this.setState({ newFriendCategory: event.target.value })
    }
    

    render() {
        if (localStorage.getItem('id')) {
            return (
                <div className='parent2'>
        <div className="div1" >
        <div id="menu">
        <Link to="/itemList" style={{color:"#FFFFFF", textDecoration:"none", fontWeight:"bold"}}>My Food List</Link>
        </div>
        <br></br>
        <div id="menu">
        <Link to="/friends" style={{color:"#FFFFFF", textDecoration:"none", fontWeight:"bold"}}>My Friends List</Link>
        </div>
                    <div className="div3">
                        {this.state.friends.length ? <h4>Your friends:</h4> : <h4>You have no friends :-(</h4>}
                        {this.state.friends.map((friend, index) => 
                        <Friend key={index.toString()} friend={friend}
                            allCategories={this.state.allCategories}
                            onSelectionChange={(event, friend) => this.handleSelectionChange(event, friend)}
                        />)}
                        <h4>Find more friends!</h4>
                        <div>
                            <input type="text" value={this.state.newFriendUsername} onChange={(event) => this.handleSearchBarChange(event)} placeholder="username..." />
                        </div>
                        <div>
                            <label>Category:</label>
                            <select value={this.state.newFriendCategory} onChange={(event) => this.handleNewFriendCategoryChange(event)}>
                                {this.state.allCategories.map((categ, index) => <option key={index.toString()} value={categ}>{categ}</option>)}
                            </select>
                        </div>
                           <button className="myButton"  onClick={this.handleAdd.bind(this)}>Add</button>
                        <p>{this.state.searchMessage}</p>
                    </div>
                </div>
                </div>
            )
        } else {
            return <p>You are not logged in</p>
        }
    }
}

export default FriendList