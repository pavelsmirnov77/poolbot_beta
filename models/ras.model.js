const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RasSchema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

mongoose.model('raspisanie12', RasSchema)