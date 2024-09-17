const mongoose = require("mongoose");
const initData= require("./data");
// const listing =require("../models/listing.js");
const Listing = require("../models/listing.js");


main()
.then((res)=> console.log("Connected to Mongo Db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust2');
}

const initDB = async ()=>{
 await  Listing.deleteMany({}); // Deleted Old Data
await Listing.insertMany(initData.data); // Insert the New Data from data 
console.log("Data was Initialize");
}
initDB();