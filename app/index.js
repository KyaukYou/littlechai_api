/*
 * @Author: LittleChai
 * @Date: 2020-11-27 10:14:30
 * @LastEditTime: 2020-12-04 16:32:07
 */

 const Koa = require('koa');
 const bodyparser = require('koa-bodyparser');
 const app = new Koa();
 const routing = require('./routes')   
 // 鉴权判断
 const auth = async (ctx,next) => {
     if(ctx.url !== '/users') {
         ctx.throw(401)
     }
     await next();
 }

 app.use(bodyparser());
 routing(app);

 app.listen(3030, () => {
     console.log('程序运行在3030端口...')
 });