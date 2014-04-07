/**
 * Created by wei.wang on 11/4/13.
 */
var User = require('../dao/userDao');
var crypto=require('crypto');


var notJump = [
    '/sigup'       //regist page
];

exports.sigup = function(req,res,next){
    var loginName = req.body.loginName;
    var pass = req.body.password;
    var repass = req.body['re-password'];
    var name = req.body.name;
    var email = req.body.email;
    if (loginName==='' || name === '' || pass === '' || repass === '' || email === '') {
        return res.render('sigup', {error: '信息不完整。'});
    }
    if (pass !== repass) {
        return res.render('sigup', {error: '两次密码输入不一致。'});
    }
    User.getUsersByQuery({'$or':[{'loginname':loginName},{'email':email}]},function(err, users){
        console.log(users);
        if (err) {
            return res.render('sigup', {error: '注册失败。'});
        }
        if (users.length > 0) {
            return res.render('sigup', {error: '用户名或邮箱已被使用。'});
        }

        pass = md5(pass);
        User.newUser(name,loginName,pass,email,"2",function(err){
            if(err){
                return res.render('sigup', {error: '注册失败。'});
            }
            res.redirect('/home');
        })
    });
  /*  User.newUser(name,loginName,pass,email,"2",function(err){
        if(err){
            return res.render('sigup', {error: '注册失败。'});
        }
        res.redirect('/sigin');
    });*/
};

exports.sigin = function(req,res,next){
    var loginName=req.body.name;
    var pass=req.body.password;

    User.getUserByLoginName(loginName,function(err,user){
        if(err){
            return res.render('sigin',{error:'登录失败'});
        }
        if(!user){
           return res.render('sigin',{error:'用户名或密码错误'});
        }
        pass = md5(pass);
        if(pass !== user.pass){
            return res.render('sigin',{error:'用户名或密码错误'});
        }
        var refer = req.session._loginReferer || 'home';
        req.session.user=user;
        for (var i = 0, len = notJump.length; i !== len; ++i) {
            if (refer.indexOf(notJump[i]) >= 0) {
                refer = 'home';
                break;
            }
        }
        res.redirect(refer);
    });

};

exports.toSigin = function(req,res){
    req.session._loginReferer = req.headers.referer;
    console.log("referer:"+req.headers.referer);
    res.render('sigin',{error:null});
};

exports.toSigup = function(req,res){
    res.render('sigup',{error:null});
};


function md5(str){
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;

}