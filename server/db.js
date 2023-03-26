const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require("dotenv").config();
const mongoURI = "mongodb://127.0.0.1:27017/music";

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => console.log("Connected to Mongo Successfully!"));
}

module.exports = connectToMongo;