const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


main()
.then((res)=> console.log("Connected to Mongo Db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust2');
}
app.get("/",(req,res)=>{
    res.send("Home Page")
});

//Index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
// create Route
app.post("/listings",wrapAsync(async(req,res,next)=>{
    
    try{
        const newListing = new Listing( req.body.listing);
        await  newListing.save();
        // console.log(listing);
        res.redirect("/listings");
    }catch(err){
        next(err);
    }
  
}))
//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let updatelisting=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); // redirect to show
}))

// show Route

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

// Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing =await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))
app.all("*",(req,res,next)=>{
next(new ExpressError(404, "Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {statusCode= 500, message= "Something wend Wrong"}= err;
   res.status(statusCode).send(message);
})
app.listen(8080,(req,res)=>{
    console.log("Server is running on port 8080");
})