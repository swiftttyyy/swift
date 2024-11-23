const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
       fullname: {
        type: String, unique: true, required: true
       },
       username: {
        type: String,  unique: true, required: true
       },
       email:{
        type: String, unique: true, required: true
       },
       password:{
        type: String
       },
       deposit:{
        type: Number,
        default:  0
       },
       lastdeposit:{
         type: Number,
         default: 0
       },
       profit:{
        type: Number,
        default: 0
       },
       

    }
)

const User = mongoose.model('User', UserSchema)

module.exports = User