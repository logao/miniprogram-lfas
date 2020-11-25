

// 根据菜的类型和数量，获取随机的一组菜品
// todo: 根据 member 的 cookbook 进行关联查询
async function getRandomMealList(mealNum, mealType, db) {
  const result = await db.collection('lfas_meal').where({
    mealType: mealType
  }).get()

  var mealList = []
  var weightArr = result.data

  for (var i = 0; i < mealNum; i++) {
    if (weightArr.length > 0) {
      const arrIndex = getArrIndex(weightArr);
      mealList[i] = weightArr[arrIndex]
      weightArr.splice(arrIndex,1)
    }
  }

  console.log(mealList)
  return mealList
}

// 获取数组中最接近的值得index
function getArrIndex(arr) {
  var weightArray = []
  if (!arr || arr.length <= 0) {
    weightArray = [];
  } else {
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
      if (i == 0) {
        temp[i] = parseInt(arr[i].mealWeightNum);
      } else {
        temp[i] = temp[i - 1] + parseInt(arr[i].mealWeightNum);
      }
    }
    weightArray = temp;
  }

  var totalWeight = weightArray[weightArray.length - 1];
  var random = Math.random() * totalWeight;

  var index = 0;
  if (random <= weightArray[0]) {
    return 0;
  } else if (random >= weightArray[weightArray.length - 1]) {
    index = weightArray.length - 1;
    return index;
  } else {
    for (var i = 0; i < weightArray.length; i++) {
      if (random <= weightArray[i]) {
        index = i;
      } else if (random > weightArray[i] && random <= weightArray[i + 1]) {
        index = i + 1;
        break
      } else if (random > weightArray[i] && random <= weightArray[i + 1]) {
        index = i + 1;
        break;
      }
    }
  }
  return index;
}



module.exports = { getRandomMealList }
