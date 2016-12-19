/**
 * Created by Yooz on 2016/12/1.
 */
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var _ = require("underscore");
var fs = require('fs');
//path 为当前文件所在路径
var path = require('path');

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
    //在原始数据上也就是pv 加上1
    Movie.update({_id:id},{$inc:{pv:1}},function (err) {
        if(err) console.log(err)
    })
    Movie.findByid(id, function (err, movie) {
        Comment
            .find({movie: id})
            //连表查询，from是Comment的一个字段，这个是指向的是user的_id
            //这个方法是通过执行的user，查询user中的name。
            .populate('from', "name")
            //把查询到的comment中的reply数组中的from和to字段对应的User对象中的name取出来。
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comment) {
                console.log(comment)
                res.render('detail', {
                    title: '详情页',
                    movie: movie,
                    comments: comment
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
    //提交的分类id
    var categoryId = movieObj.category
    var _movie

    if(req.poster){
        movieObj.poster = req.poster
    }

    if (id) { //判断id是否存在，如果存在说明这个电影，已经在数据库里面的
        //已经存在了，更新
        Movie.findByid(id, function (err, movie_) {
            if (err) console.log(err)
            var _category = movie_.category
            //提交上来的数据，替换掉数据库已经存在的数据。  (新的替换掉旧的)
            _movie = _.extend(movie_, movieObj) //第一个旧的，第二个新的。
            //存入数据库
            _movie.save(function (err, movie) {
                if (err) console.log(err)
                //如果提交上来的分类，和原来的分类不同，那么就说明分类也更改了，重新保存分类。
                console.log(categoryId + ":" + _category)
                if (categoryId != _category) {
                    console.log("更改了分类")
                    //先保存修改后的分类。
                    Category.findByid(categoryId, function (err, category) {
                        if (err) console.log(err)
                        category.movie.push(movie._id)
                        category.save(function (err, category) {
                            if (err) console.log(err)
                        })
                    })
                    //再删除之前分类中的moive_id
                    Category.update({_id: _category}, {$pull: {"movie": movie_._id}}, function (err, category) {
                        if (err) console.log(err)
                        console.log("删除操作")
                        console.log(_category + ":" + movie_)
                    })
                }

            })
            //储存成功后，跳转到电影的详情页。
            return res.redirect("/movie/" + movie_._id)
        })
    } else {//不存在，储存。
        console.log("不存在")
        //定义要存入对象的数据为提交的数据
        _movie = new Movie(movieObj)

        var categoryId = movieObj.category;
        console.log("categoryId:" + categoryId)

        //存入数据库
        _movie.save(function (err, movie) {
            if (err) console.log(err)
            if (categoryId) {
                Category.findOne({_id: categoryId}, function (err, category) {
                    console.log("category:" + category)
                    if (err) console.log(err)
                    category.movie.push(movie._id)
                    category.save(function (err, category) {
                        if (err) console.log(err)
                    })
                })
            }
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
            Category.fatch(function (err, categorys) {
                if (err) console.log(err)
                res.render("admin", {
                    title: "更新",
                    movie: movie,
                    categorys: categorys
                })
            })
        })
    }
}


//添加电影
exports.add = function (req, res) {
    Category.fatch(function (err, categorys) {
        res.render('admin', {
            title: '后台',
            movie: {},
            categorys: categorys
        })
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

//上传海报
exports.savePoster = function (req, res, next) {
    //获取提交上来的图片数据，posterData是图片数据的json串
    var posterData = req.files.uploadPoster
    console.log(req.files)
    console.log(posterData)
    //获取图片数据所在路径
    var filePath = posterData.path
    //获取图片名字
    var originalFilename = posterData.originalFilename
    //如果有名字就说明有上传图片
    if(originalFilename){
        //读取到图片数据
        fs.readFile(filePath,function (err, data) {
            //当前时间
            var timeName = Date.now()
            //posterData是图片数据的json穿，type字段是图片类型名字
            var type = posterData.type.split('/')[1]
            //定义图片名称
            var poster = timeName+"."+type
            //定义图片保存路径， __dirname表示当前文件所在路径
            var newPath = path.join(__dirname,'../../','/public/upload/'+poster)
            //写入图片
            fs.writeFile(newPath,data,function (err) {
                //把poster放到请求头中.
                req.poster = poster
                next();
            })
        })
    }else{
        next()
    }
}