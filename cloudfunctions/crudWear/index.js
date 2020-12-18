// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  } = cloud.getWXContext()  

  // step1: initial parameter
  const operation = event.operation


  if (operation == 'add') {
    const wear = event.wear
    const res = await db.collection('lfas_wear').add({
      data: {
        _openid: OPENID,
        wearPhotoPath:wear.wearPhotoPath,
        isSport:wear.isSport,
        colorType:wear.colorType,
        figureType:wear.figureType,
        materialType:wear.materialType,
        buyDate:wear.buyDate,
        brandName:wear.brandName,
        scoreNum:wear.scoreNum,
        wearTypeId:wear.wearTypeId,
        wearDesc:wear.wearDesc
      }, success(res) {
        console.log(res)

      }, fail(res) {
        console.log(res)
      }
    })
    return res._id

  } else if (operation == 'delete') {
    db.collection('lfas_wear').doc(event.wearId).remove()
  }

  
  else if (operation == 'edit') {
    const wear = event.wear
    const wearId = wear._id
    delete wear._id
    db.collection('lfas_wear').doc(wearId).update({
      data:wear
    })
  }

}