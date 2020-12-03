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


  if (operation == 'add') {
    const meal = event.meal
    db.collection('lfas_meal').add({
      data: {
        mealType: meal.mealType,
        isBreakfirst: meal.isBreakfirst,
        mealName: meal.mealName,
        mealWeightNum: meal.mealWeightNum,
        mealDesc: meal.mealDesc,
        mealPhotoPath: meal.mealPhotoPath
      }, success(res) {
        console.log(res)
      }, fail(res) {
        console.log(res)
      }
    })
  } else if (operation == 'delete') {
    const mealId = event.mealId
    db.collection('lfas_meal').doc(mealId).remove()
  }
  else if (operation == 'update') {
    // todo

    // const mealQuery = await db.collection('lfas_meal').doc(mealId).get()
    // menu.menuMealList[mealType].mealList.push(mealQuery.data)
  }

}