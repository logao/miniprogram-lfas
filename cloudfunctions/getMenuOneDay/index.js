// 云函数入口文件
const cloud = require('wx-server-sdk')
const util = require('./util')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // step1: 初始化参数
  const pickDate = event.pickDate
  const doDelete = event.doDelete
  const pickDateWeekDay = null // todo: 待使用 weekDay 作为参数
  const memberOpenId = null // todo: 待使用 memberOpenId 作为参数

  // step2: 检查是否有 当日的 MenuList （早中晚三顿）
  var result = await db.collection('lfas_menu').where({
    menuDateTime: _.gte(new Date(pickDate + ' 00:00:00')).and(_.lte(new Date(pickDate + ' 23:59:59')))
  }).get()



  if (result.data.length != 3 || doDelete) {   // todo: 考虑如何实现去重计数
    // 删除已存在的 menu 记录
    await db.collection('lfas_menu').where({
      menuDateTime: _.gte(new Date(pickDate + ' 00:00:00')).and(_.lte(new Date(pickDate + ' 23:59:59')))
    }).remove()

    // create menuList in pickDate: 
    const familyChefCalendar = await db.collection('lfas_family_chef_calendar').get()
    const rowMenuList = familyChefCalendar.data
    var menuList = []

    for (var i = 0; i < rowMenuList.length; i++) {
      var menu = rowMenuList[i]
      const mealType0MealList = await util.getRandomMealList(menu.menuType0MealNumber, 0, db)
      const mealType1MealList = await util.getRandomMealList(menu.menuType1MealNumber, 1, db)
      const mealType2MealList = await util.getRandomMealList(menu.menuType2MealNumber, 2, db)
      menu.menuDateTime = new Date(pickDate + ' ' + menu.menuTime)
      menu.menuMealList =
        [
          {
            mealType: 0, mealList: mealType0MealList
          },
          {
            mealType: 1, mealList: mealType1MealList
          },
          {
            mealType: 2, mealList: mealType2MealList
          },
        ]
      delete menu._id
      delete menu.menuType0MealNumber
      delete menu.menuType1MealNumber
      delete menu.menuType2MealNumber
      menuList[i] = menu
    }

    // 增加新生成的 menu
    const res = await db.collection('lfas_menu').add({
      data: menuList
    })


    result = await db.collection('lfas_menu').where({
      menuDateTime: _.gte(new Date(pickDate + ' 00:00:00')).and(_.lte(new Date(pickDate + ' 23:59:59')))
    }).get()
  }

  return result.data


}