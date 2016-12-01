/**
 * Created by Yooz on 2016/12/1.
 */

var User = require('../models/user');
var Movie = require("../models/movie");
var _ = require("underscore");

//接收传进来的app，然后抛出
module.exports = function (app) {
    //预处理,请求之前都会先走这个方法，都会先走这个方法。
//用来判断每一个页面，用户是否登录。
    app.use(function (req, res, next) {
        //如果持久化了，就把user给全局变量，在前端也可以拿到。
        var _user = req.session.user
        if (_user)
            app.locals.user = _user
        //跳过这个方法。
        return next()
    })


//如果匹配到了根目录，那么就跳到了视图中的index文件
//并且传递title:首页 这个值过去。
    app.get('/', function (req, res) {
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


//添加电影
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
                title: '电影列表',
                movies: movies
            })
        })
    })


//删除电影。
    app.delete('/admin/list', function (req, res) {
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
    })

//  app.post('/user/signup/:userid
//  通过req.params.userid 拿到:userid
//
// app.post('/user/signup/asd?userid=432',function
// 通过req.query.userid 拿到:userid

//    req.params('userid')
//    这个是把路由和请求体中所有是userid的都搜索一遍，
//      /user/signup/1111?userid=123
//      {userid:321}
//    先搜索到的是1111   然后是321  最后是123
// })


    app.post('/user/signin', function (req, res) {
        var _user = req.body.user
        //通过用户名查询是否有该用户。
        User.findOne({name: _user.name}, function (err, user) {
            if (err) console.log(err)

            if (user) {
                res.redirect("/user/list")
            } else {
                var user = new User(_user)
                user.save(function (err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/user/list")
                    }
                })
            }
        })
    })

    app.get('/user/list', function (req, res) {
        User.fatch(function (err, users) {
            if (err) console.log(err)
            res.render('userlist', {
                title: '用户列表',
                users: users
            })
        })
    })


    app.post('/user/login', function (req, res) {
        var _user = req.body.user
        var name = _user.name
        var password = _user.password
        //先通过用户名查询，
        User.findOne({name: name}, function (err, user) {
            if (err) console.log(err);
            //如果用户名存在，就通过这个方法来查询密码是否正确
            if (user) {
                user.comparePassword(password, function (err, isMatch) {
                    if (isMatch) {
                        //保存登录状态
                        req.session.user = user
                        //密码是正确的
                        console.log("密码正确")
                        res.redirect("/user/list")
                    } else {
                        console.log("密码错误")
                        res.redirect("/")
                    }
                })
            } else {
                console.log("不存在该用户名")
            }
        })
    })


    app.get('/logout', function (req, res) {
        delete req.session.user
        delete app.locals.user
        res.redirect("/")
    })
}