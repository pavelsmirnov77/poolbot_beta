const mongoose = require('mongoose')
const Schema = mongoose.Schema

const obSchema = new Schema({
    uuid: {
        type: String,
        requaired: true
    },
    name: {
        type: String,
        requaired: true
    },
    comendant: {
        type: String,
        requaired: true
    },
    adres: {
        type: String,
        requaired: true
    },
    phone: {
        type: String,
        requaired: true
    },
    email: {
        type: String,
        requaired: true
    },
    locationA: {
        type: Number,
        requaired: true
    },
    locationB: {
        type: Number,
        requaired: true
    }
})
mongoose.model('obshchezs', obSchema)