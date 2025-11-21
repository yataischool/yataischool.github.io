var performance = window.performance;
var number = 0;
var timeObj = {
  imgTime: 0,
  cssTime: 0,
  jsTime: 0,
  mediaTime: 0,
  otherTime: 0,
  sourceTime: 0, // 其他不在此列资源
  type: '1',
  docTime: 0
};
var errorLink = '';

function siteGetTime(t) {
  switch (t.initiatorType) {
    case 'script':
      timeObj.jsTime += t.duration
      break
    case 'css':
      timeObj.cssTime += t.duration
      break
    case 'video':
      timeObj.mediaTime += t.duration
      break
    case 'audio':
      timeObj.mediaTime += t.duration
      break
    case 'img':
      timeObj.imgTime += t.duration
      break
    case 'other':
      timeObj.otherTime += t.duration
      break
    case 'link':
      timeObj.cssTime += t.duration
      break
    default:
      timeObj.sourceTime += t.duration
  }
};

/* 设置错误 */
function setEerror(aElements,link){
  var aEle = []
  if(link){
    for (var i = 0; i < aElements.length; i++) {
      var eleLink = aElements[i].getAttribute('href')
      var eleSrc = aElements[i].getAttribute('src')
      if(eleLink === link||eleSrc === link){
        // console.log(link);
        aElements[i].style.backgroundColor = '#FFDBDB';
        aElements[i].style.border = '1px solid #FF0000';
        aElements[i].style.color = '#FF0000';
        
        // aElements[i].style.position = 'relative';
        var top = aElements[i].offsetTop- 80 > 0?aElements[i].offsetTop -80:0;
        var left = aElements[i].offsetLeft>0?aElements[i].offsetLeft:0;
        // console.log(aElements[i]);
        var childHtml = document.createElement('span');
        childHtml.innerHTML = "错链接："+link+"";
        childHtml.style.cssText = 'margin:0px;color:#fff;background-color:#FF0000;position:absolute;top:'+(top)+'px;left:'+left+'px;font-size:14px;height: 20px;display: inline-block;padding: 3px;line-height: 1;z-index:999;';
        // aElements[i].appendChild(childHtml)
        document.body.appendChild(childHtml)
        aEle.push(aElements[i])
      }
    }
  }
}

/* 从页面获取具体位置 */
function siteGetElementByAttr (link) {
  // var tags = ['href','src']

  var links = window.document.getElementsByTagName('a')||[]
  var imgs = window.document.getElementsByTagName('img')||[]
  var videos = window.document.getElementsByTagName('video')||[]
  var audios = window.document.getElementsByTagName('audio')||[]
  if(links.length){
    setEerror(links,link)
  }
  if(imgs.length){
    setEerror(imgs,link)
  }
  if(videos.length){
    setEerror(videos,link)
  }
  if(audios.length){
    setEerror(audios,link)
  }
};



function siteInitTime(link) {
  errorLink = link
  siteGetElementByAttr(link)
  var resources = window.performance.getEntriesByType('resource')
  for (var i = 0; i < resources.length; i++) {
    siteGetTime(resources[i], i)
  }
  timeObj.num = number
  if(performance.timing.domContentLoadedEventEnd&&window.parent){
    timeObj.docTime = performance.timing.domContentLoadedEventEnd - performance.timing.domLoading
    timeObj.outerHTML = window.document.documentElement.outerHTML
    window.parent.postMessage(timeObj, '*')
  }

  
};