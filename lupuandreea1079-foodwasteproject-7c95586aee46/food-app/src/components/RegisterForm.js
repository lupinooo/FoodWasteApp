import React, {Component} from 'react'
import {Link} from 'react-router-dom'
const SERVER="http://3.134.97.50:8080"

class RegisterForm extends Component{
    constructor(){
        super()
        this.state={
            username:"",
            email:"",
            password:"",
            confirmPass:"",
            message:""
        }
        this.handleChange=(evt)=>{
            this.setState({
                [evt.target.name]:evt.target.value
            })
        }
    }
    
    register(){
        const {username, email, password, confirmPass}=this.state
        if(!username.length||!email.length||!password.length){
            this.setState({message:"Please complete all fields"})
        }
        else if(password!==confirmPass){
            this.setState({message:"Passwords don't match! Try again."})
        }
        else{
            const data={username, email, password}
            fetch(`${SERVER}/register`, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                alert('User created!')
            })
            .catch((error) => {
            console.error('Error:', error);
            });
        }
    }
    
    render(){
        return (
            <div className="forms">
            <div> Register below. </div>
            <div>
            <input type="text" placeholder="username" name="username" onChange={this.handleChange}/>
            </div>
            <div>
            <input type="text" placeholder="email" name="email" onChange={this.handleChange}/>
            </div>
            <div>
            <input type="password" placeholder="password" name="password" onChange={this.handleChange}/>
            </div>
            <div>
            <input type="password" placeholder="retype password" name="confirmPass" onChange={this.handleChange}/>
            </div>
            <div>
            <input type="button" value="Register" onClick={this.register.bind(this)}/>
            </div>
            <div>
            <Link to="/login">If you already have an account, log in here</Link>
            </div>
            </div>
            )
    }
}
export default RegisterForm