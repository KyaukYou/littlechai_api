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
        ctx.set('Allow','GET,POST')
        ctx.body = db;
    }

    findById(ctx) {
        ctx.body = db[ctx.params.id - 0]
    }

    create(ctx) {
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update(ctx) {
        db[ctx.params.id - 0] = ctx.request.body
        ctx.body = ctx.request.body;
    }

    delete(ctx) {
        db.splice(ctx.params.id-0,1)
        ctx.status = 204;
    }
}

module.exports = new UsersCtl();