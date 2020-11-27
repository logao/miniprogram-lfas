// miniprogram/pages/eatSearchCookBook/eatSearchCookBook.js
const db = wx.cloud.database()

Page({
  data: {
    mealType: 0,
    mealTypeList: [[], [], []],
    action: null
  },

  // todo: need to filter choosed meal in the menu
  onShow: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    eventChannel.on('addOneMeal', function (data) {
      // console.log(data)
      that.data.action = 'addOneMeal'
      that.data.menuId = data.menuId
    })
    this.updateMealList()
  },
  changeTabbar(e) {
    this.data.mealType = parseInt(e.currentTarget.dataset.id) // 赋值后记录会变成 string
    this.updateMealList()
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

    // eventChannel.on('addOneMeal', function (data) {
    //   console.log(data)
    // })

  },

  updateMealList() {
    console.log('run_updateMealList')
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