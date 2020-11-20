const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
* 时间戳转化为年 月 日 时 分 秒
* ts: 传入时间戳
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(data, format) {

  let timestamp = Date.parse(new Date(`${data}`)) || Date.parse(new Date(`${data.replace(/-/g, '/')}`))
  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);

  returnArr = returnArr.map(formatNumber);

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;

}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];

    var value2 = b[property];

    return value1 - value2;

  }
}

module.exports = {
  formatTime: formatTime,
  compare: compare
}