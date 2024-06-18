const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
       fullname: {
        type: String
       },
       username: {
        type: String
       },
       email:{
        type: String
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