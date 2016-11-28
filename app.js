/**
 * Created by Yooz on 2016/11/23.
 */

var express = require('express')
var path = require("path")
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var app = express()
var _ = require("underscore");
var Movie = require("./models/movie");
var port = process.env.PORT || 3000

//连接数据库
mongoose.connect("mongodb://localhost/yooz");

app.set("views", './views/pages')     //设置视图根目录
app.set('view engine', 'jade') //设置视图的模版引擎
// app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.listen(port);
console.log("成功启动:" + port)


//如果匹配到了根目录，那么就跳到了视图中的index文件
//并且传递title:首页 这个值过去。
app.get('/', function (req, res) {
    Movie.fatch(function (err, movies) {
        if (err) console.log(err)
        res.render('index', {
            title: '首页',
            movies: movies
        })
    })
})

app.get('/movie/:id', function (req, res) {
    //获取参数中的id
    var id = req.params.id
    Movie.findByid(id, function (err, movie) {
        res.render('detail', {
            title: "详情页",
            movie: movie
        })
    })

})


app.post('/admin/movie/new', function (req, res) {
    console.log(req.body)
    //提交的id
    var id = req.body.movie._id
    //提交的数据
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
})

//编辑
app.get('/admin/update/:id', function (req, res) {
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
})

app.get('/admin/movie', function (req, res) {
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
})

app.get('/admin/list', function (req, res) {
    Movie.fatch(function (err, movies) {
        if (err) console.log(err)
        res.render('list', {
            title: '列表',
            movies: movies
        })
    })
})


app.delete('/admin/list', function (req, res) {
    var id = req.query.id
    if (id) {
        Movie.remove({_id:id}, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success :1})
            }
        })
    }
})