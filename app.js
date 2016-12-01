/**
 * Created by Yooz on 2016/11/23.
 */

var express = require('express')
var path = require("path")
var morgan = require('morgan')
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
//两个保存会话状态的中间件
var cookieParser = require("cookie-parser")
var cookieSession = require("cookie-session");
//持久化session中间件
const session = require('express-session');
var mongoStore = require("connect-mongo")(session)
var app = express()
var port = process.env.PORT || 3000
var dbUrl = "mongodb://localhost/yooz"
//连接数据库
mongoose.connect(dbUrl);
app.use(cookieParser())
app.use(cookieSession({
    secret: 'yooz',
    // 持久化session
    store: new mongoStore({
        url: dbUrl,
        collection: "sessions",
        resave: false,
        saveUninitialized: true
    })
}))
app.set("views", './views/pages')     //设置视图根目录
app.set('view engine', 'jade') //设置视图的模版引擎
// app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var moment = require("moment");
app.listen(port);
console.log("成功启动:" + port)



//在开发环境的时候
if("development" === app.get('env')){
    //在控制台输出信息
    app.set('showStackError' , true);
    //想看到的信息， 请求的类型， 请求的url路径，   请求的状态。
    app.use(morgan(':method :url :status'))
    //格式化代码。
    app.locals.pretty = true
    mongoose.set('debug',true)
}

//需要放在最后面
//导入路由，传入app
require('./config/routes')(app)

