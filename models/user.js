/**
 * Created by Yooz on 2016/11/24.
 */
//模型
var mongoose = require("mongoose");
var UserSchema = require("../schemas/user");
var User = mongoose.model('User',UserSchema);


module.exports = User