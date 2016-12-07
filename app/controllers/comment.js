/**
 * Created by Yooz on 2016/12/5.
 */

var Comment = require("../models/comment");

exports.save = function (req, res) {
    //获取到提交的评论对象
    var _comment = req.body.comment
    //那到评论对象所在电影的电影id
    var movieId = _comment.movie
    var comment = new Comment(_comment)

    //存入数据库
    comment.save(function (err, comment) {
        if (err) console.log(err)
        //储存成功后，跳转到电影的详情页。
        res.redirect("/movie/" + movieId)
    })
}