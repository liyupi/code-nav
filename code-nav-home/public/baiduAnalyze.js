var _hmt = _hmt || [];
(function () {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?6e0626c0821ff3cf84e26ce36ca8c492";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

// 禁止右键
document.addEventListener("contextmenu", function () {
  return false;
});
document.oncontextmenu = function () {
  return false;
};
// 禁止 F12
document.onkeydown = function (event) {
  if (window.event && window.event.keyCode === 123) {
    event.keyCode = 0;
    event.returnValue = false;
    return false;
  }
}
