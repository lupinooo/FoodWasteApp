import React,{Component} from 'react';
const daysLimit = 5;

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            expDateMessage:"This product will expire in..." 
            
        }
    }
    
    expire(){
         let daysDiff = (new Date(this.props.product.expDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
         daysDiff = Math.floor(daysDiff);
         if (daysDiff < daysLimit) {
             this.setState({
                  expDateMessage:`This product will expire in ${daysDiff} 'day(s)'!`
             })
           
        }
    }
    
    
    render() {
        return (
            <div className="item">
                <span>{this.props.product.name}</span> x <span>{this.props.product.quantity}</span>
                <div>
                    <button className="myButton"  onClick={() => this.props.onEdit(this.props.product)}>EDIT</button>
                    <button className="myButton"  onClick={() => this.props.onDelete(this.props.product)}>DELETE</button>
                </div>
                <div>
                {
                    this.props.product.available ? 
                    <span>Available</span> : <span>Not available</span>
                }
                </div>
                <div>
                expires on: {this.props.product.expDate}
                </div>
                <div><p onClick={this.expire.bind(this)}>{this.state.expDateMessage}</p></div>
            </div>
        )
    }
}
export default Item