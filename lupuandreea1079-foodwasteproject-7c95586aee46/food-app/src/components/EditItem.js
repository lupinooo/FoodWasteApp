import React,{Component} from 'react';

class EditItem extends Component {

    render() {
        return (
            <div className="item">
                <input type="text"onChange={(event) => this.props.onNameChange(event, this.props.product)} value={this.props.product.name} /> x
                                            <input type="text" className="small-input" onChange={(event) => this.props.onQuantityChange(event, this.props.product)} value={this.props.product.quantity} />
                <div>
                    <label>Category:</label>
                    <select value={this.props.product.copyCateg} onChange={(event) => this.props.onSelectionChange(event, this.props.product)}>
                        {this.props.allCategories.map((categ, index) => <option key={index} value={categ}>{categ}</option>)}
                    </select>
                </div>
                {this.props.product.available ?
                     <div>
                        <span>Available</span>
                        <button className="myButton"  onClick={() => this.props.onAvailabilityChange(this.props.product)}>Mark as unavailable</button>
                        </div>
                     :
                        <div>
                        <span>Not available</span>
                        <button className="myButton" onClick={() => this.props.onAvailabilityChange(this.props.product)}>Mark as available</button>
                        </div>
                }
                <div>
                    <button className="myButton"  onClick={() => this.props.onSave(this.props.product)}>SAVE</button>
                    <button className="myButton"  onClick={() => this.props.onCancel(this.props.product)}>CANCEL</button>
                </div>
                <div>
                    <span>{this.props.product.message}</span>
                </div>
                <div>
                    <label>expires on: </label>
                    <span>{this.props.product.expDate}</span>
                </div>
            </div>
        )
    }
    }
export default EditItem