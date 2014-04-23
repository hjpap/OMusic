/**
 * Created by Ric on 13-11-9.
 */
var config = require('../config').config;
var models = require('../model');
var Songs = models.Songs;

exports.newSong = function( label, src, singer, callback){

    var song = new Songs();
    song.label = label;
    song.src = src;
    song.singer = singer;

    song.save(callback);
}

exports.findById = function(id, callback){
    Songs.findById(id, callback);
}

exports.findByPage = function(page,callback){
    var pageSize = config.articlePageSize;
    var start = (page - 1) * pageSize;
    Songs.find().sort({sortby: 'asc',create_date:'asc'}).skip(start).limit(pageSize).exec(callback);
}

exports.findAll = function(callback){
    Songs.find().sort({sortby: 'asc',create_date:'asc'}).exec(callback);
}