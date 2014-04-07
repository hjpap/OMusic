/**
 * Created by wei.wang on 11/4/13.
 */
//相应的controller
var Article = require('../dao/articleDao');
var EventProxy = require('eventproxy');

exports.index=function(req,res){

    res.render('player',
        {       }
    );

};
exports.box=function(req,res){
     res.render('bgimgbox',
     {       }
     );


};


