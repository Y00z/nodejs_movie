/**
 * Created by Yooz on 2016/12/1.
 */

var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')

//接收传进来的app，然后抛出
module.exports = function (app) {
    //预处理,请求之前都会先走这个方法，都会先走这个方法。
//用来判断每一个页面，用户是否登录。
    app.use(function (req, res, next) {
        //如果持久化了，就把user给全局变量，在前端也可以拿到。
        var _user = req.session.user
        //如果user是空的，就把空的赋值给locals
        app.locals.user = _user
        //继续往下面执行
        next()
    })

    //首页
    app.get('/', Index.index)

//电影
    //电影详情
    app.get('/movie/:id', Movie.detail)
    //保存电影
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired, Movie.save)
    //编辑
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired, Movie.update)
    //添加电影
    app.get('/admin/movie',User.signinRequired,User.adminRequired, Movie.add)
    //电影列表
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired, Movie.list)
    //删除电影。
    app.delete('/admin/movie/list',User.signinRequired,User.adminRequired, Movie.del)

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


//用户

    //用户列表
    app.get('/admin/user/list',User.signinRequired,User.adminRequired, User.list)
    //登录
    app.post('/user/login', User.login)
    app.get('/login', User.showLogin)
    //注册
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    //注销
    app.get('/logout', User.logout)
    app.delete('/admin/user/list',User.signinRequired,User.adminRequired,User.del)



    app.post('/user/comment',User.signinRequired, Comment.save)
}