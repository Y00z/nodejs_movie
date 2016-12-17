/**
 * Created by Yooz on 2016/12/1.
 */

var Category = require("../models/category")
var Movie = require('../models/movie')

// //如果匹配到了根目录，那么就跳到了视图中的index文件
// //并且传递title:首页 这个值过去。
// exports.index =  function (req, res) {
//     //输出保存状态的用户。
//     if (req.session.user)
//         console.log("登录了")
//     else
//         console.log("没登录")
//
//     Movie.fatch(function (err, movies) {
//         if (err) console.log(err)
//         Category.fatch(function (err, categorys) {
//             res.render('index', {
//                 title: '首页',
//                 movies: movies,
//                 categorys:categorys
//             })
//         })
//     })
// }
exports.index = function (req, res) {
    Category
        .find({})
        //让categoty同时具有movie(个人理解)
        .populate({path: 'movie', select: 'title poster', options: {limit: 8}})
        .exec(function (err, categorys) {
            if (err) console.log(err)
            console.log(categorys)
            res.render('index', {
                title: '首页',
                categorys: categorys
            })
        })
}


exports.search = function (req, res) {
    var catId = req.query.cat
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 2
    var index = page * count
    if (catId) {
        Category
            .find({_id: catId})
            //让categoty同时具有movie(个人理解), 查找出类型中limit2,skip: index 的电影，每页只显示2部
            .populate({path: 'movie', select: 'title poster'})
            .exec(function (err, categorys) {
                if (err) console.log(err)
                //取categorys数组中的角标0对象，如果没有就是{}空
                var category = categorys[0] || {}
                var movies = category.movie || []
                //截取数组中的index  到 index + count  位中的对象。
                var results = movies.slice(index, index + count)
                res.render('results', {
                    title: 'yooz 结果列表页面',
                    keyword: category.name,
                    movies: results,
                    totalPage: Math.ceil(movies.length / count),
                    query: 'cat=' + catId,
                    currentPage: (page + 1)
                })
            })
    } else {
        Movie.find({title: new RegExp(q+'.*','i')}, function (err, movies) {
            if (err) console.log(err)
            var results = movies.slice(index, index + count)
            res.render('results', {
                title: 'yooz 结果列表页面',
                keyword: q,
                currentPage: (page + 1),
                totalPage: Math.ceil(movies.length / count),
                query : "q=" +q,
                movies: results
            })
        })
    }
}