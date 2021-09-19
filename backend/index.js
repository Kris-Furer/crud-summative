const express =require('express');//includes express
const app = express(); //calls the express method
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');//cross origin restriction to be waived
const bcrypt = require('bcryptjs');
const config = require('./config.json');
const Product = require('./models/products.js');
const User = require('./models/users.js');
const product = require('./Products.json');

const port = 3002;

//use ends here
app.use((req,res,next)=>{
 console.log(`${req.method} request ${req.url}`);
  next();
})

app.use(bodyParser.json());//calling body parser method
app.use(bodyParser.urlencoded({extended:true}));//using default
app.use(cors()); //calling cors method
app.get('/',(req,res)=> res.send('Hello! I am from the backend'))

// Connect to mongoose Database:::::::::::::::::::::::::::::::::::::::::::::::
 mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log('DB connected!'))
.catch(err=>{
  console.log(`DBConnectionError:${err.message}`);
});


//Product Methods:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//post method to write or create a product in mongodb
app.post('/addProduct',(req,res)=>{
  const dbProduct = new Product({
    _id : new mongoose.Types.ObjectId,
    name : req.body.name,
    price: req.body.price,
    image_url : req.body.image_url,
    console:req.body.console,
    genre: req.body.genre,
    description:req.body.description,
    seller:req.body.seller,
    itemLocation:req.body.itemLocation,
    user_id :req.body.user_id
  });
  //save to the database and notify the user
  dbProduct.save().then(result=>{
    res.send(result);
  }).catch(err=>res.send(err));
})

//retrieve objects or documents from the database
app.get('/allProductsFromDB',(req,res)=>{
  Product.find().
  then(result=>{
    res.send(result);
  })
})

// Products by genre
app.get(`/allProductsFromDB/Genre`,(req,res)=>{
  Product.find({
  genre:"RPG",
  console:"GameBoy"
  }).then(result=>{
    res.send(result);
  })
})

// Products by user
app.get(`/allProductsFromDB/userListings`,(req,res)=>{
  // Product find looks for a match
  Product.find({
  // query allows us to get get user id from the front end
  user_id:req.query.user_id
  }).then(result=>{
    res.send(result);
  });
})


//patch is to update the details of the objects
app.patch('/updateProduct/:id',(req,res)=>{
  const idParam = req.params.id;

  Product.findById(idParam,(err,product)=>{
    if (product['user_id'] == req.body.user_id){
      const updatedProduct = {

        name : req.body.name,
        price: req.body.price,
        image : req.body.image,
        console:req.body.console,
        genre: req.body.genre,
        description:req.body.description

      }
      Product.updateOne({_id:idParam}, updatedProduct).
      then(result=>{
        res.send(result);
      }).catch(err=> res.send(err));
    } else{
      res.send('error: product not found')
    }//else
  })
})


app.get('/products/p=:id',(req,res)=>{
  const idParam = req.params.id;
  for (let i =0; i<product.length; i++){
    if (idParam.toString() === product[i].id.toString()){
      res.json(product[i]);
    }
  }
});


//delete a product from database
app.delete('/deleteProduct/:id',(req,res)=>{
  const idParam = req.params.id;
  Product. findOne({_id:idParam}, (err,product)=>{
    if(product){
      Product.deleteOne({_id:idParam},err=>{
        res.send('deleted');
    });
    } else {
      res.send('not found');
    } //else
  }).catch(err=> res.send(err));
});//delete

// User Methods :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// register a new user
app.post('/registerUser',(req,res)=>{
  //checking if user is found in the db already
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      res.send('username taken already. Please try another name');

    } else {
      const hash = bcrypt.hashSync(req.body.password); //encrypts MONGO_PASSWORD
      const user = new User({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        email : req.body.email,
        password : hash
      });
      //saves to database and notify the user
      user.save().then(result=>{
        res.send(result);
      }).catch(err=>res.send(err));
    }
  });
});

//view all users
app.get('/allUser',(req,res)=>{
  User.find().then(result=>{
    res.send(result);
  })
});

//login the user
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      if (bcrypt.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('not authorized');
      }//inner if
    } else {
       res.send('user not found. Please register');
    }//outer if
  });//findOne
});//post



//listening to port
app.listen(port,()=>console.log(`My fullstack application is listening on port ${port}`))
