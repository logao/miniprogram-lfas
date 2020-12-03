// miniprogram/pages/cookBookMealDetail/cookBookMealDetail.js

const db = wx.cloud.database()

Page({
  data: {
    operation: 'add',
    mealTypeRadio: [
      { name: "荤菜", value: 0, checked: true },
      { name: "素菜", value: 1 },
      { name: "主食", value: 0 },
    ],
    localMealPhotoPath: '/images/icons/upload-meal-pic-default.png',
    mealDesc: '',
    mealWeightNum: 5,
    disabled1: false,
    disabled2: false
  },
  onLoad: function (options) {
    console.log('onload', (new Date()).valueOf())
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

  formSubmit: async function (event) {

    var eventData = event.detail.value
    var self = this

    // check name repeat
    var checkNameRes = await db.collection('lfas_meal').where({
      mealName: eventData.mealName
    }).get()
    if (checkNameRes.data.length > 0) return
    // todo handle the repeat remind 


    var filePostFix = (new Date()).valueOf() + '.png'
    var uploadRes = await wx.cloud.uploadFile({
      cloudPath: 'lfasMealPics/my-photo-' + filePostFix,
      filePath: self.data.localMealPhotoPath
    })

    const meal = {}
    // meal._id = event.mealId
    meal.mealType = Number(eventData.mealType)
    meal.isBreakfirst = eventData.isBreakfirst.length > 0
    meal.mealName = eventData.mealName
    meal.mealWeightNum = Number(eventData.mealWeightNum)
    meal.mealDesc = eventData.mealDesc
    meal.mealPhotoPath = uploadRes.fileID

    // add row in db
    wx.cloud.callFunction({
      name: 'crudMeal',
      data: {
        operation: 'add',
        meal: meal
      }
    })

    // change operation
    self.data.operation = 'edit'
    self.setData({
      operation: self.data.operation
    })
  }
})