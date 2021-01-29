const express=require("express");
const bodyparser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");

const app=express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://dbPrat:test123@cluster0.drliy.mongodb.net/todolistDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const x=new mongoose.Schema({
   name:String
});

const Item=mongoose.model('Item',x);
const x1=new Item({
    name:"Welcome!"
});
const x2=new Item({
    name:"Press + to add items"
});
const x3=new Item({
    name:"Press this to delete"
});

const d=[x1,x2,x3];

const listSchema={
    name:String,
    items:[x]
};

const List=mongoose.model("List",listSchema);


app.get("/",function(req,res){
    
    let day=date();
    Item.find({},function(err,items){
        
        if(items.length==0){
            Item.insertMany(d,function(err){
                  if(err){ console.log("error");}
                  else{console.log("no error");}
                   
        });
        res.redirect("/");  
    }else{
        res.render("list",{listTitle:day,newwork:items});
        }
    });
    
});

app.get("/:customList",function(req,res){
    const customList=req.params.customList;
    
    List.findOne({name:customList},function(err,foundlist){
        if(!err){
            if(!foundlist){
               const list=new List({
                  name:customList,
                  items:d
                 });
                list.save();
                res.redirect("/"+customList);
            }else{
                res.render("list",{listTitle:foundlist.name,newwork:foundlist.items});
            }
        }
    });
});

app.post("/",function(req,res){
    let itemt=req.body.newitem;
    const item=new Item({
        name:itemt
    });
    item.save();
    res.redirect("/");
   
});


app.post("/delete",function(req,res){
    const id=req.body.checkbox;
    Item.findByIdAndRemove(id,function(err){
        if(!err){
            console.log("sucess");
            res.redirect("/");
        }
    });
});


let port=process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port);

app.listen(process.env.Port,function(){
       console.log("Working");
});

