/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */

const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users.js')
const Article = require('../models/article.js')
const {secret} = require('../config.js')

class UsersCtl {
    async find(ctx) {
        // a.b; //报500
        // ctx.set('Allow','GET,POST')

        const {per_page = 10} = ctx.query

        // 第几页
        const page = Math.max(ctx.query.page * 1,1) - 1;

        // 每页几项  模糊搜索
        const perPage = Math.max(per_page * 1,1);
        ctx.body = await User
        .find({name: new RegExp(ctx.query.q)})
        .limit(perPage).skip(page * perPage);

    }

    async findById(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // ctx.body = db[ctx.params.id - 0]
        const { fields='' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if(f === 'employments') {
                return 'employments.company employments.job';
            }
            if(f === 'educations') {
                return 'educations.school educations.major'
            }
            return f;
        }).join(' ');
        const user = await User.findById(ctx.params.id).select(selectFields)
        .populate(populateStr)
        console.log(user)
        if(!user) {
            ctx.throw(404,'用户不存在')
        }
        else {
            ctx.body = user;
        }
        // ctx.body = user;
    }

    async create(ctx) {
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: true},
            password: {type: 'string', required: true, select: false},
            age: {type: 'number',required: false}
        })
        const {name} = ctx.request.body;
        const repeatedUser = await User.findOne({name});
        if(repeatedUser) {
            //冲突
            ctx.throw(409,'用户已经存在');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    // 判断是不是操作本人帐号  中间件
    async checkOwner(ctx,next) {
        if(ctx.params.id != ctx.state.user._id) {
            ctx.throw(403,'没有操作权限')
        }
        await next();
    }

    async update(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // 格式校验
        ctx.verifyParams({
            name: {type: 'string',required: false},
            password: {type: 'string', required: false, select: false},
            avatar_url: {type: 'string',required: false},
            background_url: {type: 'string',required: false},
            gender: {type: 'string', required: false},
            headline: {type: 'string', required: false}, 
            locations: {type: 'array',itemType: 'string', required: false},
            business: {type: 'string', required: false},
            employments: {type: 'array',itemType: 'object', required: false},
            eduactions: {type: 'array',itemType: 'object', required: false},
            ownerline: {type: 'string', required: false},
        })
        // db[ctx.params.id - 0] = ctx.request.body
        // ctx.body = ctx.request.body;
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) {
            ctx.throw(404,'用户不存在');
        } 
        else {
            ctx.body = user;
        }
    }

    async delete(ctx) {
        // if(ctx.params.id-0 >= db.length) {
        //     ctx.throw(412,'先决条件失败:id大于等于数组长度');
        // }
        // db.splice(ctx.params.id-0,1)
        // ctx.status = 204;
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user) {
            ctx.throw(404,'用户不存在');
        }
        else {
            ctx.status = 204;
        }
    }

    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string',required: true},
            password: {type: 'string', required: true},
        })
        const user = await User.findOne(ctx.request.body);
        if(!user) {
            ctx.throw(401,'用户名或密码不正确')
        }
        const {_id, name} = user;
        const token = jsonwebtoken.sign({
            _id,name
        }, secret,{expiresIn: '1d'})
        // 一天
        ctx.body = {token};
    }

    // 关注列表
    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user) {
            ctx.throw(404,'用户不存在')
        }
        else {
            ctx.body = user.following;
        }
    }

    // 检查用户存在与否中间件
    async checkUserExist(ctx,next) {
        const user = await User.findById(ctx.params.id);
        if(!user) {
            ctx.throw(404,'用户不存在')
        }
        else {
            await next();
        }
    }


    // 关注用户
    async  follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id)
            me.save();
        }
        ctx.status = 204;
        
    }


    // 取消关注用户
    async  unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if(!index > -1) {
            me.following.splice(index,1)
            me.save();
        }
        ctx.status = 204;
        
    }

    // 粉丝列表
    async listFollowers(ctx) {
        const users = await User.find({following: ctx.params.id});
        ctx.body = users;
    }


    // 关注日记列表
    async listFollowingDiary(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingDiary').populate('followingDiary');
        if(!user) {
            ctx.throw(404,'用户不存在')
        }
        else {
            ctx.body = user.followingDiary;
        }
    }


    // 关注日记
    async  followDiary(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingDiary');
        if(!me.followingDiary.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingDiary.push(ctx.params.id)
            me.save();
        }
        ctx.status = 204;
        
    }


    // 取消关注日记
    async  unfollowDiary(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingDiary');
        const index = me.followingDiary.map(id => id.toString()).indexOf(ctx.params.id);
        if(!index > -1) {
            me.followingDiary.splice(index,1)
            me.save();
        }
        ctx.status = 204;
        
    }

    // 获取文章列表
    async listArticle(ctx) {
        const article = await Article.find({articler: ctx.params.id});
        ctx.body = article;
    }

}

module.exports = new UsersCtl();