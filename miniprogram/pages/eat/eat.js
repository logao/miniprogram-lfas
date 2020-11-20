// miniprogram/pages/eat/eat.js

const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    menuOneDay: {
      menuDate: new Date(),
      chefMemberRole: '爷爷',
      menuList: [
        {
          menuType: 0, menuTime: '07:00', dinnersNum: 3, menuMealList:
            [{
              meal_name: '狮子头', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/my-image.PNG', meal_desc: '', meal_weight_num: 100
            }, {
              meal_name: '狮子头', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/查找和替换2.png', meal_desc: '', meal_weight_num: 100
            }
            ]
        },
        { menuType: 1, menuTime: '11:30', dinnersNum: 4 },
        { menuType: 2, menuTime: '06:30', dinnersNum: 4 }
      ]
    },
    date: util.formatTime(app.globalData.pickDate, 'Y-M-D')
  },


  onLoad: function (options) {
    // const db = wx.cloud.database()
    // const menus = db.collection('lfas_menu')
    // const menu = menus.doc('test_cloud_data_conn')
    // console.log(this.data.menuOneDay.menuDate)
    // const aa = util.formatTime(this.data.menuOneDay.menuDate, 'Y-M-D')
    this.data.menuOneDay.menuList.sort(util.compare('menuType'))
  },

  changeDate(e) {
    let chDate = e.detail.value
    this.setData({ date: chDate });
  }

})