/**
 * Hack: prevent the screen from locking when idle by playing a fake video
 * Would be better to use the Wake Lock API, but its still experimental.
 */
 export function preventScreenLock() {

  const video = document.createElement('video');
  video.setAttribute('loop', '');
  video.style.visibility = 'hidden';
  video.addEventListener('ended', e => {
    document.body.addEventListener('touchend', playVideo);
  });

  function addSourceToVideo(element, type, dataURI) {
      const source = document.createElement('source');
      source.src = dataURI;
      source.type = 'video/' + type;
      element.appendChild(source);
  }

  function concatBase64(mimeType, base64) {
      return 'data:' + mimeType + ';base64,' + base64;
  };

  // Add fake sources
  addSourceToVideo(video,'webm', concatBase64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
  addSourceToVideo(video, 'mp4', concatBase64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

  document.body.append(video);

  // Start playing video after first user interaction.
  document.body.addEventListener('touchend', playVideo);
  function playVideo() {
      video.play();
      document.body.removeEventListener('touchend', playVideo);
  };
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
 * Handle long press on an element.
 * For touch screens only.
 * You will probably need to prevent default on the contextmenu event before using this.
 */
export function handleLongPress(element, callback) {
  let timer;

  element.addEventListener('touchstart', e => {
    timer = setTimeout(t => callback(e), 500);
  });

  element.addEventListener('touchend', cancel);
  element.addEventListener('touchmove', cancel);

  function cancel() {
    clearTimeout(timer);
  }
}