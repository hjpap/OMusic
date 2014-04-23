/**
 * Created by wei.wang on 11/4/13.
 */
var config = require('../config').config;
var SongsDao = require('../dao/songsDao');
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
    SongsDao.newSong("melody","/mp3/melody.mp3","陶喆");
    res.render('index',
        {   siteInfo:config.siteInfo    }
    );
};

