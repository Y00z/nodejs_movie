/**
 * Created by Yooz on 2016/12/1.
 */

var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')

//接收传进来的app，然后抛出
module.exports = function (app) {
    //预处理,请求之前都会先走这个方法，都会先走这个方法。
//用来判断每一个页面，用户是否登录。
    app.use(function (req, res, next) {
        //如果持久化了，就把user给全局变量，在前端也可以拿到。
        var _user = req.session.user
        //如果user是空的，就把空的赋值给locals
        app.locals.user = _user
        //跳过这个方法。
        next()
    })

    //首页
    app.get('/',Index.index)


    //电影详情
    app.get('/movie/:id', Movie.detail)

    //保存电影
    app.post('/admin/movie/new', Movie.save)

//编辑
    app.get('/admin/update/:id', Movie.update)


//添加电影
    app.get('/admin/movie', Movie.add)
//电影列表
    app.get('/admin/list', Movie.list)


//删除电影。
    app.delete('/admin/list',Movie.del)

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


    app.post('/user/signin', User.signin)

    app.get('/user/list', User.list)


    app.post('/user/login', User.login)


    app.get('/logout', User.logout)
}