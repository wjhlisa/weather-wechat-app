/*
这个小程序是从以下源代码修改而来
https://github.com/tabalt/WeatherHelper
*/


App({
  onLaunch: function () {
    // 获取用户信息
    //this.getUserInfo();
    //...
  },
  
  globalData: {
    miniProgramName: '太原地区天气预报',    
    citiesToChoose: [{
      code: '101100101',
      name: '太原'
    },
    {
      code: '101100107',
      name: '小店区'
    },
    {
      code: '101100110',
      name: '万柏林'
    },
    {
      code: '101100109',
      name: '杏花岭'
    },
    {
      code: '101100108',
      name: '迎泽'
    },
    {
      code: '101100106',
      name: '尖草坪区'
    },
    {
      code: '101100102',
      name: '清徐'
    },
    {
      code: '101100111',
      name: '晋源'
    },
    {
      code: '101100105',
      name: '古交'
    },
    {
      code: '101100103',
      name: '阳曲'
    },
    {
      code: '101100104',
      name: '娄烦'
    }
    ]
  }
})
