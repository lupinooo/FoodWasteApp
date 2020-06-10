'use strict'
const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const Sequelize=require('sequelize')
const cors=require('cors')

const sequelize=new Sequelize('users_db', 'app', 'lupino123', {
    dialect: 'mysql'
})

const Users=sequelize.define('users', {
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
         type: Sequelize.STRING,
        allowNull: false
    },
   
})

const Items=sequelize.define('fooditems', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    expDate:{
        type: Sequelize.DATEONLY,
        allowNull:false
    },
    category:{
        type: Sequelize.ENUM,
        values:['Dairy', 'Meat', 'Sweets', 'Fruits', 'Vegetables', 'Other'],
        allowNull:false
    },
    available:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull:false
    }
})


const Friends=sequelize.define('friends',{
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    category:{
        type:Sequelize.ENUM,
        values:['MeatLovers', 'Vegetarians', 'Vegans', 'Healthy Foodie'],
        allowNull:false
    }
})

//legatura intre tabele
Users.hasMany(Friends)
Users.hasMany(Items)

sequelize.sync()
app.use(cors())
app.use(bodyParser.json())

//metoda de inserare user (register)
app.post('/register', async(req, res, next) => {
    let username=req.body["username"]
    let no=await Users.count({where:{username:username}})
    if(no!=0){
        res.status(400).json({message:"Not unique username"})
    }
    else{
    let email = req.body["email"]
    let password = req.body["password"]
    await Users.create({
        username:username,
        email:email,
        password:password
    })
    res.status(200).json({message:"user created"})
    
    }
}
)

//metoda de afisare useri 
app.get('/users', async(req, res, next)=>{
    try{
    let users= await Users.findAll();
    res.status(200).json(users)
    }
    catch(err){
        console.warn(err)
        res.status(500).json({message:':('})
    }
})

//prietenii pot fi adaugati doar din userii deja existenti in baza de date
app.post('/users/:idUser/friends', async(req, res)=>{
    try{
        let user=await Users.findByPk(req.params.idUser, {
            include:[Friends]
        })  
        if(user){
        let friend=req.body
        let username=req.body.username
        let userFriend=await Users.findOne({where:{username:username}})
        if(userFriend){
        friend.userId=user.id //foreign key
        await Friends.create(friend)
        res.status(201).json({message:'created'}) 
        }
        else{
            res.status(404).json({message:'this user does not exist. you cannot add it as a friend'
            })
        }
    }
    else{
        res.status(404).json({message:'not found'})
    }
    }
    catch(err){
      res.status(500).json({message:":("})
    }
})



//afisarea prietenilor unui user 
app.get('/users/:idUser/friends', async(req, res)=>{
    let user=await Users.findByPk(req.params.idUser, {
        include:[Friends]
    })
    if(user){
        let friends=user.friends
            res.status(200).json(friends)
        }
        else{
            res.status(404).json({message:"friends not found"})
        }
})

