var elementProto = HTMLElement.prototype;
elementProto.requestFullscreen =
  elementProto.requestFullscreen ||
  elementProto.webkitRequestFullscreen ||
  elementProto.mozRequestFullScreen ||
  elementProto.msRequestFullscreen;

if (!elementProto.requestFullscreen) {
  document.body.className += " no-fullscreen";
}

document.exitFullscreen =
  document.exitFullscreen ||
  document.webkitExitFullscreen ||
  document.mozCancelFullScreen ||
  document.msExitFullscreen;