/*
 * @Author: LittleChai
 * @Date: 2020-12-04 15:28:57
 * @LastEditTime: 2020-12-04 16:41:04
 */
const Router = require('koa-router');
const router = new Router();
const { index,upload } = require('../controllers/home.js')

router.get('/', index)
router.post('/upload',upload)

module.exports = router;