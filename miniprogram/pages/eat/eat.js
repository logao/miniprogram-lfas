// miniprogram/pages/eat/eat.js

const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    mealTypeName: ['荤菜', '素菜', '主食'],
    menuOneDay: {
      menuDateTime: new Date(app.globalData.pickDate),
      chefMemberRole: '爷爷',
      menuList: []
    },
    date: util.formatTime(app.globalData.pickDate, 'Y-M-D'),
    index: 0
  },


  onLoad: function (options) {
    // const db = wx.cloud.database()
    // const menus = db.collection('lfas_menu')
    // const menu = menus.doc('test_cloud_data_conn')
    // console.log(this.data.menuOneDay.menuDateTime)
    // const aa = util.formatTime(this.data.menuOneDay.menuDateTime, 'Y-M-D')
    this.data.menuOneDay.menuList.sort(util.compare('menuType'))

    wx.cloud.callFunction({
      name: 'getMenuOneDay',
      data: {
        pickDate: util.formatTime(new Date(), 'Y-M-D')
      },
      success: res => {
        console.log(res.result.data)
        this.data.menuOneDay.menuList = res.result.data
        this.setData({ menuOneDay: this.data.menuOneDay })
        wx.showToast({
          title: '调用成功'
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

  changeDate(e) {
    let chDate = e.detail.value
    this.setData({ date: chDate });
  },
  changeTabbar(e) {
    this.setData({ index: e.currentTarget.dataset.id })
    console.log(this.data.index)
  },
  cloudTest(e) {
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('lfas_menu').where({
      publishInfo: {
        country: 'United States'
      }
    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
      }
    })
  }
})