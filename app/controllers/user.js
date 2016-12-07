/**
 * Created by Yooz on 2016/12/1.
 */
var User = require('../models/user');

//注册
exports.signin = function (req, res) {
    var _user = req.body.user
    //通过用户名查询是否有该用户。
    User.findOne({name: _user.name}, function (err, user) {
        if (err) console.log(err)
        if (user) {
            res.redirect("/admin/user/list")
        } else {
            var user = new User(_user)
            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect("/login")
                }
            })
        }
    })
}
exports.showSignin = function (req, res) {
    res.render('signin', {
        title: "注册"
    })
}

//用户列表
exports.list = function (req, res) {
    // var user = req.session.user
    //用户不存在，就重定向到登录
    // if (!user) {
    //     return res.redirect("/signin")
    // }
    //如果权限大于10的时候 才可以看到用户列表页
    // if (user.role > 10) {
    User.fatch(function (err, users) {
        if (err) console.log(err)
        res.render('userlist', {
            title: '用户列表',
            users: users
        })
    })
    // }
}


//判断是否登录。
exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if(!user)
        return res.redirect("/login");
    //如果登录了就跳到下一步，验证权限
    next()
}
//判断是不是管理员
exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    //如果用户登录权限没有10就跳到登录页面。
    if(user.role <= 10)
        res.redirect("/login")
    next()
}
//登录
exports.login = function (req, res) {
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
                    res.redirect("/admin/user/list")
                } else {
                    res.redirect("/login")
                }
            })
        } else {
            res.redirect("/login")
        }
    })
}
exports.showLogin = function (req, res) {
    res.render('login', {
        title: '登录'
    })
}

//注销
exports.logout = function (req, res) {
    delete req.session.user
    //   delete app.locals.user
    res.redirect("/")
}

exports.del = function (req, res) {
    var id = req.query.id
    if (id) {
        User.remove({_id: id}, function (error, user) {
            if (error) {
                console.log(error)
            } else {
                res.json({success: 1})
            }
        })
    }
}