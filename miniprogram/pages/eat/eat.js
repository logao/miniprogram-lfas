// miniprogram/pages/eat/eat.js

const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    mealTypeName: ['荤菜', '素菜', '主食'],
    menuOneDay: {
      menuDateTime: new Date(app.globalData.pickDateTime),
      chefMemberRole: '爷爷',
      menuList: []
    },
    pickDate: util.formatTime(app.globalData.pickDateTime, 'Y-M-D'),
    index: 0
  },


  onLoad: function (options) {
    this.getMenuOneDay(util.formatTime(app.globalData.pickDateTime, 'Y-M-D'))
  },

  changePickDate(e) {
    let newPickDate = e.detail.value
    this.setData({ pickDate: newPickDate });
    app.globalData.pickDateTime = new Date(newPickDate)
    this.getMenuOneDay(newPickDate)

  },
  changeTabbar(e) {
    this.setData({ index: e.currentTarget.dataset.id })
    console.log(this.data.index)
  },


  randomMenuList(e) {
    this.getMenuOneDay(util.formatTime(app.globalData.pickDateTime, 'Y-M-D'), true)
    console.log('random')
  },

  clearMeal(e) {
    const clearMenuId = e.currentTarget.dataset.clearMenuId
    const clearMealType = e.currentTarget.dataset.clearMealType
    const clearMealId = e.currentTarget.dataset.clearMealId

    var menuList = this.data.menuOneDay.menuList

    var menuIndex = menuList.findIndex(menu => menu._id == clearMenuId)
    var mealIndex = menuList[menuIndex].menuMealList[clearMealType].mealList.findIndex(meal => meal._id == clearMealId)

    // 删除 this.data 中存储的 meal
    menuList[menuIndex].menuMealList[clearMealType].mealList.splice(mealIndex, 1)[0];

    // 删除 page 中展示的 meal（更新页面）
    this.setData({ menuOneDay: this.data.menuOneDay })

    // 删除 数据库中 存储的 meal
    wx.cloud.callFunction({
      name: 'deleteMenuMeal',
      data: {
        menuId: clearMenuId,
        mealId: clearMealId,
        mealType: clearMealType
      }
    })
  },

  getMenuOneDay(pickDate, doDelete) {
    console.log("pickDate: " + pickDate)
    console.log("doDelete: " + doDelete || false)

    wx.cloud.callFunction({
      name: 'getMenuOneDay',
      data: {
        pickDate: pickDate,
        doDelete: doDelete || false
      },
      success: res => {
        console.log(res.result)
        this.data.menuOneDay.menuList = res.result
        this.data.menuOneDay.menuList.sort(util.compare('menuType'))
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