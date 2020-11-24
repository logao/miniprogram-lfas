// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const pickDate = event.pickDate

  const countResult = await db.collection('lfas_menu').where({
    menuDateTime: _.gte(new Date(pickDate + ' 00:00:00')).and(_.lte(new Date(pickDate + ' 23:59:59')))
  }).count()

  const total = countResult.total

  if (total == 0) {
    const familyChefCalendar = db.collection('lfas_family_chef_calendar').get()
    familyChefCalendar.then(res => {
      rowMenuList = res.data.map(menu => {
        menu.menuDateTime = new Date(pickDate + ' ' + menu.menuTime)
        menu.menuMealList =
          [
            {
              mealType: 0, mealList: [
                {
                  meal_name: '狮子头0', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/my-image.PNG', meal_desc: '', meal_weight_num: 100
                }, {
                  meal_name: '狮子头0', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/查找和替换2.png', meal_desc: '', meal_weight_num: 100
                }
              ]
            },
            {
              mealType: 1, mealList: [
                {
                  meal_name: '狮子头1', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/my-image.PNG', meal_desc: '', meal_weight_num: 100
                }, {
                  meal_name: '狮子头1', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/查找和替换2.png', meal_desc: '', meal_weight_num: 100
                }
              ]
            },
            {
              mealType: 2, mealList: [
                {
                  meal_name: '狮子头2', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/my-image.PNG', meal_desc: '', meal_weight_num: 100
                }, {
                  meal_name: '狮子头2', meal_photo_path: 'cloud://test-6gokn0pp1b7fd7cf.7465-test-6gokn0pp1b7fd7cf-1304259011/查找和替换2.png', meal_desc: '', meal_weight_num: 100
                }
              ]
            },
          ]
          delete menu._id
          delete menu.menuType0MealNumber
          delete menu.menuType1MealNumber
          delete menu.menuType2MealNumber
        return menu
      })
      db.collection('lfas_menu').add({
        data: rowMenuList,
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })



  }

  // const batchTimes = Math.ceil(total / MAX_LIMIT)
  // const tasks = []

  try {
    //order
    return await db.collection('lfas_menu').limit(MAX_LIMIT).
      get({
        success: function (res) {
          console.log(res)
          return res
        }
      });
  } catch (e) {
    console.error(e);
  }


  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}