/**
 * Created by wei.wang on 11/4/13.
 */
var config = require('../config').config;
var EventProxy = require('eventproxy');

exports.testPlyer =function(req,res){

    res.render('control/player',
        {   siteInfo:config.siteInfo    }
    );
};
exports.testImgBox=function(req,res){
     res.render('control/bgimgbox',
     {   siteInfo:config.siteInfo    }
     );
};

exports.index=function(req,res){
    res.render('index',
        {   siteInfo:config.siteInfo    }
    );
};

