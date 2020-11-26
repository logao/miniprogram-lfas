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

  const menuId = event.menuId
  const mealId = event.mealId
  const mealType = event.mealType

  const queryResult = await db.collection('lfas_menu').doc(menuId).get()

  const menu = queryResult.data
  const mealIndex = menu.menuMealList[mealType].mealList.findIndex(meal => meal._id == mealId)

  console.log(menu)
  menu.menuMealList[mealType].mealList.splice(mealIndex, 1)
  console.log(menu)
  db.collection('lfas_menu').doc(menuId).update({
    data:{
      menuMealList: menu.menuMealList
    }
  })

}