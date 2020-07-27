// detail.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {    
    cityWeatherData: {},
    todayIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData(
      {        
        cityWeatherData: JSON.parse(decodeURIComponent(options.cityWeatherData)),
        todayIndex: parseInt(options.todayIndex)
      })
  },


  /**
   * 页面显示/切入前台时触发
   */
  onShow() {
    wx.setNavigationBarTitle({
      title: app.globalData.miniProgramName
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options)
  {    
    return {
      path: 'pages/detail/detail?cityWeatherData=' + JSON.stringify(this.data.cityWeatherData) + '&todayIndex=' + this.data.todayIndex          
    }    
  }
})