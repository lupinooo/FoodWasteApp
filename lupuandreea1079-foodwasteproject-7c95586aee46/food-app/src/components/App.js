import React, {Component}  from 'react'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import AvailableItems from './AvailableItems'
import UserItemsList from './UserItemsList'
import FriendList from './FriendList'
import Fridge from './Fridge'
import './style.css'
import history from './history.js'
import{
 Switch,
 Route,
 Router
} from 'react-router-dom'


class App extends Component{
 
 render(){
 return <div className='parent'>
 <div className="div2">
     <div> <h1> NMFW </h1> </div>
     <div> <h3>-No More Food Waste-</h3></div>
 </div>
     <Router history={history}>
     <Switch>
     <Route path="/" exact>
     <LoginForm />
     </Route>
     <Route path="/login">
     <LoginForm/>
     </Route>
     <Route path="/register">
     <RegisterForm />
     </Route>
     <Route path="/itemList">
     <UserItemsList/>
     </Route>
      <Route path="/availableItemList">
     <AvailableItems/>
     </Route>
     <Route path="/friends">
     <FriendList/>
     </Route>
     <Route path="/items/:username" component={Fridge}>
     </Route>
     </Switch>
     </Router>
   </div>
  }
}


export default App;
