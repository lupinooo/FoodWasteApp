import React,{Component} from 'react';

class NewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            quantity: '',
            available:false,
            category: 'Other',
            expDate: '',
            month: '',
            day: '',
            year: '',
            message: '',
        }
    }

    handleSelectChange(event) {
        const category = event.target.value;
        this.setState({ category })
    }

    handleNameChanged(event) {
        const name = event.target.value;
        this.setState({ name });
    }

    handleQuantityChanged(event) {
        const quantity = event.target.value;
        this.setState({ quantity });
    }

    handleMonthChanged(event) {
        const month = event.target.value;
        this.setState({ month });
    }

    handleDayChanged(event) {
        const day = event.target.value;
        this.setState({ day });
    }

    handleYearChanged(event) {
        const year = event.target.value;
        this.setState({ year });
    }

    handleAdd() {
        let { name, quantity, available,category, month, day, year } = this.state;
        quantity = Number(quantity);
        const expDate = new Date(`${month}/${day}/${year}`);
        if (name === '') {
            this.setState({ message: 'Incorrect name value' })
        } else if (isNaN(quantity) || quantity <= 0) {
            this.setState({ message: 'Incorrect quantity value' })
        } else if (expDate.toLocaleDateString() === 'Invalid Date') {
            this.setState({ message: 'Incorrect date value' })
        } else if (expDate < new Date()) {
            this.setState({ message: 'The product is expired' });
        } else {
            this.setState({ message: '', name: '', quantity: '', available:false, category: 'Other', day: '', month: '', year: '' })
            this.props.onAdd({ name, quantity, available, category, expDate });
        }
    }

    render() {
        return (
            <div className="div4">
                <div><span>Add a new item:</span></div>
                <div>
                    <input type="text" value={this.state.name} onChange={this.handleNameChanged.bind(this)} placeholder="name" />
                    <br></br>
                    <input type="text" value={this.state.quantity} onChange={this.handleQuantityChanged.bind(this)} className="small-input" placeholder="quantity" />
                </div>
                <div>
                    <label>Category:</label>
                    <select value={this.state.category} onChange={(event) => this.handleSelectChange(event)}>
                        {this.props.categories.map((categ, index) => <option key={index} value={categ}>{categ}</option>)}
                    </select>
                </div>
                <div>
                    <label>Expires on: </label>
                    <input type="text" value={this.state.month} onChange={this.handleMonthChanged.bind(this)} className="small-input" placeholder="month" />
                    <input type="text" value={this.state.day} onChange={this.handleDayChanged.bind(this)} className="small-input" placeholder="day" />
                    <input type="text" value={this.state.year} onChange={this.handleYearChanged.bind(this)} className="small-input" placeholder="year" />
                </div>
                <p>{this.state.message}</p>
                <button className="myButton"  onClick={this.handleAdd.bind(this)}>ADD NEW</button>
               
            </div>
        )
    }
}

export default NewItem