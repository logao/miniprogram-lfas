// pages/myCookBook/myCookBook.js

const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealTypeList: [[], [], []],
    action: null,
    isBreakfirstRatio: [
      { name: "早餐", value: true },
      { name: "正餐", value: false },
    ],
    isBreakfirst: false
  },

  onLoad: function (options) {
    this.updateMealList()
  },

  isBreakfirstRadioChange(e) {
    console.log(e)
    var isBreakfirst = this.data.isBreakfirst
    this.setData({ isBreakfirst: !isBreakfirst })
    this.updateMealList()
  },

  cookBookAddMeal() {
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

  cookBookEditMeal(e) {
    const mealId = e.currentTarget.dataset.mealId
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]
    const meal = mealList.find(meal => meal._id == mealId)

    wx.navigateTo({
      url: '/pages/cookBookMealDetail/cookBookMealDetail',
      success(res) {
        res.eventChannel.emit('cookBookEditMeal', {
          data: {
            operation: 'Edit',
            meal: meal
          }
        })
      }
    })
  },


  changeTabbar(e) {
    this.data.mealType = parseInt(e.currentTarget.dataset.id) // 赋值后记录会变成 string
    this.updateMealList()
  },
  cookBookCleaOneMeal(e) {
    const mealId = e.currentTarget.dataset.mealId
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]

    const mealIndex = mealList.findIndex(meal => meal._id == mealId)
    mealList.splice(mealIndex, 1)[0]
    this.mealListShow()
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
      this.mealListShow()
    } else {
      wx.showLoading({
        title: '更新中',
      })
      db.collection('lfas_meal').where({
        mealType: mealType
      }).get({
        success: function (res) {
          // that.setData({
          //   mealList: res.data,
          //   mealType: mealType
          // })
          that.data.mealList = res.data
          that.data.mealType = mealType
          that.data.mealTypeList[mealType] = res.data
          that.mealListShow()
          wx.hideLoading()
        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [sum] 调用失败：', err)
        }
      })
    }
  },

  mealListShow() {
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]
    const isBreakfirst = this.data.isBreakfirst
    const mealListShow = mealList.filter(meal => {
      const ib = typeof (meal.isBreakfirst) == "undefined" ? false : meal.isBreakfirst
      return ib == isBreakfirst
    })
    this.setData({
      mealListShow: mealListShow,
      mealType: mealType
    })
  }
})