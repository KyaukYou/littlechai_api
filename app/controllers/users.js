/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */

const db = [
    {
        name: '柴犬'
    },
    {
        name: '柴犬1'
    },
]

class UsersCtl {
    find(ctx) {
        // a.b; //报500
        ctx.set('Allow','GET,POST')
        ctx.body = db;
    }

    findById(ctx) {
        if(ctx.params.id-0 >= db.length) {
            ctx.throw(412,'先决条件失败:id大于等于数组长度');
        }
        ctx.body = db[ctx.params.id - 0]
    }

    create(ctx) {
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: true},
            age: {type: 'number',required: false}
        })
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update(ctx) {
        if(ctx.params.id-0 >= db.length) {
            ctx.throw(412,'先决条件失败:id大于等于数组长度');
        }
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: true},
            age: {type: 'number',required: false}
        })
        db[ctx.params.id - 0] = ctx.request.body
        ctx.body = ctx.request.body;
    }

    delete(ctx) {
        if(ctx.params.id-0 >= db.length) {
            ctx.throw(412,'先决条件失败:id大于等于数组长度');
        }
        db.splice(ctx.params.id-0,1)
        ctx.status = 204;
    }
}

module.exports = new UsersCtl();