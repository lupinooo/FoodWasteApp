import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import history from './history'
const SERVER="http://3.134.97.50:8080"

class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message:''
        }
        
        this.handleChange=(evt)=>{
            this.setState({
                [evt.target.name]:evt.target.value
            })
        }
        
    }
    
    login(){
        const {username, password}=this.state
        const data={username, password}
        fetch(`${SERVER}/login`,{
             method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data)
                localStorage.setItem("id", data.id)
                history.push('/availableItemList')
                
            })
            .catch((error) => {
            console.error('Error:', error);
            })
        
    }
    
    render(){
        return (
    <div className="forms" id="login">
       <div> If you already have an account, please log in here </div>
       <div>
        <input type="text" placeholder="username" name="username" onChange={this.handleChange} />
       </div>
         <div>
        <input type="password" placeholder="password" name="password" onChange={this.handleChange} />
        </div>
        <div>
         <input type="button" value="Log In" onClick={this.login.bind(this)}/>
       </div>
       <div>
       <Link to="/register">If you dont have an account, sign here </Link>
       </div>
    </div>)
}
}
export default LoginForm