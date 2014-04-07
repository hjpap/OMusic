/**
 * Created by Ric on 13-11-9.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var articleSchema = new mongoose.Schema({
    title:{ type: String },
    type:{ type: Array },
    content:{ type: String },
    author:{ type: ObjectId },
    limits:{ type: String, default:1},//文章权限，1公开，2密码，3私人
    sortby: { type:String, default:255},//排序规则
    password:{ type: String },
    like: { type: Number, default: 0 },
    view: { type: Number, default:0 },
    comment: { type: Number, default:0},
    create_date: { type:Date, default:Date.now}
});

mongoose.model('Article',articleSchema);