/**
 * Created by Ric on 13-11-9.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var songsSchema = new mongoose.Schema({
    label:{ type: String },
    coverImg:{ type: Array },
    src:{ type: String },
    uploader:{ type: ObjectId },
    singer:{ type: String},
    tag: { type: Array },
    like: { type: Number, default: 0 },
    heard: { type: Number, default:0 },
    create_date: { type:Date, default:Date.now}
});

mongoose.model('Songs',songsSchema);