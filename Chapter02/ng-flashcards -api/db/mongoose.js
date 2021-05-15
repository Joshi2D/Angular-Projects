//this file will hanle connection logic to mongodb database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/FlashCard', { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    console.log("Connected to MongoDB successfully :)");
}).catch((e)=>{
    console.log("Connection to MongoDB failed :(");
    console.log(e);
});

//to prevent deprecation warnings from MongoDB native driver
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
}