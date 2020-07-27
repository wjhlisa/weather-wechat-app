module.exports = {
  loadWeatherData: loadWeatherData
}

const apiCityWeatherUrl = 'https://demo.com.cn/api/';

function loadWeatherData(cityCode, cb) {
  let apiWeatherUrl = apiCityWeatherUrl + cityCode;

  wx.showLoading({
    title: '努力加载中...'
  });
  wx.request({
    url: apiWeatherUrl,

    data: {},

    success: function (res) {
      wx.hideLoading();

      if (res.data.length == 0) {
        //返回失败
        wx.showToast({
          title: '网络繁忙',
          duration: 2000
        });
        return;
      }

      //返回成功
      let weatherData = parseWeatherData(res.data);

      typeof cb == "function" && cb(cityCode, weatherData);
    },

    fail: function (res) {
      wx.hideLoading();
      //返回失败
      wx.showToast({
        title: '网络繁忙',
        duration: 2000
      });
    }

  })
}


function parseWeatherData(data)
{ 
  for (var i = 0; i < data.length; i++)
  {
    data[i].shortDate = getShortDate(data[i].date);
    data[i].week = getWeekDay(data[i].date);
    data[i].picPath = getPicPath(data[i].weatherPicName);
  }

  return data;
}

function getPicPath(name) {
  return '/images/' + name + '.png'
}

function getShortDate(str) {
  let date = new Date(Date.parse(str));
  let now = new Date();

  let result = (date.getMonth() + 1) + '月' + date.getDate() + '日';
  if (now.getDate() == date.getDate()) {
    result = "今天";
  }
  return result;
}

let weekDayText =
  [
    "日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六"
  ]
function getWeekDay(str) {
  let date = new Date(Date.parse(str));
  return weekDayText[date.getDay()];
}