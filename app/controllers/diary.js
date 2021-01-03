/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:37:43
 * @LastEditTime: 2020-12-04 16:47:04
 */
const Diary = require('../models/diary.js')
const User = require('../models/users.js')
const Article = require('../models/article.js')

class DiaryCtl {

    async find(ctx) {
        const {per_page = 10} = ctx.query

        // 第几页
        const page = Math.max(ctx.query.page * 1,1) - 1;

        // 每页几项
        const perPage = Math.max(per_page * 1,1);
        ctx.body = await Diary
        .find({name: new RegExp(ctx.query.q)})
        .limit(perPage).skip(page * perPage);
    }
    
    async checkDiaryExist(ctx,next) {
        const diary = await Diary.findById(ctx.params.id);
        if(!diary) {
            ctx.throw(404,'日记不存在')
        }
        else {
            await next();
        }
    }

    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const diary = await Diary.findById(ctx.params.id).select(selectFields);
        ctx.body = diary;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });
        const diary = await new Diary(ctx.request.body).save();
        ctx.body = diary;
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });
        const diary = await Diary.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = diary;
    }

    // 获取日记粉丝列表
    async listDiaryFollowers(ctx) {
        const users = await User.find({followingDiary: ctx.params.id});
        ctx.body = users;
    }

    //列出文章
    async listArticle(ctx) {
        const article = await Article.find({
            diary: ctx.params.id
        })
        ctx.body = article;
    }

}

module.exports = new DiaryCtl(); 