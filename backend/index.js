const express =require('express');//includes express
const app = express(); //calls the express method
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//cross origin resource sharing
const cors = require('cors');//cross origin restriction to be waived
const bcrypt = require('bcryptjs');
const config = require('./config.json');
const product = require('./Products.json');
const Product = require('./models/products.js');
const User = require('./models/users.js');
const Project = require('./models/projects.js')
const port = 3001;

//use ends here
app.use((req,res,next)=>{
 console.log(`${req.method} request ${req.url}`);
  next();
})

app.use(bodyParser.json());//calling body parser method
app.use(bodyParser.urlencoded({extended:true}));//using default
app.use(cors()); //calling cors method
app.get('/',(req,res)=> res.send('Hello! I am from the backendsssss'))

// Connect to mongoose Database:::::::::::::::::::::::::::::::::::::::::::::::
 mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/Sample?retryWrites=true&w=majority`, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log('DB connected!'))
.catch(err=>{
  console.log(`DBConnectionError:${err.message}`);
});


//listening to port
app.listen(port,()=>console.log(`My fullstack application is listening on port ${port}`))
