// pages/myCookBook/myCookBook.js

const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealTypeList: [[], [], []],
    action: null,
    isBreakFirstRatio: [
      { name: "早餐", value: 'true', checked: 'true' },
      { name: "正餐", value: 'false' },
    ]
  },

  onLoad: function (options) {
    this.updateMealList()
  },

  onReady: function () {

  },

  onShow: function () {

  },

  cookBookAddMeal() {
    // todo
  },
  changeTabbar(){
    // todo
  },
  cookBookCleadOneMeal(){
    // todo
  },

  updateMealList() {
    const that = this
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]

    if (mealList.length > 0) {
      that.setData({
        mealList: mealList,
        mealType: mealType
      })
    } else {
      db.collection('lfas_meal').where({
        mealType: mealType
      }).get({
        success: function (res) {
          that.setData({
            mealList: res.data,
            mealType: mealType
          })
          that.data.mealTypeList[mealType] = res.data
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  }
})