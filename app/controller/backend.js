'use strict';

const Controller = require('egg').Controller;
class BackendController extends Controller {
  async index() {
    const { ctx } = this;
    await this.ctx.render('/backend/index');
  }
  async articleList() {
    const { ctx } = this;
    const article = await ctx.model.Article.findAndCountAll({
      offset: 0, // 前端分页组件传来的起始偏移量（pageNum-1）
      limit: 1,//一页显示多少条
      include: {
        model: this.app.model.Cate
      }
    });
    this.ctx.body = article;
  }
  async createArticle() {
    const { ctx } = this;
    let res = await ctx.service.backend.createArticle(ctx.request.body)
    this.ctx.body = res;
  }
  async cateList() {
    const { ctx } = this;
    let cate = await ctx.service.backend.cateList()
    ctx.body = cate;
  }
  async createCate() {
    const { ctx } = this;
    let { name } = ctx.request.body;
    let res = await ctx.service.backend.createCate(name)
    ctx.body = res;
  }
  async tagList() {
    const { ctx } = this;
    let tag = await ctx.service.backend.tagList()
    ctx.body = tag;
  }
  async createTag() {
    const { ctx } = this;
    let { name } = ctx.request.body;
    let res = await ctx.service.backend.createTag(name)
    ctx.body = res;
  }
  async getQiniuToken() {
    const { ctx } = this;
    let result = {
      code: 200,
      data: {},
      msg: '获取token成功'
    };
    let uploadToken = await ctx.service.backend.getQiniuToken()
    result.data.token = uploadToken
    ctx.body = result

  }
}

module.exports = BackendController;
