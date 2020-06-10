import React, {Component}  from 'react'
import {Link} from 'react-router-dom'
import Item from './Item.js'
import NewItem from './NewItem.js'
import EditItem from './EditItem.js'
const SERVER="http://3.134.97.50:8080"


class UserItemsList extends Component{
     constructor(props) {
        super(props);
        this.state = {
            products: [],
            categories: [],
            allCategories: [],
           // editing:false,
            message: ''
        };
    }
    
      componentDidMount(){
      const id=localStorage.getItem("id");
      console.log(id)
      if(!id){
          this.setState({
              message:"You are not logged in"
          })
      }
      else{
          fetch(`${SERVER}/users/${id}/items`)
            .then((response)=>response.json())
            .then((products)=>{
                console.log(products)
                this.setState({
                    products:products,
                    categories:this.getCategories(products)
                })
            })
            
            fetch(`${SERVER}/items/categories`)
             .then((response)=>response.json())
            .then((data)=>{
                console.log(data)
                this.setState({
                    allCategories:data
                })
            })
            
      }
    }
    
    handleAdd(product){
        const id=localStorage.getItem("id");
       // console.log(product)
        fetch(`${SERVER}/users/${id}/items`,{...product,available:false, userId:localStorage.getItem("id"),
             method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(product)
            })
            .then((response) => response.json())
            .then((product) => {
                console.log('Success:', product)
                const products=this.state.products
                products.push(product)
                this.setState({
                    products:products.map(product=>{return{...product}}),
                    categories:this.getCategories(products)
                })
                
            })
            .catch((error) => {
            console.error('Error:', error);
            })
            
    }
    
     getCategories(products) {
        return Array.from(new Set(products.map(product => product.category)));
    }
    
    handleNameChanged(event, product){
        product.name=event.target.value
        this.setState({
            products:this.state.products
        })
    }
    
    handleQuantityChanged(event, product){
        product.quantity=event.target.value
        this.setState({
            products:this.state.products
        })
    }
    
    //modificare daca un prod e disponibil sau nu
    handleChangeAvailable(product){
        let index=this.state.products.findIndex(elem=>elem.id===product.id)
        this.state.products[index].available=!this.state.products[index].available
        this.setState({
            products:this.state.products
        })
    }
    
    handleSelectionChange(event, product){
        product.copycat=event.target.value
        let index=this.state.products.findIndex(elem=>elem.id===product.id)
        this.state.products[index].copycat=event.target.value
        this.setState({
            products:this.state.products
        })
    }
    
    handleEdit(product){
        product.copy=JSON.parse(JSON.stringify(product))
        product.editing=true
        this.setState({
            products:this.state.products
        })
        
    }
    
    handleSave(product){
        let {quantity, name}=product;
            const id=localStorage.getItem("id")
            let itemId=product.id
            console.log(id, itemId)
            fetch(`${SERVER}/users/${id}/items/${itemId}`,{...product,
             method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(product)
            })
            .then((response) => response.json())
            .then(() => {
                console.log('Success:', product)
               product.editing=false
               product.category=product.copycat
               if(quantity===0){
                   const index=this.state.products.findIndex(elem=>elem.id===product.id)
                   this.state.products.splice(index, 1)
               }
               this.setState({
                   products:this.state.products,
                   categories:this.getCategories(this.state.products)
               })
                
            })
            .catch((error) => {
            console.error('Error:', error);
            })
    }
    
     handleDelete(product){
        let userId=localStorage.getItem("id")
        let itemId=product.id
        fetch(`${SERVER}/users/${userId}/items/${itemId}`, {
            method:'delete'
        }).then((response) => response.json())
            .then(() => {
              let index=this.state.products.findIndex(elem=>elem.id===product.id)
              //console.log(index)
              this.state.products.splice(index,1)  
              this.setState({
                  products:this.state.products,
                  categories:this.getCategories(this.state.products)
              })
            })
            .catch((error) => {
            console.error('Error:', error);
            })
    }
    handleCancel(product){
        let index=this.state.products.findIndex(elem=>elem.id===product.id)
        this.state.products[index]=this.state.products[index].copy
        this.state.products[index].message=""
        this.setState({
            products:this.state.products
        })
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
        </div>
                <div className="div3">
                    <h4>Your fridge:</h4>
                    {this.state.categories.map((category, index) => {
                        return (
                            <div key={index}>
                               <b><u> {category}</u> </b>
                                <ul>
                                    {this.state.products.filter(product => product.category === category).map((product, index) => {
                                        if (!product.editing) {
                                            return <Item className="item" key={index.toString()} product={product} 
                                            onDelete={(product) => this.handleDelete(product)} 
                                            onEdit={(product) => this.handleEdit(product)} 
                                            onChangeAvailable={(product, availability) => this.handleChangeAvailable(product, availability)} />
                                        }
                                        else{
                                            return <EditItem  key={product.name} allCategories={this.state.allCategories} product={product}
                                            onNameChange={(event, product)=>this.handleNameChanged(event, product)}
                                            onQuantityChange={(event, product)=>this.handleQuantityChanged(event, product)}
                                            onSelectionChange={(event, product)=>this.handleSelectionChange(event, product)}
                                            onAvailabilityChange={(product)=>this.handleChangeAvailable(product)}
                                            onSave={(product)=>this.handleSave(product)}
                                            onCancel={(product)=>this.handleCancel(product)}
                                            />
                                        }
                                    })}
                                    </ul>
                                    </div>)
                                    })}
                                    
                    </div>
                    <div>
                    <NewItem onAdd={(product) => this.handleAdd(product)} categories={this.state.allCategories}/>
                    </div>
                    </div>)
        }
        else{
            return (<div> You are not logged in </div>)
        }
     }
    
}

export default UserItemsList;