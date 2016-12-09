/**
 * Created by Yooz on 2016/11/24.
 */
//模型
var mongoose = require("mongoose");
var CategorySchema = require("../schemas/category");
var Category = mongoose.model('Category',CategorySchema);


module.exports = Category