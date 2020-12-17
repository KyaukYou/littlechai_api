/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */

const User = require('../models/users.js')

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
            age: {type: 'number',required: false}
        })
        // db.push(ctx.request.body);
        // ctx.body = ctx.request.body;
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async update(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: true},
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
}

module.exports = new UsersCtl();