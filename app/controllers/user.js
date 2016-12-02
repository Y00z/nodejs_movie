/**
 * Created by Yooz on 2016/12/1.
 */
var User = require('../models/user');

//注册
exports.signin =  function (req, res) {
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
}

//用户列表
exports.list =  function (req, res) {
    User.fatch(function (err, users) {
        if (err) console.log(err)
        res.render('userlist', {
            title: '用户列表',
            users: users
        })
    })
}

//登录
exports.login =  function (req, res) {
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
}


//注销
exports.logout = function (req, res) {
    delete req.session.user
 //   delete app.locals.user
    res.redirect("/")
}