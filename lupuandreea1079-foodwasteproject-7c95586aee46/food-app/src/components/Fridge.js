import React,{Component} from 'react';
import { Link } from 'react-router-dom';
const SERVER="http://3.134.97.50:8080"

class Fridge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userFriend: this.props.match.params.username,
            items: [],
            categories: [],
            message: '',
        }
    }

    componentDidMount() {
        console.log(this.state.userFriend)
        fetch(`${SERVER}/users/${this.state.userFriend}/availableItems`)
            .then(response => response.json())
            .then(items => {
                console.log(items);
                this.setState({
                    items: items.map(elem => {
                        return { ...elem}
                    }),
                    categories: Array.from(new Set(items.map(item => item.category)))
                });
            }).catch(error => this.setState({ message: 'Error' }))
    }

    handleQuantityChange(event, item) {
        const index = this.state.items.findIndex(elem => elem.id === item.id);
        this.state.items[index].quantity = event.target.value;
        this.setState({ items: this.state.items });
    }

    // handleClaim(item) {
    //     const index = this.state.items.findIndex(elem => elem.id === item.id);
    //     const qToClaim = Number(item.quantityToClaim);
    //     if (isNaN(qToClaim) || qToClaim <= 0 || qToClaim > item.quantity) {
    //         this.state.items[index].message = 'Bad quantity value.';
    //         this.setState({ items: this.state.items })
    //     } else {
    //         // name, expDate, category, quantity, userId
    //         axios.put(`${host}/friends/items`, {
    //             id: item.id,
    //             name: item.name,
    //             expDate: item.expDate,
    //             category: item.category,
    //             quantity: qToClaim,
    //             userId: Number(localStorage.getItem('id'))
    //         }).then((response) => {
    //             if (response.error) {
    //                 throw response.error;
    //             }
    //             return response.data;
    //         }).then(() => {
    //             console.log(qToClaim, item.quantity);
    //             this.state.items[index].quantity -= qToClaim;
    //             if (item.quantity === 0) {
    //                 this.state.items.splice(index, 1);
    //             }
    //             this.setState({ items: this.state.items })
    //         }).catch(error => this.setState({ message: error.response.data.message }))
    //     }
    // }
    
    
    
    handleClaim(item){
        //mai intai se adauga acel item userului curent 
        let id=localStorage.getItem('id')
        let itemId=item.id
        let name=item.name
        let expDate=item.expDate
        let category=item.category
        let available=item.available
        let quantity=item.quantity
        console.log(name, expDate, category, available, quantity)
        fetch(`${SERVER}/users/${id}/items`, {
             method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name:name, expDate:expDate,category:category,available:available,quantity:quantity})
            })
            .then((response) => response.json())
            .then((response) => {
                console.log('Success:', response)
            })
            .catch((error) => {
            console.error('Error:', error);
            })
            
        //pasul 2: se updateaza userului prieten item-ul respectiv; fetch in fetch deoarece trimit ca parametru usernameul si trebuie sa preiau idul ca sa il folosesc in cererea de update
        fetch(`${SERVER}/users/${this.state.userFriend}`)
          .then((response)=>response.json())
          .then((response)=>{
              let friendId=response
              fetch(`${SERVER}/users/${friendId}/items/${itemId}`,{
                  method:'PUT',
                  headers:{
                      'Content-Type':'application/json'
                  },
                  body:JSON.stringify({name:name,quantity:quantity,category:category,available:available})
              })
              .then((response)=>response.json())
              .then((response)=>{
                  console.log(response)
              })
          })
        
    }

    render() {
        if (localStorage.getItem('id')) {
            return (
                <div>
                    {this.state.categories.map((category, index) => (
                        <ul key={index.toString()}>{category}
                            {this.state.items.filter(item => item.category === category).map(item =>
                                <div key={item.id.toString()} className="item">
                                    <div>
                                        <span>{item.name}</span>x<span>{item.quantity}</span>
                                    </div>
                                    <div>
                                    <span>{item.expDate}</span>
                                    </div>
                                    <div>
                                        <input type="text" value={item.quantity} onChange={(event) => this.handleQuantityChange(event, item)} />
                                        <button className="myButton"  onClick={() => this.handleClaim(item)}>Claim</button>
                                    </div>
                                    <p>{item.message}</p>
                                </div>
                            )}
                        </ul>
                    ))}
                    <Link style={{ textDecoration: 'none', color: 'white' }} to="/friends">Done</Link>
                </div>
            )
        } else {
            return <p>You are not logged in</p>
        }
    }
}

export default Fridge