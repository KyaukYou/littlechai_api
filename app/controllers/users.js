/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */

const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users.js')
const {secret} = require('../config.js')

class UsersCtl {
    async find(ctx) {
        // a.b; //报500
        ctx.set('Allow','GET,POST')
        const user =  await User.find();
        ctx.body = user;
        // console.log(user)
    }

    async findById(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // ctx.body = db[ctx.params.id - 0]
        const user = await User.findById(ctx.params.id)
        console.log(user)
        if(!user) {
            ctx.throw(404,'用户不存在')
        }
        else {
            ctx.body = user;
        }
        // ctx.body = user;
    }

    async create(ctx) {
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: true},
            password: {type: 'string', required: true, select: false},
            age: {type: 'number',required: false}
        })
        const {name} = ctx.request.body;
        const repeatedUser = await User.findOne({name});
        if(repeatedUser) {
            //冲突
            ctx.throw(409,'用户已经存在');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    // 判断是不是操作本人帐号
    async checkOwner(ctx,next) {
        if(ctx.params.id != ctx.state.user._id) {
            ctx.throw(403,'没有操作权限')
        }
        await next();
    }

    async update(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: false},
            password: {type: 'string', required: false, select: false},
            age: {type: 'number',required: false}
        })
        // db[ctx.params.id - 0] = ctx.request.body
        // ctx.body = ctx.request.body;
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) {
            ctx.throw(404,'用户不存在');
        } 
        else {
            ctx.body = user;
        }
    }

    async delete(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // db.splice(ctx.params.id-0,1)
        // ctx.status = 204;
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user) {
            ctx.throw(404,'用户不存在');
        }
        else {
            ctx.status = 204;
        }
    }

    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string',required: true},
            password: {type: 'string', required: true},
        })
        const user = await User.findOne(ctx.request.body);
        if(!user) {
            ctx.throw(401,'用户名或密码不正确')
        }
        const {_id, name} = user;
        const token = jsonwebtoken.sign({
            _id,name
        }, secret,{expiresIn: '1d'})
        // 一天
        ctx.body = {token};
    }
}

module.exports = new UsersCtl();