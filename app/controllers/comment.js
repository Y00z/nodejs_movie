/**
 * Created by Yooz on 2016/12/5.
 */

var Comment = require("../models/comment");

exports.save = function (req, res) {
    //获取到提交的评论对象
    var _comment = req.body.comment
    //那到评论对象所在电影的电影id
    var movieId = _comment.movie
    console.log("_comment")
    console.log(_comment)
    //只有在用户点击头像，回复另一个用户的时候，才有cid。
    //有cid，说明是要评论给谁。
    if (_comment.cid) {
        //找到主评论。
        Comment.findByid(_comment.cid, function (err, comment) {
            //主评论中，填充副评论的内容。
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }

            //主评论中，填充副评论
            comment.reply.push(reply)

            //保存评论
            comment.save(function (err, comment) {
                if (err) console.log(err)
                //储存成功后，跳转到电影的详情页。
                res.redirect("/movie/" + movieId)
            })
        })
        console.log("回复评论")

    }else{ //如果没有cid就是普通的评论
        var comment = new Comment(_comment)
        //存入数据库
        comment.save(function (err, comment) {
            if (err) console.log(err)
            //储存成功后，跳转到电影的详情页。
            res.redirect("/movie/" + movieId)
        })
        console.log("普通评论")
    }
}