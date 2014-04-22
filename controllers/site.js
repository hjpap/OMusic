/**
 * Created by wei.wang on 11/4/13.
 */
var EventProxy = require('eventproxy');

exports.testPlyer =function(req,res){

    res.render('control/player',
        {       }
    );
};
exports.testImgBox=function(req,res){
     res.render('control/bgimgbox',
     {       }
     );
};

exports.index=function(req,res){
    res.render('index',
        {       }
    );
};

