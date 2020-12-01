// miniprogram/pages/cookBookMealDetail/cookBookMealDetail.js

const db = wx.cloud.database()

Page({
  data: {
    operation: 'add',
    mealTypeRadio: [
      { name: "荤", value: 0, checked: true },
      { name: "素", value: 1 },
      { name: "主", value: 0 },
    ],
    localMealPhotoPath: '/images/icons/upload-meal-pic-default.png'
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