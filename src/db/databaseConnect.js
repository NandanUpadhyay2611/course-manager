const mongoose=require("mongoose");
const dotenv=require("dotenv");
// const config=require("")



const connectDatabase=()=>{
mongoose
  .connect("mongodb+srv://kirattechnologies:iRbi4XRDdM7JMMkl@cluster0.e95bnsi.mongodb.net/courses", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start your application logic here
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
}

module.exports=connectDatabase;