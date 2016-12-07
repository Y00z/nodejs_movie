/**
 * Created by Yooz on 2016/11/24.
 */
//模型
var mongoose = require("mongoose");
var CommentSchema = require("../schemas/comment");
var Comment = mongoose.model('Comment',CommentSchema);


module.exports = Comment