/**
 * Created by Ric on 13-11-10.
 */
var msgTag = 'controllers/article';
var ArticleDao = require('../dao/articleDao');

exports.articleForm = function(req, res){
    var title = req.body.title;
    var type =[ req.body.type ];
    if(!type[0]){
        type=null;
    }
    var content = req.body.mytext;
    var author = null;

    ArticleDao.newArticle(title, type, content, author, function(err){
        if(err){
            console.log('%s, add article err :'+err, msgTag);
        }else{
            console.log('%s, add article success', msgTag);
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end('add success');
        }
    });
}
exports.getArticleById = function(req, res, next){
    var aid = req.params.id;
    ArticleDao.findById(aid, function(err, article){
        if(err){
            console.log('%s, get a article err :'+err, msgTag);
            return;
        }
        if(!article){
            console.log('%s, no article :'+err, msgTag);
            return;
        }
        res.render('article',{
            article:article
        });
    });
}

exports.add = function(req, res){
    res.render('admin/add');
}

exports.toModify = function(req, res){
    var aid = req.params.id;
    ArticleDao.findById(aid, function(err, article){
        if(err){
            console.log('%s, get a article err :'+err, msgTag);
            return;
        }
        if(!article){
            console.log('%s, no article :'+err, msgTag);
            return;
        }
        res.render('admin/modify',{
            article:article
        });
    });
}