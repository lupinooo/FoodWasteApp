import React,{Component} from 'react';
import history from './history';

export default class Friend extends Component {
    handleClick() {
        history.push(`/items/${this.props.friend.username}`)
    }
    render() {
        return (
            <div className="item">
                <div>
                    <span>{this.props.friend.username}</span>
                    <select value={this.props.friend.category} onChange={(event) => this.props.onSelectionChange(event, this.props.friend)}>
                        {this.props.allCategories.map((elem, index) => <option key={index.toString()} value={elem}>{elem}</option>)}
                    </select>
                    <div>
                    <button className="myButton"  onClick={this.handleClick.bind(this)}>Check friend's fridge!</button>
                    </div>
                </div>
            </div>
        )
    }
}