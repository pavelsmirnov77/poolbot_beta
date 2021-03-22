const mongoose = require('mongoose')
const Schema = mongoose.Schema

const preSchema = new Schema({
    uuid: {
        type: String,
        requaired: true
    },
    name: {
        type: String,
        requaired: true
    },
    email: {
        type: String,
        requaired: true
    },
    name_id: {
        type: String,
        requaired: true
    },
    kafed_id: {
        type: String,
        requaired: true
    }
})
mongoose.model('prepods', preSchema)