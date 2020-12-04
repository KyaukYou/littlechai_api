/*
 * @Author: LittleChai
 * @Date: 2020-12-04 15:28:57
 * @LastEditTime: 2020-12-04 16:49:29
 */
const Router = require('koa-router');
const router = new Router({
    prefix: '/users'
});
const {find,findById,create,update,delete:del} = require('../controllers/users.js')


// 获得列表
router.get('/', find)

// 创建
router.post('/', create)

// 查询单独
router.get('/:id', findById)

// 修改
router.put('/:id', update)

// 删除
router.delete('/:id', del)

module.exports = router;