/**
 * Created by Ric on 13-11-12.
 */
var Type = require('../dao/typeDao');

exports.ajaxAddType = function(req, res){
    var typeStr = req.query.typeName;
    if(typeStr==undefined || typeStr==""){
        res.json({status:"error"});
        return;
    }
    Type.findOneByName(typeStr,function(err,type){
        if(err){
            res.json({status:"error"});
            return;
        }
        if(type){
            res.json({status:"have"});
            return;
        }
        Type.newType(typeStr,function(err, newType){
            if(err){
                return;
            }
            res.json({status:'success',data:newType});
        });
    })
};

exports.ajaxGetType = function(req, res){
    Type.findAll(function(err, types){
        if(err){
            res.json({status:"error"});
            return;
        }
        res.json({status:"success",data:types});
    })
}