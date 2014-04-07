/**
 * Created by Ric on 13-11-12.
 */
var models = require('../model');
var Type = models.Type;

exports.newType = function(name, callback){
    var type = new Type();
    type.name = name;
    type.save(callback);
};

exports.findAll = function(callback){
    Type.find(callback);
};

exports.findOneById = function(id, callback){
    Type.findById(id,callback);
};

exports.findOneByName = function(name, callback){
    Type.findOne({name: name}, callback);
};