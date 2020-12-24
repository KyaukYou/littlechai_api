/*
 * @Author: LittleChai
 * @Date: 2020-12-04 15:28:57
 * @LastEditTime: 2020-12-04 16:49:29
 */
// const jsonwebtoken = require('jsonwebtoken');
const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/users'
});
const {find,findById,create,update,delete:del,login,checkOwner} = require('../controllers/users.js')

const {secret} = require('../config.js');

// 认证token
// const auth = async(ctx, next)=> {
//     const { authorization = '' } = ctx.request.header;
//     const token = authorization.replace('Bearer ','');
//     try {
//         const user = jsonwebtoken.verify(token,secret);
//         ctx.state.user = user;
//     }
//     catch(err) {
//         ctx.throw(401,err.message);
//     }    
//     await next();
// }

//使用中间件替换
const auth = jwt({secret})


// 获得列表
router.get('/', find)

// 创建
router.post('/', create)

// 查询单独
router.get('/:id', findById)

// 修改
router.patch('/:id',auth,checkOwner,update)

// 删除
router.delete('/:id',auth,checkOwner,del)

// 登录
router.post('/login', login)

module.exports = router;