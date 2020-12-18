// pages/myWardrobe/myWardrobe.js

const db = wx.cloud.database()

Page({
  data: {
    wearListShow: [],
    wearList: []
  },

  onLoad: function (options) {
    this.updateWearList()
  },
  onReachBottom() {
    this.updateWearList()
  },

  wardrobeAddWear() {
    // wardrobeAddWear: async function (e) {

    wx.navigateTo({
      url: '/pages/wearDetail/wearDetail',
      success(res) {
        res.eventChannel.emit('wardrobeAddWear', {
          data: {
            operation: 'add'
          }
        })
      }
    })
    // await db.collection('lfas_wear').add({
    //   data: {
    //     wearPhotoPath:'123'
    //   }
    // })
    // this.updateWearList()

  },

  
  wardrobeEditWear(e) {
    const wearId = e.currentTarget.dataset.wearId
    const wearList = this.data.wearList
    const wear = wearList.find(wear => wear._id == wearId)

    wx.navigateTo({
      url: '/pages/wearDetail/wearDetail',
      success(res) {
        res.eventChannel.emit('wardrobeEditWear', {
          data: {
            operation: 'edit',
            wear: wear
          }
        })
      }
    })
  },

  wardrobeDeleteOneWear(e) {
    const wearId = e.currentTarget.dataset.wearId
    const wearList = this.data.wearList

    const wearIndex = wearList.findIndex(wear => wear._id == wearId)
    wearList.splice(wearIndex, 1)[0]
    this.wearListShow()
    wx.cloud.callFunction({
      name: 'crudWear',
      data: {
        operation: 'delete',
        wearId: wearId
      }
    })

  },

  updateWearList() {
    const self = this
    
    this.wearListShow()
    const oldWearList = this.data.wearListShow

    wx.showLoading({
      title: '更新中',
    })

    db.collection('lfas_wear').skip(oldWearList.length).limit(10).get().then(
      res => {
        self.data.wearList = oldWearList.concat(res.data)
        self.wearListShow()
        wx.hideLoading()
      }
    )
  },

  wearListShow() {
    const wearList = this.data.wearList
    const wearListShow = wearList
    this.setData({
      wearListShow: wearListShow
    })
  }
})