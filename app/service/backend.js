const Service = require('egg').Service;
const qiniu = require('qiniu')
const moment = require('moment')
class BackendService extends Service {
  async cateList() {
    const { ctx } = this
    let result = await ctx.model.Cate.findAll({
      where: {
        status: 1
      },
      order: [
        ['updated_at', 'desc']
      ],
      attributes: ['id', 'name']
    });
    if (!result.length) {
      return {
        code: 201,
        msg: '分类为空',
        data: {},
      }
    }
    return {
      code: 200,
      msg: '操作成功',
      data: result,
    }
  }
  async createArticle({ title,cate_id,tags_group,html}) {
    const { ctx } = this
    if(!cate_id){
      cate_id=null
    }
    let dateNow=new moment();
    let result = await ctx.model.Article.create({
      title,
      content:html,
      cate_id,
      tags_group,
      status:1,
      view_num:0,
      created_at:dateNow,
      updated_at:dateNow
    });
    console.log(result)
    return {
      code: 200,
      msg: '操作成功',
      data: result,
    }
  }
  async createCate(name) {
    const { ctx } = this
    let result = await ctx.model.Cate.findOrCreate({ where: { name } })
    if (result[1] === true) {
      //不存在，创建成功
      return {
        code: 200,
        data: {},
        msg: "创建成功"
      }
    }
    else {
      //存在
      return {
        code: 201,
        data: {},
        msg: "分类已存在"
      }
    }
  }
  async tagList() {
    const { ctx } = this
    let result = await ctx.model.Tag.findAll({
      where: {
        status: 1
      },
      order: [
        ['updated_at', 'desc']
      ],
      attributes: ['id', 'name']
    });
    if (!result.length) {
      return {
        code: 201,
        msg: '标签为空',
        data: {},
      }
    }
    return {
      code: 200,
      msg: '操作成功',
      data: result,
    }
  }
  async createTag(name) {
    const { ctx } = this
    let result = await ctx.model.Tag.findOrCreate({ where: { name } })
    if (result[1] === true) {
      //不存在，创建成功
      return {
        code: 200,
        data: {},
        msg: "创建成功"
      }
    }
    else {
      //存在
      return {
        code: 201,
        data: {},
        msg: "标签已存在"
      }
    }
  }
  // 生成七牛token
  async getQiniuToken() {
    const { app } = this
    // 这里需要七牛的Access Key和Secret Key
    let mac = new qiniu.auth.digest.Mac(app.config.qiniu.ak, app.config.qiniu.sk);
    let options = {
      scope: 'lizhi0128',
      expires: 7200//2小时过期
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    return uploadToken
  }
}
module.exports = BackendService
