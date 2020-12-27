/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:41:42
 */
const path = require('path');
class HomeCtl {
    index(ctx) {
        ctx.body = '这是主页'
    };

    upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);
        ctx.body = {
            url: `${ctx.origin}/uploads/${basename}`
        }
        // ctx.body = ctx.request.files
    }
}

module.exports = new HomeCtl();