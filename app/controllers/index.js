/**
 * Created by Yooz on 2016/12/1.
 */

var Movie = require("../models/movie");

//如果匹配到了根目录，那么就跳到了视图中的index文件
//并且传递title:首页 这个值过去。
exports.index =  function (req, res) {
    //输出保存状态的用户。
    if (req.session.user)
        console.log("登录了")
    else
        console.log("没登录")

    Movie.fatch(function (err, movies) {
        if (err) console.log(err)
        res.render('index', {
            title: '首页',
            movies: movies
        })
    })
}