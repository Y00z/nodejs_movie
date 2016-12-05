/**
 * Created by Yooz on 2016/11/24.
 */
//模式
var mongoose = require("mongoose")
//密码加盐
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10

//定义数据库的字段
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,     //唯一的
        type: String
    },
    password: String,
    // 0: nomal user
    // 1: verified user
    // 2: professonal user
    // >10: admin
    // >50: super admin
    role : {            //用户权限
        type:Number,
        default : 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//密码比较
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        //把穿进来的密码，和当前数据库中的密码比较
        bcrypt.compare(_password,this.password ,function (err,isMatch) {
            //如果有错误，把错误放到回调方法中返回。
            if(err) return cb(err)
            //如果没有错误，就把错误设置成null，并且把比较结果返回
            cb(null,isMatch)
        })
    }
}


//每存储的时候，都会调用一次这个方法。
UserSchema.pre('save', function (next) {
    var user = this
    if (this.isNew) { //数据是否新加的。
        this.meta.createAt = this.meta.updateAt = Date.now() //添加的时间，和修改时间，都改成当前时间
    } else {  //数据已经存在，就说明是修改更新数据，那么就只更新修改时间
        this.meta.updateAt = Date.now()
    }

    //生成随机的盐
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
    //执行该方法后，存储过程才会走下去。
    // next();
})

UserSchema.statics = {
    //查询所有
    fatch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')   //排序
            .exec(cb)
    },
    //通过id查询
    findByid: function (id, cb) {
        return this
            .findOne({"_id": id})
            .exec(cb)
    },
}


module.exports = UserSchema