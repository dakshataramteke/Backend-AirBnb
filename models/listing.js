const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
     type: String,
     required: true,
    },
    description :String,
    image : {
        default :"https://www.pexels.com/photo/lake-and-mountain-under-white-sky-443446/",
        
        type: String,
        set :(v)=> v ==="" ? "https://www.pexels.com/photo/lake-and-mountain-under-white-sky-443446/" :v,
    },
    price : Number,
    location : String,
    country : String,

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;