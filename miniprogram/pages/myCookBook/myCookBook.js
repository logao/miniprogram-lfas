// pages/myCookBook/myCookBook.js

const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealTypeList: [[], [], []],
    mealListShow: [],
    isBreakfirstRadio: [
      { name: "早餐", value: true },
      { name: "正餐", value: false },
    ],
    isBreakfirst: false
  },

  onLoad: function (options) {
    this.updateMealList()
  },
  onReachBottom() {
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
            operation: 'edit',
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
    const self = this
    const mealType = this.data.mealType
    const isBreakfirst = this.data.isBreakfirst
    
    this.mealListShow()
    const oldMealList = this.data.mealListShow

    wx.showLoading({
      title: '更新中',
    })

    db.collection('lfas_meal').where({
      mealType: mealType,
      isBreakfirst: isBreakfirst
    }).skip(oldMealList.length).limit(10).get().then(
      res => {
        self.data.mealTypeList[mealType] = oldMealList.concat(res.data)
        // mealList = res.data
        self.mealListShow()
        wx.hideLoading()
      }
    )
  },

  mealListShow() {
    const mealType = this.data.mealType
    const mealList = this.data.mealTypeList[mealType]
    const isBreakfirst = this.data.isBreakfirst
    // const mealListShow = mealList.filter(meal => {
    //   const ib = typeof (meal.isBreakfirst) == "undefined" ? false : meal.isBreakfirst
    //   return ib == isBreakfirst
    // })
    const mealListShow = mealList.filter(meal=> meal.isBreakfirst == isBreakfirst)
    this.setData({
      mealListShow: mealListShow,
      mealType: mealType
    })
  }
})