/*
 * @Author: LittleChai
 * @Date: 2020-11-27 10:14:30
 * @LastEditTime: 2020-12-04 16:32:07
 */

 const Koa = require('koa');
 const bodyparser = require('koa-bodyparser');
 const error = require('koa-json-error');
 const parameter = require('koa-parameter');
 const app = new Koa();
 const routing = require('./routes')   
 // 鉴权判断
 const auth = async (ctx,next) => {
     if(ctx.url !== '/users') {
         ctx.throw(401)
     }
     await next();
 }


 app.use(async(ctx,next) => {
     try {
         await next();
     }
     catch(err) {
         ctx.status = err.status || err.statusCode || 500;
         ctx.body = {
             message: err.message
         };
     }
 })
 app.use(error({
     postFormat: (err,{stack, ...rest}) => {
        return process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
     }
 }));
 app.use(bodyparser());
 app.use(parameter(app))
 routing(app);

 app.listen(3030, () => {
     console.log('程序运行在3030端口...')
 });