app.get('/friends/categories', async(req, res)=>{
    try{
        let categories=Friends.rawAttributes.category.values
        if(categories){
            res.status(200).json(categories)
        }
        else{
            res.status(404).json({message:"no categories"})
        }
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})

//afisarea unui singur prieten al unui user
app.get('/users/:idUser/friends/:idFriend', async(req, res)=>{
    let user=await Users.findByPk(req.params.idUser, {
        include:[Friends]
    })
    if(user){
        let friend=await user.getFriends({
            where:{
                id:req.params.idFriend
            }
        })
        if(friend){
            res.status(200).json(friend)
        }
        else{
            res.status(404).json({message:"friend not found"})
        }
    }
    else{
        res.status(404).json({message:"user not found"})
    }
    
})

//stergerea prietenului unui user; ambii identificati prin id
app.delete('/users/:idUser/friends/:idFriend', async(req, res)=>{
    try{
        let user=await Users.findByPk(req.params.idUser)
        if(user){
            let friends=await user.getFriends({
                where:{
                    id:req.params.idFriend
                }
            })
            let friend=friends.shift()
            if(friend){
                await friend.destroy()
                res.status(200).json({message:"friend deleted"})
            }
            else{
                res.status(404).json({message:"friend not found"})
            }
            
        }
        else{
            res.status(404).json({message:"user not found"})
        }
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})



//stergerea unui user din baza de date; atunci cand se sterge userul, se sterg si toate itemurile acestuia
app.delete('/users/:id', async(req, res, next)=>{
    try{
      let id=req.params.id
      let deleteUser=await Users.findByPk(req.params.id)
      let username=deleteUser.dataValues["username"]
      if(deleteUser){
         await UsersItem.destroy({
             where:{
                 username: username
             }
         })
         await Users.destroy({
          where:{
              id:id
          }
      })
         
         res.status(200).json({message:"user and user's items deleted!"})
      }
      else{
          res.status(404).json({message:"user not found"})
      }
    }
    catch(err){
        res.status(500).json({message:':('})
    }
})

//functia de login; verificare daca exista in tabelul de useri, userul cu acel username si acea parola
app.post('/login', async(req, res)=>{
    let username=req.body["username"]
    let password=req.body["password"]
    
    let user=await Users.findOne({
        where:{
            username:username,
            password:password
        }
    })
    console.log(user)
    if(user){
        res.status(200).json({id:user.id, username:user.username, email:user.email})
    }
    else{
        res.status(400).json({message:"Invalid Login"})
    }
    
})



//adaugare item unui user
app.post('/users/:idUser/items', async(req, res)=>{
    try{
        let user=await Users.findByPk(req.params.idUser, {include:Items})
        if(user){
            let item=req.body
            item.userId=user.id
            await Items.create(item)
            res.status(200).json(item)
        }
        else{
            res.status(400).json({message:"user not found"})
        }
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})



//afisare items pt un anumit user
app.get('/users/:idUser/items', async(req, res)=>{
    try{
        let user=await Users.findByPk(req.params.idUser, {include:Items})
        if(user){
            res.status(200).json(user.fooditems)
        }
        else{
            res.status(400).json({message:"user not found"})
        }
        
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})



//categorii food
app.get("/items/categories", async(req, res)=>{
    try{
        let categories=Items.rawAttributes.category.values;
        if(categories){
            res.status(200).json(categories)
        }
        else{
            res.status(404).json("categ not found")
        }
        
    }
    catch(err){
       res.status(500).json({message:":("}) 
    }
})

//items din anumita categorie
app.get("/items/:userId/:category", async(req,res)=>{
    try{
    let items=Items.findAll({
        where:{
            userId:req.params.userId,
            category:req.params.category
        }
    }).then(result=>{
        if(result){
        res.status(200).send(result)
        }
        else{
        res.status(404).send({message:"no items in that category"})
    }
    })
    }
    catch(err){
         res.status(500).send({message:":("})
    }
})

//afisarea tuturor itemurilor disponibile din aplicatie
app.get("/availableItems", async(req, res)=>{
    let items=Items.findAll({
        where:{
            available:true
        }
    }).then(result=>{
        if(result){
        res.status(200).send(result)
        }
        else{
        res.status(404).send({message:"no available items at the moment"})
    }
    })
})

//editare item
app.delete("/users/:userId/items/:itemId", async(req, res)=>{
    try{
     let item=await Items.findByPk(req.params.itemId)
            if(item){
                await item.destroy()
                res.status(200).json({message:"item deleted"})
            }
            else{
                res.status(404).json({message:"item not found"})
            }
      }
    catch(err){
        res.status(500).json({message:":("})
    }
})

app.get('/items', async(req, res)=>{
    try{
        let items=await Items.findAll()
        res.status(200).json(items)
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})

app.put("/users/:userId/items/:itemId", async(req, res)=>{
    const {name, quantity, category, available}=req.body
    try{
        await Items.update(
      { name:name, quantity:quantity,category:category,available:available },
      { where: { id:req.params.itemId, userId:req.params.userId } }
    )
        res.status(202).json({message:'accepted'}) 
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})

app.get('/users/:username/availableItems', async(req, res)=>{
    try{
        let user=await Users.findOne({where:{username:req.params.username}})
        let userId=user.id
        let items=await Items.findAll({
            where:{
                userId:userId,
                available:true
            }
        })
        if(items){
            res.status(200).json(items)
        }
        else{
            res.status(404).json('user has no items')
        }
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})

app.get('/users/:username', async(req,res)=>{
    try{
        let user=await Users.findOne({where:{username:req.params.username}})
        if(user){
        let id=user.id
        res.status(200).json(id)
        }
        else{
            res.status(404).json('user not found')
        }
       
    }
    catch(err){
        res.status(500).json({message:":("})
    }
})


app.listen(8080)





