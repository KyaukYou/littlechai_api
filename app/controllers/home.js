/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:41:42
 */
class HomeCtl {
    index(ctx) {
        ctx.body = '这是主页'
    }
}

module.exports = new HomeCtl();