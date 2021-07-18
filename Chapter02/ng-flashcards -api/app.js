const express  = require('express');
const app = express();

const bodyParser = require('body-parser');

//loading mongo db
const {mongoose} = require('./db/mongoose');

//Load in the mongoose models
const {Flash} = require('./db');

//load middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//handles CORS issues
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS, PUT, DELETE")
    next();
  });

// Route Handlers
// Flash Routes

//get
// app.get('/flashes',(req, res) =>{
//         Flash.find({}).then((flashes) => {
//             res.send(flashes);
//           })
        
//     });

//conditional get 
app.get('/flashes/:type',(req, res) =>{
        let searchKey = req.params.type; 
        if(searchKey == 'All')
        searchKey = ''; 
        Flash.find({question : {$regex : ".*"+searchKey+".*"}}).then((flashes) => {
            res.send(flashes);
          });
    });

//post
app.post('/flashes',(req, res) => {
    
    let flash = req.body.flash;   
    let newFlash = new Flash({
        question : flash.question,
        answer   : flash.answer,
        answer1  : flash.answer1,
        answer2  : flash.answer2,
        answer3  : flash.answer3,
        answer4  : flash.answer4,
        _id      : flash._id,
        show     : flash.show 

    });
    
    newFlash.save().then((flashDoc) => {
        res.send(flashDoc);
    })
});

//patch
app.patch('/flashes/:id',(req, res) =>{
    let flash = req.body.flash;  
    let id = req.params.id; 
    
    Flash.findOneAndUpdate({ _id: id },  // <-- find stage
        { $set: {     
            question : flash.question,
            answer   : flash.answer,
            answer1  : flash.answer1,
            answer2  : flash.answer2,
            answer3  : flash.answer3,
            answer4  : flash.answer4,
            show     : flash.show           // <-- set stage                                               // <-- id not _id
          } 
        }).then(() =>{
          res.send({'message': 'FlashCard has been updated'});
      });
      
    });

//delete
app.delete('/flashes/:id',(req, res) =>{
    Flash.findOneAndDelete({
        id: req.params.id 
     }).then((removedFlashDoc) =>{
         res.send(removedFlashDoc);
     });
    });


app.delete('/flashes',(req, res) =>{
        Flash.deleteMany({}).then(() =>{
             res.sendStatus(200);
         });
        });

app.listen(3000, () =>{
    console.log("Server is listening on port '3000'");
     });
















//      {
//         "question": "What is the capital of India?",
//         "answer1": "Delhi",
//         "answer2": "Kabul",
//         "answer3": "Seol", 
//          "answer4": "Beijing"
//   }