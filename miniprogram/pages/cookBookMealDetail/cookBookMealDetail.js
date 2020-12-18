// miniprogram/pages/cookBookMealDetail/cookBookMealDetail.js

const db = wx.cloud.database()

Page({
  data: {
    operation: '',
    canChange: true,
    mealTypeRadio: [
      { name: "荤菜", value: 0 },
      { name: "素菜", value: 1 },
      { name: "主食", value: 2 },
    ],
    disabled1: false,
    disabled2: false,
    changePhoto: false,
    localMealPhotoPath: '/images/icons/upload-meal-pic-default.png',
    meal: {
      mealPhotoPath: '',
      mealWeightNum: 5,
      mealType: 2,
      isBreakfirst: false
    }
  },
  onLoad: function (options) {
    console.log('onload', (new Date()).valueOf())
    const eventChannel = this.getOpenerEventChannel()
    const self = this
    eventChannel.on('cookBookAddMeal', function (data) {
      self.data.operation = data.operation
      self.setData({ operation: 'add' })
      wx.setNavigationBarTitle({
        title: '增加菜品',
      })
    })
    eventChannel.on('cookBookEditMeal', function (data) {
      self.data.operation = data.data.operation
      const meal = data.data.meal
      Object.keys(meal).forEach(key => {
        self.data.meal[key] = meal[key]
      })

      self.setData({
        operation: 'edit',
        meal: meal,
        localMealPhotoPath: meal.mealPhotoPath
      })
      wx.setNavigationBarTitle({
        title: '编辑菜品',
      })
    })
    eventChannel.on('viewMeal', function (data) {
      const meal = data.data.meal
      Object.keys(meal).forEach(key => {
        self.data.meal[key] = meal[key]
      })
      self.setData({
        operation: 'view',
        canChange: false,
        meal: meal,
        localMealPhotoPath: meal.mealPhotoPath
      })
      wx.setNavigationBarTitle({
        title: '浏览菜品',
      })
    })

  },
  choosePhoto() {
    var self = this
    if (self.data.canChange) {
      wx.chooseImage({
        count: 1,
        success(res) {
          var tempFilePaths = res.tempFilePaths;
          self.setData({ localMealPhotoPath: tempFilePaths[0] });
        }
      })
      self.data.changePhoto = true
    }
  },

  inputMealName(e) {
    this.data.meal.mealName = e.detail.value.trim()
    this.setData({ meal: this.data.meal })
  },
  isBreakfirstChange(e) {
    this.data.meal.isBreakfirst = e.detail.value
    this.setData({ meal: this.data.meal })
  },
  mealTypeChange(e) {
    this.data.meal.mealType = Number(e.detail.value)
    this.setData({ meal: this.data.meal })
  },
  mealWeightNumNextNum(e) {
    this.data.meal.mealWeightNum = this.data.meal.mealWeightNum < 1 ? 0 : this.data.meal.mealWeightNum - 1
    this.setData({
      meal: this.data.meal,
      disabled1: this.data.meal.mealWeightNum !== 0 ? false : true,
      disabled2: this.data.meal.mealWeightNum !== 10 ? false : true

    });
  },
  mealWeightNumPreNum(e) {
    this.data.meal.mealWeightNum = this.data.meal.mealWeightNum > 9 ? 10 : this.data.meal.mealWeightNum + 1,
      this.setData({
        meal: this.data.meal,
        disabled1: this.data.meal.mealWeightNum !== 0 ? false : true,
        disabled2: this.data.meal.mealWeightNum !== 10 ? false : true
      });
  },
  inputMealDesc(e) {
    this.data.meal.mealDesc = e.detail.value
    this.setData({ meal: this.data.meal })
  },

  mealSubmit: async function (event) {
    var self = this

    if (self.data.meal.mealName.length == 0) {
      wx.showToast({
        title: '请填写菜名',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '更新中',
    })

    // if adding, check name repeat
    if (this.data.operation == 'add') {
      var checkNameRes = await db.collection('lfas_meal').where({
        mealName: self.data.meal.mealName
      }).get()
      if (checkNameRes.data.length > 0) {
        wx.showToast({
          title: '菜名重复',
          icon: 'none'
        })
        return
      }
    }

    if (this.data.changePhoto) {
      var filePostFix = (new Date()).valueOf() + '.png'
      var uploadRes = await wx.cloud.uploadFile({
        cloudPath: 'lfasMealPics/my-photo-' + filePostFix,
        filePath: self.data.localMealPhotoPath
      })
      self.data.meal.mealPhotoPath = uploadRes.fileID
    }

    // add row in db
    wx.cloud.callFunction({
      name: 'crudMeal',
      data: {
        operation: self.data.operation,
        meal: self.data.meal
      }, success(e) {
        console.log(e)
        if (e.result != undefined) {
          self.data.meal._id = e.result
        }

        // change operation
        self.data.operation = 'edit'
        self.setData({
          operation: self.data.operation
        })
        wx.setNavigationBarTitle({
          title: '编辑菜品',
        })

        // 清空上一页的查询缓存
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        var info = prevPage.data //取上页data里的数据也可以修改
        prevPage.data.mealTypeList = [[], [], []]
        prevPage.updateMealList()

        wx.showToast({
          title: '加菜成功'
        })
      }, else(e) {
        wx.showToast({
          title: '加菜失败'
        })
      }
    })
  }
})