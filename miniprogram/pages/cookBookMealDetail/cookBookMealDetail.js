// miniprogram/pages/cookBookMealDetail/cookBookMealDetail.js

const db = wx.cloud.database()

Page({
  data: {
    operation: '',
    mealTypeRadio: [
      { name: "荤菜", value: 0 },
      { name: "素菜", value: 1 },
      { name: "主食", value: 2 },
    ],
    localMealPhotoPath: '/images/icons/upload-meal-pic-default.png',
    mealDesc: '',
    mealName: '',
    mealWeightNum: 5,
    disabled1: false,
    disabled2: false,
    mealType: 2
  },
  onLoad: function (options) {
    console.log('onload', (new Date()).valueOf())
    const eventChannel = this.getOpenerEventChannel()
    const self = this
    eventChannel.on('cookBookAddMeal', function (data) {
      self.data.operation = data.operation
    })
    this.setData({ operation: 'add' })
  },
  choosePhoto() {
    var that = this
    wx.chooseImage({
      count: 1,
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({ localMealPhotoPath: tempFilePaths[0] });
      }
    })
  },

  inputMealName(e) {
    this.setData({ mealName: e.detail.value.trim() });
  },
  isBreakfirstChange(e) {
    this.setData({ isBreakfirst: e.detail.value })
  },
  mealTypeChange(e) {
    this.setData({ mealType: e.detail.value })
  },
  mealWeightNumNextNum(e) {
    this.data.mealWeightNum = this.data.mealWeightNum < 1 ? 0 : this.data.mealWeightNum - 1
    this.setData({
      mealWeightNum: this.data.mealWeightNum,
      disabled1: this.data.mealWeightNum !== 0 ? false : true,
      disabled2: this.data.mealWeightNum !== 10 ? false : true

    });
  },
  mealWeightNumPreNum(e) {
    this.data.mealWeightNum = this.data.mealWeightNum > 9 ? 10 : this.data.mealWeightNum + 1,
      this.setData({
        mealWeightNum: this.data.mealWeightNum,
        disabled1: this.data.mealWeightNum !== 0 ? false : true,
        disabled2: this.data.mealWeightNum !== 10 ? false : true
      });
  },
  inputMealDesc(e) {
    this.setData({ mealDesc: e.detail.value.trim() });
  },

  mealSubmit: async function (event) {
    var self = this

    if (self.data.mealName.length == 0) {
      wx.showToast({
        title: '请填写菜名',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '更新中',
    })

    // check name repeat
    var checkNameRes = await db.collection('lfas_meal').where({
      mealName: self.data.mealName
    }).get()
    if (checkNameRes.data.length > 0) {
      wx.showToast({
        title: '菜名重复',
        icon: 'none'
      })
      return
    }
    // todo handle the repeat remind 


    var filePostFix = (new Date()).valueOf() + '.png'
    var uploadRes = await wx.cloud.uploadFile({
      cloudPath: 'lfasMealPics/my-photo-' + filePostFix,
      filePath: self.data.localMealPhotoPath
    })

    const meal = {}
    // meal._id = event.mealId
    meal.mealType = Number(this.data.mealType)
    meal.isBreakfirst = this.data.isBreakfirst > 0
    meal.mealName = this.data.mealName
    meal.mealWeightNum = Number(this.data.mealWeightNum)
    meal.mealDesc = this.data.mealDesc
    meal.mealPhotoPath = uploadRes.fileID

    // add row in db
    wx.cloud.callFunction({
      name: 'crudMeal',
      data: {
        operation: 'add',
        meal: meal
      }, success(e) {
        wx.showToast({
          title: '加菜成功'
        })
      }, else(e) {
        wx.showToast({
          title: '加菜失败'
        })
      }
    })

    // change operation
    self.data.operation = 'edit'
    self.setData({
      operation: self.data.operation
    })

    // 清空上一页的查询缓存
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
    prevPage.data.mealTypeList= [[], [], []]
  }
})