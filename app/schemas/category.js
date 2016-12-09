/**
 * Created by Yooz on 2016/11/24.
 */
//模式


var mongoose = require("mongoose");
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//定义数据库的字段
var CategorySchema = new Schema({
    name : String,
    //一个电影类型里面存放很多和电影，所以是个数组。
    //存放的是Movie里面的id
    movie : [{type:ObjectId,ref:'Movie'}],
    meta : {
        createAt:{
            type:Date,
            default: Date.now()
        },
        updateAt:{
            type:Date,
            default: Date.now()
        }
    }
})


//每存储的时候，都会调用一次这个方法。
CategorySchema.pre('save',function (next) {
    if(this.isNew){ //数据是否新加的。
        this.meta.createAt = this.meta.updateAt = Date.now() //添加的时间，和修改时间，都改成当前时间
    } else{  //数据已经存在，就说明是修改更新数据，那么就只更新修改时间
        this.meta.updateAt = Date.now()
    }
    //执行该方法后，存储过程才会走下去。
    next();
})

CategorySchema.statics = {
    //查询所有
    fatch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')   //排序
            .exec(cb)
    },
    //通过id查询
    findByid: function ( id,cb) {
        return this
            .findOne({"_id":id})
            .exec(cb)
    },
}


module.exports = CategorySchema