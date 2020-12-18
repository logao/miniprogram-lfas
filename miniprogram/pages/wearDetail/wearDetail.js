// miniprogram/pages/wearDetail/wearDetail.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: '',
    canChange: true,
    disabled1: false,
    disabled2: false,
    changePhoto: false,
    localWearPhotoPath: '/images/icons/upload-meal-pic-default.png',
    wear: {
      wearPhotoPath: '',
      isSport: false,
      colorType: 0,
      figureType: 0,
      materialType: 0,
      buyDate: '1900-01-01',
      brandName: '',
      scoreNum: 5,
      wearTypeId: '',
      wearDesc: '',
    }
  },

  onLoad: function (options) {
    // console.log('onload', (new Date()).valueOf())
    const eventChannel = this.getOpenerEventChannel()
    const self = this
    eventChannel.on('wardrobeAddWear', function (data) {
      self.data.operation = data.operation
      self.setData({ operation: 'add' })
      wx.setNavigationBarTitle({
        title: '增加衣物',
      })
    })
    eventChannel.on('wardrobeEditWear', function (data) {
      const wear = data.data.wear
      Object.keys(wear).forEach(key => {
        self.data.wear[key] = wear[key]
      })

      self.setData({
        operation: 'edit',
        wear: wear,
        localWearPhotoPath: wear.wearPhotoPath
      })
      wx.setNavigationBarTitle({
        title: '编辑衣物',
      })
    })
    eventChannel.on('viewWear', function (data) {
      const wear = data.data.wear
      Object.keys(wear).forEach(key => {
        self.data.wear[key] = wear[key]
      })
      self.setData({
        operation: 'view',
        canChange: false,
        wear: wear,
        localWearPhotoPath: wear.wearPhotoPath
      })
      wx.setNavigationBarTitle({
        title: '浏览衣物',
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
          self.setData({ localWearPhotoPath: tempFilePaths[0] });
        }
      })
      self.data.changePhoto = true
    }
  },

  isSportChange(e) {
    this.data.wear.isSport = e.detail.value
    this.setData({ wear: this.data.wear })
  },

  inputWearBrandName(e) {
    this.data.wear.brandName = e.detail.value.trim()
    this.setData({ wear: this.data.wear })
  },

  wearScoreNumNextNum(e) {
    const oldNum = this.data.wear.scoreNum
    const newNum = oldNum < 1 ? 0 : oldNum - 1
    this.data.wear.scoreNum = newNum
    this.setData({
      wear: this.data.wear,
      disabled1: newNum !== 0 ? false : true,
      disabled2: newNum !== 10 ? false : true
    });
  },

  wearScoreNumPreNum(e) {
    const oldNum = this.data.wear.scoreNum
    const newNum = oldNum > 9 ? 10 : oldNum + 1
    this.data.wear.scoreNum = newNum
    this.setData({
      wear: this.data.wear,
      disabled1: newNum !== 0 ? false : true,
      disabled2: newNum !== 10 ? false : true
    });
  },

  inputWearDesc(e) {
    this.data.wear.wearDesc = e.detail.value
    this.setData({ wear: this.data.wear })
  },

  wearSubmit: async function () {
    var self = this

    wx.showLoading({
      title: '更新中',
    })

    if (this.data.changePhoto) {
      var filePostFix = (new Date()).valueOf() + '.png'
      var uploadRes = await wx.cloud.uploadFile({
        cloudPath: 'lfasWearPics/lfasWearPic_' + filePostFix,
        filePath: self.data.localWearPhotoPath
      })
      self.data.wear.wearPhotoPath = uploadRes.fileID
    }

    // add row in db
    wx.cloud.callFunction({
      name: 'crudWear',
      data: {
        operation: self.data.operation,
        wear: self.data.wear
      }, success(e) {

        // when add it will return _id
        if (e.result != undefined) {
          self.data.wear._id = e.result
        }

        // change operation
        self.data.operation = 'edit'
        self.setData({
          operation: self.data.operation
        })
        wx.setNavigationBarTitle({
          title: '编辑衣物',
        })

        // handle the data in the last page, suppose the list page
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //get the last page
        prevPage.data.wearList = []
        prevPage.updateWearList()

        wx.showToast({
          title: '添加成功'
        })
      }, else(e) {
        wx.showToast({
          title: '添加失败'
        })
      }
    })
  },

  // low priority
  chooseBuyDate() {

  },
  chooseWearType() {

  },
  chooseColorType() {

  },
  chooseFigureType() {

  },
  chooseMaterialType() {

  }

})