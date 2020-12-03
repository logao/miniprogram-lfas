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

  cookBookAddMeal() {
    const self = this
    wx.navigateTo({
      url: '/pages/cookBookMealDetail/cookBookMealDetail',
      success(res) {
        res.eventChannel.emit('cookBookAddMeal', {
          data: {
            operation: 'add'
          }
        })
      }
    })
  },
  changeTabbar(e) {
    this.data.mealType = parseInt(e.currentTarget.dataset.id) // 赋值后记录会变成 string
    console.log(this.data.mealType)
    this.updateMealList()
  },
  cookBookCleaOneMeal(e) {
    // todo
    const mealId = e.currentTarget.dataset.mealId
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]

    const mealIndex = mealList.findIndex(meal => meal._id == mealId)
    mealList.splice(mealIndex, 1)[0]
    this.setData({ mealList: mealList })
    wx.cloud.callFunction({// 删除 数据库中 存储的 meal
      name: 'crudMeal',
      data: {
        operation: 'delete',
        mealId: mealId
      }
    })

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