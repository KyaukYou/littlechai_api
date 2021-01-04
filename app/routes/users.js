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
const {
    find,findById,create,update,delete:del,login,checkOwner,listFollowing,follow,unfollow,listFollowers,checkUserExist,followDiary,unfollowDiary,listFollowingDiary,listArticle,
    listLikingAnswers,listDislikingAnswers,likeAnswer,unlikeAnswer,dislikeAnswer,undislikeAnswer,
    listCollectingAnswers,collectAnswer,unCollectAnswer
} = require('../controllers/users.js')
const {checkDiaryExist} = require('../controllers/diary.js')
const {checkAnswerExist} = require('../controllers/answer.js')

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
router.get('/', find);

// 创建
router.post('/', create);

// 查询单独
router.get('/:id', findById);

// 修改
router.patch('/:id',auth,checkOwner,update);

// 删除 
router.delete('/:id',auth,checkOwner,del);

// 登录
router.post('/login', login);

//获取用户关注列表
router.get('/:id/following', listFollowing);

//获取粉丝列表
router.get('/:id/follower', listFollowers);

// 关注用户
router.put('/following/:id', auth,checkUserExist, follow)

// 取消关注用户
router.delete('/following/:id', auth,checkUserExist, unfollow)


// 关注日记
router.put('/followingDiary/:id', auth,checkDiaryExist, followDiary)

// 取消关注日记
router.delete('/followingDiary/:id', auth,checkDiaryExist, unfollowDiary)

//获取用户关注日记列表
router.get('/:id/followingDiary', listFollowingDiary);

//获取用户文章列表
router.get('/:id/article', listArticle);


//获取用户喜欢的答案列表
router.get('/:id/likingAnswers', listLikingAnswers);

// 点赞答案
router.put('/likingAnswers/:id', auth,checkAnswerExist, likeAnswer,undislikeAnswer)

// 取消点赞答案
router.delete('/likingAnswers/:id', auth,checkAnswerExist, unlikeAnswer)

//获取用户踩的答案列表
router.get('/:id/dislikingAnswers', listDislikingAnswers);

// 踩答案
router.put('/dislikingAnswers/:id', auth,checkAnswerExist, dislikeAnswer,unlikeAnswer)

// 取消踩答案
router.delete('/dislikingAnswers/:id', auth,checkAnswerExist, undislikeAnswer)


//获取用户收藏的答案列表
router.get('/:id/collectingAnswers', listCollectingAnswers);

// 收藏答案
router.put('/collectingAnswers/:id', auth,checkAnswerExist, collectAnswer)

// 取消收藏答案
router.delete('/collectingAnswers/:id', auth,checkAnswerExist, unCollectAnswer)


module.exports = router;