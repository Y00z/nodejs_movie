/**
 * Created by Yooz on 2016/12/8.
 */
var Category = require('../models/category')

exports.add = function (req, res) {
    res.render('category', {
        title: '添加分类',
        category: {}
    })
}
exports.list = function (req, res) {
    Category.fatch(function (err, categorys) {
        res.render('categorylist',{
            title:'分类列表',
            categorys:categorys
        })
    })
}
exports.save = function (req, res) {
    // var _category = req.body.category
    // console.log("_category")
    // console.log(_category)
    // Category.findOne({name: _category.name}, function (err, category) {
    //     console.log("category")
    //     console.log(category)
    //     if (err) return console.log(err)
    //     if (category) {
    //         return res.redirect("/admin/category")
    //     }
    //     var mCategory = new Category(_category)
    //     mCategory.save(function (err, category) {
    //         if (err) return console.log(err)
    //         res.redirect("/admin/category/list")
    //     })
    // })

    var _category = req.body.category
    console.log(_category)
    var category = new Category(_category)
    category.save(function (err, category) {
        if (err) console.log(err)
        res.redirect("/admin/category/list")
    })
}