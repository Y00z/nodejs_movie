/**
 * Created by Yooz on 2016/11/24.
 */
//模型
var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie");
var Movie = mongoose.model('Movie',MovieSchema);


module.exports = Movie