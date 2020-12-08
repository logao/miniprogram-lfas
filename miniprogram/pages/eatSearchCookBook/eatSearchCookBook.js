// miniprogram/pages/eatSearchCookBook/eatSearchCookBook.js
const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealTypeList: [[], [], []],
    mealListShow: [],
    action: null,
    isBreakfirstRadio: [
      { name: "早餐", value: true },
      { name: "正餐", value: false },
    ],
    isBreakfirst: false
  },


  // todo: need to filter choosed meal in the menu
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    const self = this
    eventChannel.on('addOneMeal', function (data) {
      self.data.action = 'addOneMeal'
      self.data.menuId = data.menuId
    })
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

  changeTabbar(e) {
    this.data.mealType = parseInt(e.currentTarget.dataset.id) // 赋值后记录会变成 string
    this.updateMealList()
  },

  
  viewMeal(e) {
    const mealType = e.currentTarget.dataset.mealType
    const mealId = e.currentTarget.dataset.mealId
    const meal = this.data.mealTypeList[mealType].filter(meal => meal._id == mealId)[0]

    wx.navigateTo({
      url: '/pages/cookBookMealDetail/cookBookMealDetail',
      success(res) {
        res.eventChannel.emit('viewMeal', {
          data: {
            operation: 'view',
            meal: meal
          }
        })
      }
    })
  },

  chooseOneMeal(e) {
    var mealId = e.currentTarget.dataset.mealId
    var mealType = parseInt(e.currentTarget.dataset.mealType)
    const choosedMeal = this.data.mealTypeList[mealType].filter(meal => meal._id == mealId)[0]
    const eventChannel = this.getOpenerEventChannel()

    if (this.data.action == 'addOneMeal') {
      wx.navigateBack({
        delta: 1,
        success: function (res) {
          eventChannel.emit('chooseOneMeal', {
            data: {
              meal: choosedMeal
            }
          })
        }
      })
    }
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
    const mealListShow = mealList.filter(meal => meal.isBreakfirst == isBreakfirst)
    this.setData({
      mealListShow: mealListShow,
      mealType: mealType
    })
  }


})