//修改自开源代码 https://github.com/flyDreamAlone/wechat_Chart

module.exports = {
  drawTempChart: drawTempChart
}



const LeftXInRpx = 90;
const RightXInRpx = 675 + 10;
const LeftTopYInRpx = 124;
const TenDegreeYInRpx = 80;
const ScaleWidthInRpx = 15;



function drawTempChart(canvasID, lowTempData, highTempData, lowTempLimit, highTempLimit, pastText, futureText) {
  const ctx = wx.createCanvasContext(canvasID);

  ctx.beginPath();
  ctx.setStrokeStyle('#999999');
  ctx.setFillStyle('black');
  ctx.setLineWidth(1);
  const leftX = getPxFromRpx(LeftXInRpx);
  const leftTopY = getPxFromRpx(LeftTopYInRpx);
  const zeroDegreeY = getPxFromRpx(LeftTopYInRpx + highTempLimit * TenDegreeYInRpx / 10);
  const leftBottomY = getPxFromRpx(LeftTopYInRpx + (highTempLimit - lowTempLimit) * TenDegreeYInRpx / 10);
  const rightX = getPxFromRpx(RightXInRpx);

  ctx.moveTo(leftX, leftTopY);
  //Y轴
  ctx.lineTo(leftX, leftBottomY);
  //X轴
  ctx.moveTo(leftX, zeroDegreeY);
  ctx.lineTo(rightX, zeroDegreeY);

  //顶部标题
  ctx.setFontSize(getPxFromRpx(30));
  ctx.fillText('气温变化趋势', getPxFromRpx(295), getPxFromRpx(70));

  //Y轴刻度
  drawYScales(ctx, leftX, leftTopY, highTempLimit, lowTempLimit);

  //今天虚线
  let xInterval = (rightX - leftX) / (lowTempData.length - 1);
  let todayX = leftX + xInterval * (lowTempData.length / 2);
  drawDashLine(ctx, todayX, leftTopY, todayX, leftBottomY, getPxFromRpx(10));

  //底部文本注释
  ctx.setFontSize(getPxFromRpx(30));
  let xSpace = (rightX - leftX) / 6;
  ctx.fillText(pastText, leftX + xSpace, leftBottomY + getPxFromRpx(50));
  ctx.fillText('今天', todayX - getPxFromRpx(32), leftBottomY + getPxFromRpx(50));
  ctx.fillText(futureText, todayX + xSpace, leftBottomY + getPxFromRpx(50));

  //两条折线
  drawLine(ctx, highTempData, '#FFB6C1', 'red', leftX, rightX, leftTopY, leftBottomY, highTempLimit, lowTempLimit);
  drawLine(ctx, lowTempData, '#6495ED', 'blue', leftX, rightX, leftTopY, leftBottomY, highTempLimit, lowTempLimit);
  
  //默认reserve 参数为 false，表示绘制之前 native 层会先清空画布再继续绘制
  ctx.draw();  
}



function drawYScales(ctx, leftX, topY, highTempLimit, lowTempLimit)
{
  //Y scale
  var scaleStartX = leftX;
  var scaleEndX = getPxFromRpx(LeftXInRpx + ScaleWidthInRpx);
  ctx.setFontSize(getPxFromRpx(20));
  var textX = getPxFromRpx(45);
  let scaleNum = (highTempLimit - lowTempLimit) / 10 + 1;
  for (var i = 0; i < scaleNum; i++) {
    var scaleY = topY + getPxFromRpx(TenDegreeYInRpx) * i;

    
    let currentTemp = (highTempLimit - i * 10);
    if (currentTemp === 0) {
      //标记温度 0° 向右靠
      ctx.fillText(currentTemp.toString() + '°', textX + getPxFromRpx(10), scaleY + getPxFromRpx(10));

      //由于计算误差 0°刻度和X轴不重合 所以这里不画
    } else {
      //标记温度
      ctx.fillText(currentTemp.toString() + '°', textX, scaleY + getPxFromRpx(10));

      //画短线
      ctx.moveTo(scaleStartX, scaleY);
      ctx.lineTo(scaleEndX, scaleY);
      ctx.stroke();    
    }    
  }  
}



//画虚线
function drawDashLine(ctx, x1, y1, x2, y2, dashLength) { //传context对象，始点x和y坐标，终点x和y坐标，虚线长度
  ctx.beginPath()
  ctx.setLineWidth(0.5)
  var dashLen = dashLength === undefined ? 3 : dashLength,
    xpos = x2 - x1, //得到横向的宽度;
    ypos = y2 - y1, //得到纵向的高度;
    numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
  //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
  for (var i = 0; i < numDashes; i++) {
    if (i % 2 === 0) {
      ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
      //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
    } else {
      ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
    }
  }
  ctx.stroke();
}



//Canvas的单位px，小程序使用rpx，所以必须转换
function getPxFromRpx(rpx) {
  let windowWidthPx = wx.getSystemInfoSync().windowWidth;

  //小程序宽度为750rpx      
  return Math.floor(rpx * windowWidthPx / 750);
}



//画折线
function drawLine(ctx, tempData, pastColor, futureColor, leftX, rightX, topY, bottomY, highTempLimit, lowTempLimit)
{
  let xInterval = (rightX - leftX) / (tempData.length - 1);

  ctx.beginPath();  
  ctx.setLineWidth(1);
  ctx.setStrokeStyle(pastColor);
  for (var i = 0; i < tempData.length; i++)
  {
    let x = leftX + xInterval * i;
    var y = getYFromTemp(tempData[i], highTempLimit, lowTempLimit, topY, bottomY);

    if (i == 0)
    {
      ctx.moveTo(x, y);
    }
    else
    {
      ctx.lineTo(x, y);
    }

    if (i == tempData.length / 2)
    { //已经画完过去的折线，改变颜色
      //描边
      ctx.stroke();

      //必须开始一个新路径，颜色等设置才能生效
      //https://developers.weixin.qq.com/miniprogram/dev/api/CanvasContext.beginPath.html
      ctx.beginPath();
      ctx.setLineWidth(1);
      ctx.setStrokeStyle(futureColor);
      ctx.moveTo(x, y);
    }
  }

  ctx.stroke();  
}



function getYFromTemp(temp, highTempLimit, lowTempLimit, topY, bottomY) {
  return (bottomY - topY) * (highTempLimit - temp) / (highTempLimit - lowTempLimit) + topY;
}