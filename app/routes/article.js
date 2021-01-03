/*
 * @Author: LittleChai
 * @Date: 2020-12-04 15:28:57
 * @LastEditTime: 2020-12-04 16:49:29
 */
// const jsonwebtoken = require('jsonwebtoken');
const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/article'
});
const {find,findById,create,update,delete:del,checkArticleExist,checkArticler} = require('../controllers/article.js')

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
router.patch('/:id',auth,checkArticleExist,checkArticler,update);

// 删除 
router.delete('/:id',auth,checkArticleExist,checkArticler,del);





module.exports = router;