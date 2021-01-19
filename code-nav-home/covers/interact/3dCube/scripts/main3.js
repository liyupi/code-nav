var motion;
var startTime = 0;
var isMobile = dataStore['fpdoodle'] == '1';
var scopedCheckQueue;
var ua = navigator.userAgent,
    isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1;
var useLockedControls = true,
    controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;
window.cube = new ERNO.Cube({
  hideInvisibleFaces: isMobile,
  controls: controls,
  renderer: isIe ? ERNO.renderers.IeCSS3D : null
});
cube.hide();
var container = document.getElementById('container');
container.appendChild(cube.domElement);
if (isMobile) {
  document.body.classList.add('mobile');
  document.getElementById('bg').classList.add('graydient');
}
cube.addEventListener('click', function(evt) {
  if (!cube.mouseControlsEnabled) {
    return;
  }
  var cubelet = evt.detail.cubelet,
      face = cubelet[evt.detail.face.toLowerCase()],
      axis = new THREE.Vector3(),
      exclude = new THREE.Vector3(1, 0, 0),
      UP = new THREE.Vector3(0, 1, 0),
      normal = ERNO.Direction.getDirectionByName(face.normal).normal.clone(),
      slice;
  normal.x = Math.abs(normal.x);
  normal.y = Math.abs(normal.y);
  normal.z = Math.abs(normal.z);
  var l = cube.slices.length;
  while (l-- > 0) {
    slice = cube.slices[l];
    axis.copy(slice.axis);
    axis.x = Math.abs(axis.x);
    axis.y = Math.abs(axis.y);
    axis.z = Math.abs(axis.z);
    if (slice.cubelets.indexOf(cubelet) !== -1 &&
        axis.equals(UP)) {
      break;
    }
  }
  var command = slice.name.substring(0, 1);
  if (slice === cube.down) command = command.invert();
  cube.twist(command);
});
if (controls === ERNO.Locked) {
  var fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
  cube.object3D.lookAt(cube.camera.position);
  cube.rotation.x += fixedOrientation.x;
  cube.rotation.y += fixedOrientation.y;
  cube.rotation.z += fixedOrientation.z;
}
cube.camera.position.z = 2000;
cube.camera.fov = 30;
cube.camera.updateProjectionMatrix();
if (isMobile) {
  cube.position.y = 0;
  cube.position.z = 0;
} else {
  cube.position.y = 410;
  cube.position.z = -850;
}
cube.mouseControlsEnabled = false;
cube.keyboardControlsEnabled = false;
cube.twistCountDown = 0;
cube.audioList = [];
cube.audio = 0;
ERNO.RED.hex = '#DC422F';
ERNO.WHITE.hex = '#FFF';
ERNO.BLUE.hex = '#3D81F6';
ERNO.GREEN.hex = '#009D54';
ERNO.ORANGE.hex = '#FF6C00';
ERNO.YELLOW.hex = '#FDCC09';
ERNO.COLORLESS.hex = '#000000';
var Plane = function(cube, name, className) {
  THREE.Object3D.call(this);
  cube.object3D.add(this);
  this.domElement = document.createElement('div');
  this.domElement.classList.add(className);
  this.domElement.id = name;
  this.css3DObject = new THREE.CSS3DObject(this.domElement);
  this.css3DObject.name = 'css3DObject-' + name;
  this.add(this.css3DObject);
};
Plane.prototype = Object.create(THREE.Object3D.prototype);
if (!isIe) {
  var shadow = new Plane(cube, 'shadow', 'shadow');
  shadow.rotation.set(
      (90).degreesToRadians(),
      (0).degreesToRadians(),
      (0).degreesToRadians()
  );
  shadow.position.y = -300;
  function updateShadow() {
    requestAnimationFrame(updateShadow);
    shadow.rotation.z = cube.slicesDictionary['y'].rotation;
  }
  requestAnimationFrame(updateShadow);
}
window.setTimeout(setupLogo, 100);
function setupLogo() {
  cube.rotation.set(
      (25).degreesToRadians(),
      (-45).degreesToRadians(),
      (0).degreesToRadians()
  );
  cube.typeCubeletIds = new Array(8, 17, 16, 23, 20, 12, 21, 25);
  cube.typeCubelets = new ERNO.Group();
  cube.cubelets.forEach(function(cubelet, index) {
    cube.typeCubeletIds.forEach(function(id) {
      if (cubelet.id == id) {
        cube.typeCubelets.add(cubelet);
        cubelet.logo = true;
      }
    });
  });
  var stickerLogo = document.getElementsByClassName('stickerLogo');
  if (stickerLogo.length > 0) {
    stickerLogo[0].classList.remove('stickerLogo');
  }
  cube.twistDuration = 0;
  var LOGO_SEQUENCE = 'zzxLFFRDuFLUrl';
  cube.twistCountDown = LOGO_SEQUENCE.length;
  scopedCheckQueue = checkQueue.bind(this, startScrambleAnimation);
  cube.addEventListener('onTwistComplete', scopedCheckQueue);
  cube.twist(LOGO_SEQUENCE);
  function setWhiteBg(selector) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; ++i) {
      elements[i].style.backgroundColor = ERNO.WHITE.hex;
    }
  }
  var prefix = '.cubeletId-';
  cube.cubelets.forEach(function(cubelet, index) {
    if (cubelet.logo != true) {
      setWhiteBg(prefix + cubelet.id + ' .sticker');
    }
    if (cubelet.id == 8 || cubelet.id == 17) {
      setWhiteBg(prefix + cubelet.id + ' .sticker.red');
    }
    if (cubelet.id == 21 || cubelet.id == 25) {
      setWhiteBg(prefix + cubelet.id + ' .sticker.yellow');
    }
    if (cubelet.id == 20) {
      setWhiteBg(prefix + cubelet.id + ' .sticker.yellow');
      setWhiteBg(prefix + cubelet.id + ' .sticker.orange');
    }
  });
  setTimeout(scrambleCube, 1000);
}
function enableDeviceMotion() {
  if (!motion) {
    motion = deviceMotion(cube, container);
    motion.decay = 0.1;
    motion.range.x = Math.PI * 0.02;
    motion.range.y = Math.PI * 0.02;
    motion.range.z = 0;
  }
  motion.paused = false;
}
function pauseDeviceMotion() {
  motion.paused = true;
}
function initiateAudio() {
  cube.audioList = [
    'CubeDoodle01',
    'CubeDoodle02',
    'CubeDoodle03',
    'CubeDoodle04',
    'CubeDoodle05',
    'CubeDoodle06',
    'CubeDoodle07',
    'CubeDoodle08'
  ];
  cube.audio = new Html5Audio(cube.audioList,
      'examples/doodle-iframe/media/SingleSounds');
  cube.audio.loadAll();
  cube.addEventListener('onTwistComplete', function(e) {
    cube.audio.play(cube.audioList[
        Math.floor(Math.random() * (cube.audioList.length - 1))]);
  });
}
function startInteractiveCube() {
  if (!isMobile) {
    enableDeviceMotion();
  }
  var sentCertificate = false;
  startTime = (new Date()).getTime();
  cube.twistDuration = 500;
  cube.moveCounter = 0;
  cube.addEventListener('onTwistComplete', function(e) {
    if (cube.undoing) {
      cube.moveCounter++;
    }
    if (moveCounter) {
      moveCounter.innerText = moveCounter.textContent = cube.moveCounter;
    }
    postParentMessage({'moves': cube.moveCounter});
    if (cube.isSolved()) {
      setTimeout(function() {
        cube.hideInvisibleFaces = false;
        cube.showIntroverts();
        if (shadow && shadow.domElement) {
          shadow.domElement.style.opacity = '0';
        }
        if (!sentCertificate) {
          sentCertificate = true;
          doCertificate();
          postParentMessage({'certificate': 1});
        }
      }, 1000);
    }
  });
  moveCounter.innerText = moveCounter.textContent = cube.moveCounter;
  if (window.parent != window) {
    uipanel.style.display = '';
    uipanel.style.opacity = '1';
  }
  if (!isMobile) {
    buttonpanel.style.display = 'none';
    moveCounter.style.display = 'none';
  }
  postParentMessage({'controls': 1});
  cube.mouseControlsEnabled = true;
  cube.keyboardControlsEnabled = true;
}
function checkQueue(callback) {
  if (cube.twistQueue.history.length - cube.twistCountDown == 0) {
    cube.removeEventListener('onTwistComplete', scopedCheckQueue);
    callback();
  }
}
window.addEventListener('message', function(e) {
  var data = e.data;
  if (e.origin != dataStore.origin || data.session != dataStore.session) {
    return;
  }
  var update = data['update'];
  if (update) {
    mergeObject(update, dataStore);
    var upgradeText = document.querySelector('#upgradeText div.upgradetext');
    if (upgradeText && update['msgs']) {
      upgradeText.textContent = upgradeText.innerText =
          update['msgs']['Error Version 2'] ||
          dataStore['msgs']['Error Version 2'] || '';
    }
  } else if (data['help']) {
    handleHelpClick();
  } else if (data['moveCounter']) {
    solveCube();
  }
});
function postParentMessage(data) {
  data['session'] = dataStore['session'];
  window.parent && window.parent.postMessage(data, dataStore['origin'] || '*');
}
function startScrambleAnimation() {
  postParentMessage({'transition': 1});
  cube.show();
}
function scrambleCube() {
  new TWEEN.Tween(cube.position)
  .to({
        x: 0,
        y: 0,
        z: 0
      }, 3000)
  .easing(TWEEN.Easing.Quartic.InOut)
  .start(cube.time);
  new TWEEN.Tween(cube.rotation)
  .to({
        x: (25).degreesToRadians(),
        y: (45).degreesToRadians(),
        z: 0
      }, 3000)
  .easing(TWEEN.Easing.Quartic.InOut)
  .start(cube.time);
  cube.twistDuration = 120;
  var WCA_SCRAMBLE_SHORT = 'ddurrdllrBffDUbffdurfdUbll';
  cube.twistCountDown =
      WCA_SCRAMBLE_SHORT.length + cube.twistQueue.history.length;
  cube.twist(WCA_SCRAMBLE_SHORT);
  scopedCheckQueue = checkQueue.bind(this, startInteractiveCube);
  cube.addEventListener('onTwistComplete', scopedCheckQueue);
  cube.cubelets.forEach(function(cubelet, indexCubelets) {
    cubelet.faces.forEach(function(face, indexFaces) {
      var sticker = face.element.getElementsByClassName('sticker')[0];
      if (sticker) {
        var colorNow = sticker.style.backgroundColor;
        if (colorNow) {
          colorNow = colorNow.replace(/[^\d,]/g, '').split(',');
          colorNow = {
            r: colorNow[0].toNumber(),
            g: colorNow[1].toNumber(),
            b: colorNow[2].toNumber()
          };
          var colorTarget = _.hexToRgb(face.color.hex);
          new TWEEN.Tween(colorNow)
          .to({
                r: colorTarget.r,
                g: colorTarget.g,
                b: colorTarget.b
              }, 500)
          .onUpdate(function() {
                sticker.style.backgroundColor = 'rgb(' +
                    colorNow.r.round() + ',' +
                    colorNow.g.round() + ',' +
                    colorNow.b.round() + ')';
              })
          .start(cube.time);
        }
      }
    });
  });
}
function solveCube(_twistDuration) {
  _twistDuration = _twistDuration || 0;
  cube.twistDuration = _twistDuration;
  while (cube.twistQueue.history.length > 0) cube.undo();
}
var helpBubble = document.getElementById('helpbubble');
var helpButton = document.getElementById('helpbutton');
var helpIndex = 0;
var helpNext = document.getElementById('helpnext');
var helpText = document.getElementById('helptext');
var helpImage = document.getElementById('helpimage');
var moveCounter = document.getElementById('movecounter');
var searchButton = document.getElementById('searchbutton');
var shareBubble = document.getElementById('sharebubble');
var shareButton = document.getElementById('sharebutton');
var shareEmail = document.getElementById('shareemail');
var shareFacebook = document.getElementById('sharefacebook');
var shareGPlus = document.getElementById('sharegplus');
var shareShortLink = document.getElementById('shareshortlink');
var shareTwitter = document.getElementById('sharetwitter');
var uipanel = document.getElementById('uipanel');
var buttonpanel = document.getElementById('buttonpanel');
if (window.navigator.userAgent.match(/iP(hone|od|ad)/i)) {
  shareEmail.style.display = 'none';
}
function setMobileIcon(element) {
  element.className = element.className.replace('_64', '_96');
}
if (isMobile) {
  setMobileIcon(shareGPlus);
  setMobileIcon(shareFacebook);
  setMobileIcon(shareTwitter);
  setMobileIcon(shareEmail);
  setMobileIcon(searchButton);
  setMobileIcon(helpButton);
  setMobileIcon(shareButton);
  shareShortLink.style.display = 'none';
}
function addListener(element, listener) {
  if (isMobile) {
    element.addEventListener('touchstart', listener);
  } else {
    element.addEventListener('click', listener);
  }
}
function getShortlinkForSharing() {
  var shortlink = dataStore['shortlink'] || '//google.com/doodles';
  return shortlink.replace(/.*\/\//, 'http://');
}
addListener(shareGPlus, function(e) {
  window.open('https://plus.google.com/share?url=' +
      encodeURIComponent(getShortlinkForSharing()));
});
addListener(shareFacebook, function(e) {
  window.open('http://www.facebook.com/sharer.php?u=' +
      encodeURIComponent(getShortlinkForSharing()));
});
addListener(shareTwitter, function(e) {
  window.open('http://twitter.com/intent/tweet?status=' +
      encodeURIComponent(dataStore['msgs']['Share Message'] + ' ' +
      getShortlinkForSharing()));
});
addListener(shareEmail, function(e) {
  window.open('mailto:?subject=' +
      encodeURIComponent(dataStore['msgs']['Share Message']) +
      '&body=' + encodeURIComponent(getShortlinkForSharing()));
});
addListener(searchButton, function(e) {
  postParentMessage({'search': 1});
});
function updateHelp() {
  helpText.textContent = helpText.innerText =
      dataStore['msgs']['Directions ' + helpIndex];
  helpNext.textContent = helpNext.innerText =
      dataStore['msgs']['Directions UI ' + (helpIndex < 2 ? 1 : 2)];
  if (helpIndex == 1) {
    helpImage.classList.remove('two');
    helpImage.classList.add('one')
  } else if (helpIndex == 2) {
    helpImage.classList.remove('one');
    helpImage.classList.add('two')
  }
}
function handleHelpClick(e) {
  if (helpBubble.style.display == 'none') {
    helpBubble.style.display = 'block';
    helpBubble.style.pointerEvents = 'auto';
    helpIndex = 1;
    updateHelp();
  } else {
    helpBubble.style.display = 'none';
    helpBubble.style.pointerEvents = 'none';
  }
  shareBubble.style.opacity = '0';
}
helpBubble.dir = dataStore['dir'];
addListener(helpBubble, function(e) {
  helpIndex++;
  if (helpIndex > 2) {
    helpBubble.style.display = 'none'
    helpBubble.style.pointerEvents = 'none';
  } else {
    helpBubble.style.display = 'block'
    updateHelp();
  }
  shareBubble.style.opacity = 'none';
  e.preventDefault && e.preventDefault();
  return false;
});
addListener(helpButton, handleHelpClick);
addListener(container, function(e) {
  helpBubble.style.display = 'none';
  helpBubble.style.pointerEvents = 'none';
  shareBubble.style.opacity = '0';
});
addListener(shareButton, function(e) {
  shareBubble.style.opacity = shareBubble.style.opacity == '0' ? '1' : '0';
  helpBubble.style.display = 'none';
  shareShortLink.value = dataStore['shortlink'].replace(/^\/\//, '');
});
shareShortLink.addEventListener('mouseup', function(e) {
  e.preventDefault();
  shareShortLink.select();
});
