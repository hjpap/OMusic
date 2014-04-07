/**
 * Created by wei.wang on 11/4/13.
 */
var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    name: { type: String, index: true },
    loginname: { type: String, unique: true },
    pass: { type: String },
    email: { type: String, unique: true },
    limit: { type:String,default:"2" }
});

mongoose.model('User',userSchema);