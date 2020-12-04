/*
 * @Descripttion: typeScript
 * @version: 1.0.0
 * @Author: LittleChai
 * @Date: 2020-11-27 10:14:30
 * @LastEditors: LittleChai
 * @LastEditTime: 2020-12-01 14:42:23
 */
 const Koa = require('koa');
 const Router = require('koa-router');
 const app = new Koa();
 const router = new Router();


 const auth = async (ctx,next) => {
    if(ctx.url !== '/users') {
       ctx.throw(401) 
    }    
    await next()   
 }

//  前缀方法
 const userRouter = new Router({
     prefix: '/users'
 })   



 router.get('/', (ctx) => {
     ctx.body = '这是主页'
 })

 userRouter.get('/', auth, (ctx) => {
     ctx.body = '这是用户列表'
 })

 userRouter.post('/', auth, (ctx) => {
    ctx.body = '这是创建用户'
})

userRouter.get('/:id', auth, (ctx) => {
    ctx.body = `这是用户 ${ctx.params.id}`
})

 app.use(router.routes());
 app.use(userRouter.routes());
 app.use(userRouter.allowedMethods())

//  app.use(async (ctx, next) => {
//     await next();
//     console.log(1)
//     ctx.body = 'hello world'       
//  })

//  app.use(async (ctx) => {
//      console.log(2)
//  })

// app.use(async (ctx) => {

//     // url判断
//     if(ctx.url === '/') {
//         ctx.body = '这是主页'        
//     }
//     else if(ctx.url === '/users') {

//         //请求类型判断
//         if(ctx.method === 'GET') {
//             ctx.body = '这是一个用户列表页'        
//         }
//         else if(ctx.method === 'POST'){
//             ctx.body = '这是创建用户'
//         }
//         else {
//             ctx.status = 405;
//         }
        
//     }
//     else if(ctx.url.match(/\/users\/\w+/)) {
//         const userId = ctx.url.match(/\/users\/(\w+)/)[1];
//         ctx.body = `这是用户userId----${userId}`        
//     }
//     else {
//         ctx.status = 404;
//     }
// })

 app.listen(3030);