/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2021-01-04 12:13:49
 */
const Answer = require('../models/answer.js')
const User = require('../models/users.js')

class AnswerCtl {

    async find(ctx) {
        const {per_page = 10} = ctx.query

        // 第几页
        const page = Math.max(ctx.query.page * 1,1) - 1;

        // 每页几项
        const perPage = Math.max(per_page * 1,1);
        const q = new RegExp(ctx.query.q);

        ctx.body = await Answer
        .find({$or: [{content: q},{articleId: ctx.params.articleId}]})
        .limit(perPage).skip(page * perPage);
    }
    
    async checkAnswerExist(ctx,next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if(!answer) {
            ctx.throw(404,'答案不存在')
        }
        else {
            //只有在删改查答案的时候，才检查逻辑，赞和踩答案的时候不检查
            if(ctx.params.articleId && answer.articleId !== ctx.params.articleId) {
                ctx.throw(404,'该问题下没有此答案')
            }
            else {
                ctx.state.answer = answer;
                await next();
            }
            
        }
    }

    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }

    async create(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: true}
        });
        const answerer = ctx.state.user._id;
        const {articleId} = ctx.params
        const answer = await new Answer({...ctx.request.body, answerer, articleId}).save();
        ctx.body = answer;
    }

    async checkAnswerer(ctx,next) {
        const {answer} = ctx.state;
        if(answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403,'没有权限')
        }
        else {
            await next();
        }
    }

    async update(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: true},
        });
        await ctx.state.answer.update(ctx.request.body);
        ctx.body = ctx.state.answer;
    }

    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    // 获取日记粉丝列表
    async listAnswerFollowers(ctx) {
        const users = await User.find({followingAnswer: ctx.params.id});
        ctx.body = users;
    }

}

module.exports = new AnswerCtl(); 