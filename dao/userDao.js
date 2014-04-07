/**
 * Created by wei.wang on 11/4/13.
 */
var models = require('../model');
var User = models.User;

exports.getUserByLoginName = function(loginName , callback ){
    User.findOne({'loginname': loginName}, callback);
};

exports.newUser = function(name , loginname , pass , email , limit , callback){
    var user=new User();
    user.name = name;
    user.loginname=loginname;
    user.pass=pass;
    user.email=email;
    user.limit=limit;
    user.save(callback);
};

exports.getUsersByQuery = function (query, callback) {
    User.find(query, callback);
};

exports.dd = function(){
    return "dd";
}