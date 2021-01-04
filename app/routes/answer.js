/*
 * @Author: LittleChai
 * @Date: 2020-12-04 15:28:57
 * @LastEditTime: 2021-01-04 12:19:13
 */
// const jsonwebtoken = require('jsonwebtoken');
const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/article/:articleId/answer'
});
const {find,findById,create,update,delete:del,checkAnswerExist,checkAnswerer} = require('../controllers/answer.js')

const {secret} = require('../config.js');


//使用中间件替换
const auth = jwt({secret})


// 获得列表
router.get('/', find);

// 创建
router.post('/',auth, create);

// 查询单独
router.get('/:id', findById);

// 修改
router.patch('/:id',auth,checkAnswerExist,checkAnswerer,update);

// 删除 
router.delete('/:id',auth,checkAnswerExist,checkAnswerer,del);





module.exports = router;