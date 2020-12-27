/*
 * @Author: LittleChai
 * @Date: 2020-11-27 10:14:30
 * @LastEditTime: 2020-12-04 16:32:07
 */

 const Koa = require('koa');
 const KoaBady = require('koa-body');
 const KoaStatic = require('koa-static');
 const error = require('koa-json-error');
 const parameter = require('koa-parameter');
 const mongoose = require('mongoose');
 const path = require('path');
 const app = new Koa();
 const routing = require('./routes')   
 const {connectionStr} = require('./config.js')

 mongoose.connect(connectionStr,{ useNewUrlParser: true }, () => {
    console.log('mongoDB 连接成功！')
 })
 mongoose.connection.on('error', console.error)

app.use(KoaStatic(
    path.join(__dirname,'public')
))

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
 app.use(KoaBady({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname,'public/uploads'),
        keepExtensions: true
    }
 }));
 app.use(parameter(app))
 routing(app);

 app.listen(3030, () => {
     console.log('程序运行在3030端口...')
 });