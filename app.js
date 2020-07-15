require("dotenv").config();
const  express=require("express");
const  bodyParser=require("body-parser");
const  ejs=require("ejs");
const  mongoose=require("mongoose");
const  encrypt=require("mongoose-encryption");


const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected sucessfully");
    }
});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password']});

const User=mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
    res.render("home");
});

app.get('/register',(req,res)=>{
    res.render("register");
});

app.get('/login',(req,res)=>{
    res.render("login");
});

app.post("/register",(req,res)=>{
    const user=new User({
        email:req.body.username ,
        password:req.body.password
    });
    
    user.save((err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("New User Inserted");
            res.render("secrets");
        }
    });
    

});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},(err,result)=>{
        if(!err){
            if(result){
                if(result.password===password){
                    res.render("secrets");
                }
            }
        }

    });
});
const port=process.env.port||3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})