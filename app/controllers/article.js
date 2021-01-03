/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */
const Article = require('../models/article.js')
const User = require('../models/users.js')

class ArticleCtl {

    async find(ctx) {
        const {per_page = 10} = ctx.query

        // 第几页
        const page = Math.max(ctx.query.page * 1,1) - 1;

        // 每页几项
        const perPage = Math.max(per_page * 1,1);
        const q = new RegExp(ctx.query.q);

        ctx.body = await Article
        .find({$or: [{title: q},{description: q}]})
        .limit(perPage).skip(page * perPage);
    }
    
    async checkArticleExist(ctx,next) {
        const article = await Article.findById(ctx.params.id).select('+articler');
        if(!article) {
            ctx.throw(404,'文章不存在')
        }
        else {
            ctx.state.article = article;
            await next();
        }
    }

    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const article = await Article.findById(ctx.params.id).select(selectFields).populate('articler diary');
        ctx.body = article;
    }

    async create(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string',required: false},
            avatar_url: {type: 'string', required: false}
        });
        console.log(ctx.state)
        const article = await new Article({...ctx.request.body, articler: ctx.state.user._id}).save();
        ctx.body = article;
    }

    async checkArticler(ctx,next) {
        const {article} = ctx.state;
        if(article.articler.toString() !== ctx.state.user._id) {
            ctx.throw(403,'没有权限')
        }
        else {
            await next();
        }
    }

    async update(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string',required: false},
            avatar_url: {type: 'string', required: false}
        });
        await ctx.state.article.update(ctx.request.body);
        ctx.body = ctx.state.article;
    }

    async delete(ctx) {
        await Article.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    // 获取日记粉丝列表
    async listArticleFollowers(ctx) {
        const users = await User.find({followingArticle: ctx.params.id});
        ctx.body = users;
    }

}

module.exports = new ArticleCtl(); 