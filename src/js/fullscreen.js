var elementProto = HTMLElement.prototype;
elementProto.requestFullscreen =
  elementProto.requestFullscreen ||
  elementProto.webkitRequestFullscreen ||
  elementProto.mozRequestFullScreen ||
  elementProto.msRequestFullscreen;

document.exitFullscreen =
  document.exitFullscreen ||
  document.webkitExitFullscreen ||
  document.mozCancelFullScreen ||
  document.msExitFullscreen;