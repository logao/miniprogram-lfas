// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // step1: 初始化参数
  const operation = event.operation
  const menuId = event.menuId
  const mealId = event.mealId
  const mealType = event.mealType

  const queryResult = await db.collection('lfas_menu').doc(menuId).get()

  const menu = queryResult.data

  if (operation == 'delete') {
    const mealIndex = menu.menuMealList[mealType].mealList.findIndex(meal => meal._id == mealId)
    menu.menuMealList[mealType].mealList.splice(mealIndex, 1)
  } else if (operation == 'add') {
    const mealQuery = await db.collection('lfas_meal').doc(mealId).get()
    menu.menuMealList[mealType].mealList.push(mealQuery.data)
  }

  // last step: update lfas_menu
  db.collection('lfas_menu').doc(menuId).update({
    data: {
      menuMealList: menu.menuMealList
    }
  })


}