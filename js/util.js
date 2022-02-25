/**
 * Hack: prevent the screen from locking when idle by looping a tiny video.
 * Todo: use Wake Lock API (still experimental).
 */
 export function preventScreenLock() {

  function playVideo() {
    video.play();
    document.body.removeEventListener('pointerdown', playVideo);
  };

  const video = document.createElement('video');
  video.setAttribute('loop', '');
  video.style.visibility = 'hidden';

  // Play the video on the first user interaction:
  document.body.addEventListener('pointerdown', playVideo);

  // Resume the video if it ends for some reason (it might happen when the screen turns off)
  video.addEventListener('ended', e => {
    document.body.addEventListener('pointerdown', playVideo);
  });

  function addSourceToVideo(element, type, dataURI) {
    const source = document.createElement('source');
    source.src = dataURI;
    source.type = 'video/' + type;
    element.appendChild(source);
  }

  addSourceToVideo(video,'webm', 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=');
  addSourceToVideo(video, 'mp4', 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw==');

  document.body.append(video);

}

/**
 * Get a random integer between `min` (inclusive) and `max` (exclusive).
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Register event listeners for touching and holding over an element for a certain duration.
 * Two handlers are supplied, one for touching less than the duration,
 * and the second for touching longer than the duration.
 */
export function handleLongTouch(element, touchHandler, longTouchHandler, duration = 500, pixelMoveThreshold = 5) {

  let timer;
  let point = null;

  element.addEventListener('pointerdown', e => {
    point = {x: e.clientX, y: e.clientY};
    timer = setTimeout(t => handlePointerLongDown(e), duration);
  });

  element.addEventListener('pointerup', handlePointerUp);
  element.addEventListener('pointercancel', handlePointerUp);
  element.addEventListener('pointermove', handlePointerMove);

  function handlePointerUp(e) {
    if (!point) return;
    point = null;
    clearTimeout(timer);
    touchHandler(e);
  }

  function handlePointerMove(e) {
    if (!point) return;

    // Ignore if still within the pixel threshhold:
    if (Math.abs(point.x - e.clientX) < pixelMoveThreshold || Math.abs(point.y - e.clientY) < pixelMoveThreshold) return;

    point = null;
    clearTimeout(timer);
    touchHandler(e);
  }

  function handlePointerLongDown(e) {
    point = null;
    longTouchHandler(e);
  }

  // Disable the context menu so it doesn't interfer:
  element.addEventListener('contextmenu', e => {
    e.preventDefault();
  });

}
