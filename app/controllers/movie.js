/**
 * Created by Yooz on 2016/12/1.
 */
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var _ = require("underscore");

//电影详情
exports.detail = function (req, res) {
    //获取参数中的id
    // var id = req.params.id
    // Movie.findByid(id, function (err, movie) {
    //     //先通过id找到movie后，
    //     //再通过movie的id来查询comment
    //     Comment.find({movie: id}, function (err, comment) {
    //         res.render('detail', {
    //             title: "详情页",
    //             movie: movie,
    //             comments : comment
    //         })
    //     })
    // })
    var id = req.params.id
    Movie.findByid(id,function (err, movie) {
        Comment
            .find({movie:id})
            //连表查询，from是Comment的一个字段，这个是指向的是user的_id
            //这个方法是通过执行的user，查询user中的name。
            .populate('from',"name")
            //把查询到的comment中的reply数组中的from和to字段对应的User对象中的name取出来。
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comment) {
                console.log(comment)
                res.render('detail',{
                    title:'详情页',
                    movie:movie,
                    comments:comment
                })
            })
    })
}

//保存电影
exports.save = function (req, res) {
    console.log(req.body)
    //提交的请求体中对象的id
    var id = req.body.movie._id
    //提交的对象
    var movieObj = req.body.movie
    var _movie

    if (id !== 'undefined') { //判断id是否存在，如果存在说明这个电影，已经在数据库里面的
        //已经存在了，更新
        Movie.findByid(id, function (err, movie) {
            if (err) console.log(err)

            //提交上来的数据，替换掉数据库已经存在的数据。  (新的替换掉旧的)
            _movie = _.extend(movie, movieObj) //第一个旧的，第二个新的。
            //存入数据库
            _movie.save(function (err, movie) {
                if (err) console.log(err)
                //储存成功后，跳转到电影的详情页。
                res.redirect("/movie/" + movie._id)
            })
        })
    } else {//不存在，储存。

        //定义要存入对象的数据为提交的数据
        _movie = new Movie({
            title: movieObj.title,
            director: movieObj.director,
            countrie: movieObj.countrie,
            language: movieObj.language,
            year: movieObj.year,
            flash: movieObj.flash,
            descript: movieObj.descript,
            poster: movieObj.poster,
        })

        //存入数据库
        _movie.save(function (err, movie) {
            if (err) console.log(err)
            //储存成功后，跳转到电影的详情页。
            res.redirect("/movie/" + movie._id)
        })
    }
}

//编辑
exports.update = function (req, res) {
    var id = req.params.id
    if (id) {   //如果存在的话。
        Movie.findByid(id, function (err, movie) {
            if (err) console.log(err)
            res.render("admin", {
                title: "更新",
                movie: movie
            })
        })
    }
}


//添加电影
exports.add = function (req, res) {
    res.render('admin', {
        title: '后台',
        movie: {
            title: "",
            director: "",
            countrie: "",
            language: "",
            poster: "",
            flash: "",
            year: "",
            descript: ""
        }
    })
}

//电影列表
exports.list = function (req, res) {
    Movie.fatch(function (err, movies) {
        if (err) console.log(err)
        res.render('list', {
            title: '电影列表',
            movies: movies
        })
    })
}


//删除电影。
exports.del = function (req, res) {
    var id = req.query.id
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
}
