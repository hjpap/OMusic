/**
 * Created by Ric on 13-11-9.
 */
var config = require('../config').config;
var models = require('../model');
var Article = models.Article;

exports.newArticle = function( title, type, content, author, callback){

    var article = new Article();
    article.title = title;
    article.type = type;
    article.content = content;
    article.author = author;

    article.save(callback);
}

exports.findById = function(id, callback){
    Article.findById(id, callback);

}

exports.findByPage = function(page,callback){
    var pageSize = config.articlePageSize;
    var start = (page - 1) * pageSize;
    Article.find().sort({sortby: 'asc',create_date:'asc'}).skip(start).limit(pageSize).exec(callback);
}

exports.findAll = function(callback){
    //Article.find(callback);
    Article.find().sort({sortby: 'asc',create_date:'asc'}).exec(callback);
}