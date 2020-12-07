// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // const countResult = await db.collection('lfas_menu').where({
  //   menuDateTime: _.gte(new Date(pickDate + ' 00:00:00')).and(_.lte(new Date(pickDate + ' 23:59:59')))
  // }).get()
  const getResult1 = await db.collection('lfas_meal').where({
    isBreakfirst: true,
    mealType:0 
  }).skip(20).limit(10).
  get()

  const getResult2  = await db.collection('lfas_meal').where({
    isBreakfirst: true,
    mealType:0 
  }).skip(20).
  get()

  // console.log(getResult)


}