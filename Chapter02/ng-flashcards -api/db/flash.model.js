const mongoose = require('mongoose');
const FlashSchema = new mongoose.Schema({

question: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:50,
    trim: true
},answer: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:10,
    trim: true
},answer1: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:10,
    trim: true
},answer2: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:10,
    trim: true
},answer3: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:10,
    trim: true
},answer4: {
    type: String,
    required: false,
    minlength: 0,
    maxlength:10,
    trim: true
},_id: {
    type: Number,
    required: false
},show: {
    type: Boolean,
    required: false
}
})

const Flash = mongoose.model('Flash', FlashSchema);

module.exports = {
    Flash
}

