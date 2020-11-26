// miniprogram/pages/eatSearchCookBook/eatSearchCookBook.js
const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealList: []
  },

  onShow: function (options) {
    var mealType = this.data.mealType
    // this.updateMealList(mealType)
    const that = this

    db.collection('lfas_meal').where({
      mealType: mealType
    }).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          mealList: res.data
        })
        that.data.mealList = res.data
        that.data.mealType = mealType
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  changeTabbar(e) {
    var tmpMealType = e.currentTarget.dataset.id
    this.setData({ mealType: tmpMealType })
    console.log('changeTabBar')
    const that = this

    console.log(tmpMealType)
    db.collection('lfas_meal').where({
      mealType: tmpMealType
    }).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          mealList: res.data
        })
        that.data.mealList = res.data
        that.data.mealType = mealType
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  updateMealList(mealType) {
    console.log('run_updateMealList')


  }


})