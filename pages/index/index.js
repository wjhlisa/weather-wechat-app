//app.js
var api = require('../../libs/api');
var chart = require('../../libs/chart');

const CITY_CODE_SELECTED = 'cityCodeSelected';
var weatherDataDownloaded = {};

//获取应用实例
var app = getApp()
Page({
  data: {
    citiesToChoose: [],
    cityWeatherData: {},
    isChoosingCity: false,
    todayIndex: -1
  },



  onLoad: function() {
    this.setData({
      citiesToChoose: app.globalData.citiesToChoose
    });

    //Get the last city user selected
    var cityCodeSelected = wx.getStorageSync(CITY_CODE_SELECTED) || '';
    if (cityCodeSelected == '')
    { //This is the first time to run
      cityCodeSelected = this.data.citiesToChoose[1].code;
      wx.setStorageSync(CITY_CODE_SELECTED, cityCodeSelected);
    }

    //Download weather data for the city
    var that = this;
    api.loadWeatherData(cityCodeSelected, function(cityCode, data) {
      weatherDataDownloaded[cityCode] = data;

      //Render page
      that.setData({
        cityWeatherData: weatherDataDownloaded[cityCode],
        todayIndex: data.length / 2
      });

      that.drawTempChart(data);
    });
  },


  /**
   * 页面显示/切入前台时触发
   */
  onShow() {
    wx.setNavigationBarTitle({
      title: app.globalData.miniProgramName
    });
  },



  //画气温变化图
  drawTempChart: function(data)
  {
    let lowTempArray = [];
    let highTempArray = [];
    for (let i in data) {
      lowTempArray.push(data[i].nightLowTemp);
      highTempArray.push(data[i].dayHighTemp);
    }

    chart.drawTempChart('canvas', lowTempArray, highTempArray, -30, 40, '过去5天', '未来4天');
  },



  onChangeCity: function(e) {
    this.setData({
      isChoosingCity: !this.data.isChoosingCity
    })
  },

  onSelectCity: function(e) {
    var cityCode = this.data.citiesToChoose[e.currentTarget.dataset.index].code;
    wx.setStorageSync(CITY_CODE_SELECTED, cityCode);

    if (weatherDataDownloaded.hasOwnProperty(cityCode))
    { //The city weather has already been downloaded
      //Render page directly
      this.setData({
        cityWeatherData: weatherDataDownloaded[cityCode],
        isChoosingCity: !this.data.isChoosingCity,
        todayIndex: weatherDataDownloaded[cityCode].length / 2
      });

      this.drawTempChart(weatherDataDownloaded[cityCode]);
    }
    else
    { //Download the city weather
      var that = this;
      api.loadWeatherData(cityCode, function(cityCode, data)
      {
        weatherDataDownloaded[cityCode] = data;

        //Render page
        that.setData({
          cityWeatherData: weatherDataDownloaded[cityCode],
          isChoosingCity: !that.data.isChoosingCity,
          todayIndex: weatherDataDownloaded[cityCode].length / 2
        });

        that.drawTempChart(weatherDataDownloaded[cityCode]);
      });      
    }
  },

  /**
   * 点击遮罩隐藏选项
   */
  onTapMask: function() {
    this.setData({
      isChoosingCity: false
    })
  },


  /**
   * Navigate to details page
   */
  onShowDetailPage: function(e)
  {
    if (e.currentTarget.dataset.index != this.data.todayIndex)
    { //Only today item can go to details page
      return;
    }


    //传对象作为参数，首先转为字符串
    //http://www.wxapp-union.com/portal.php?mod=view&aid=1595    
    var param = encodeURIComponent(JSON.stringify(this.data.cityWeatherData));

    wx.navigateTo({
      url: '../detail/detail?cityWeatherData=' + param + '&todayIndex=' + this.data.todayIndex
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function()
  {
    return {
      title: app.globalData.miniProgramName,
      path: '/pages/index/index'
    }
  }
})