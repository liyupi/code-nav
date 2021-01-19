var cubeletsUnused = new ERNO.Group();
var certName, certSolved, certMovesNumber, certMovesHeader, certDate,
    certTimeNumber, certTimeHeader;
var lineLeft, lineRight;
var textBoxes = [];
var buttons = [];
var coords;
var frames = [];
var tweenSpeed = 600;
var allObjects = [];
var certificateCreated = false;
function doCertificate() {
  if (certificateCreated) {
    return;
  }
  certificateCreated = true;
  cube.mouseControlsEnabled = false;
  cube.keyboardControlsEnabled = false;
  document.getElementById('container').appendChild(cube.domElement);
  makeCertificate();
}
function animateCubeBack(callback) {
  var bg = document.getElementById('bg');
  var tweenCoords = {
    camZ: cube.camera.position.z,
    fov: cube.camera.fov,
    x: cube.position.x,
    y: cube.position.y,
    z: cube.position.z,
    xRot: cube.rotation.x,
    yRot: cube.rotation.y,
    zRot: cube.rotation.z,
    bgOpacity: 1
  }
  new TWEEN.Tween(tweenCoords).to({
    camZ: 2800,
    fov: 49,
    x: 0,
    y: 0,
    z: 0,
    xRot: (90).degreesToRadians(),
    yRot: (0).degreesToRadians(),
    zRot: (135).degreesToRadians(),
    bgOpacity: 0
  }, 1000)
  .onUpdate(function() {
        cube.camera.position.z = tweenCoords.camZ;
        cube.camera.fov = tweenCoords.fov;
        cube.position.set(tweenCoords.x, tweenCoords.y, tweenCoords.z);
        cube.rotation.set(tweenCoords.xRot, tweenCoords.yRot, tweenCoords.zRot);
        bg.style.opacity = tweenCoords.bgOpacity;
      })
  .easing(TWEEN.Easing.Quartic.InOut)
  .onComplete(function() {
        callback();
      })
  .start(cube.time);
}
function makeCertificate() {
  cube.hideInvisibleFaces = false;
  cube.showIntroverts();
  resetPositions();
  setupTextBoxes();
  setupObjects();
  setupCore();
  if(isIe)prepareFaces();
  importFramesFromJson();
  preparePlayBack();
  animateCubeBack(playFrames);
}
function resetPositions() {
  cube.cubelets.forEach(function(cubelet) {
    cubelet.css3DObject.position.copy(cubelet.position);
    cubelet.position.set(0, 0, 0);
  });
}
function setupObjects() {
  allObjects.push.apply(allObjects, cube.cubelets);
  allObjects.push.apply(allObjects, textBoxes);
}
function zeroPad(val, digits) {
  while (('' + val).length < digits) {
    val = '0' + val;
  }
  return val;
}
var dataStore = {
  'msgs': {
    'Certificate Moves': 'Moves',
    'Certificate Time': 'Time',
    'Certificate Title': 'Cube Solved',
    'Directions 1': 'Swipe outside the cube to rotate it.',
    'Directions 2': 'Swipe inside to twist the cube.',
    'Directions 3': 'Keyboard commands work too.',
    'Directions UI 1': 'Next',
    'Directions UI 2': 'Done',
    'Error Version 1': 'Oops! This doodle uses some experimental web ' +
        'technology that may not work on your device.',
    'Error Version 2': 'To play, please use a supported hardware ' +
        'configuration and the latest version of one of these browsers:',
    'Mobile Certificate Cube': 'Cube',
    'Mobile Certificate Solved': 'Solved',
    'Share Message': 'The Rubik’s Cube is 40! #CubeDoodle',
    'Share Message Completed': '#CubeDoodle solved!!',
    'Sign In Button': 'Sign in',
    'Sign In Message': 'Sign in to add your name'
  },
  'origin': '',
  'session': '',
  'dir': '',
  'hl': 'en',
  'user': '',
  'shortlink': 'google.com/doodles'
};
var parsedData = {};
var matches = window.location.hash.match(/[#&]data=([^&]*)/);
if (matches && matches.length > 1) {
  try {
    parsedData = JSON.parse(decodeURIComponent(matches[1])) || {};
  } catch (parseError) {}
}
mergeObject(parsedData, dataStore);
function mergeObject(from, to) {
  for (var key in from) {
    if (typeof from[key] == 'object') {
      mergeObject(from[key], to[key]);
    } else {
      to[key] = from[key] || to[key];
    }
  }
}
function setupTextBoxes() {
  if( isIe ){
    var ieScene        = new THREE.Object3D(),
        ieTextRenderer = new THREE.CSS3DRenderer(),
        ieCubeObject   = new THREE.Object3D(),
        ieAutoRotateObj= new THREE.Object3D(),
        container      = document.getElementById('container');
    container.appendChild( ieTextRenderer.domElement );
    ieTextRenderer.domElement.style.position = 'absolute';
    ieTextRenderer.domElement.style.top      = '0px';
    ieTextRenderer.domElement.style.left     = '0px';
    ieCubeObject.matrix      = cube.matrix;
    ieCubeObject.matrixWorld = cube.matrixWorld;
    ieCubeObject.matrixAutoUpdate = false;
    ieAutoRotateObj.matrix      = cube.autoRotateObj3D.matrix;
    ieAutoRotateObj.matrixWorld = cube.autoRotateObj3D.matrixWorld;
    ieAutoRotateObj.matrixAutoUpdate = false;
    ieCubeObject.name = 'cube'
    ieScene.add( ieAutoRotateObj );
    ieAutoRotateObj.add( ieCubeObject);
    function ieRender(){
      var containerWidth  = container.clientWidth,
          containerHeight = container.clientHeight;
      if( cube.domElement.parentNode &&
        ( ieTextRenderer.domElement.clientWidth  !== containerWidth ||
          ieTextRenderer.domElement.clientHeight !== containerHeight )){
          ieTextRenderer.setSize( containerWidth, containerHeight );
      }
      ieTextRenderer.render( ieScene, cube.camera );
      requestAnimationFrame( ieRender );
    }
    requestAnimationFrame( ieRender );
  }
  var cubeObject = isIe ? {object3D: ieCubeObject }: cube;
  if(isMobile){
    certName = new ResizeableTextBox(cubeObject, 'certName', dataStore['msgs']['Mobile Certificate Cube']);
    certSolved = new ResizeableTextBox(cubeObject, 'certSolved', dataStore['msgs']['Mobile Certificate Solved']);
  }else{
    certSolved = new ResizeableTextBox(cubeObject, 'certSolved', dataStore['user']);
    certName = new ResizeableTextBox(cubeObject, 'certName',
          dataStore['msgs']['Certificate Title']);
  }
  var moves = cube.moveCounter;
  moves = zeroPad(moves, 4);
  certMovesNumber = new TextBox(cubeObject, 'certMovesNumber', moves);
  certMovesHeader = new TextBox(cubeObject, 'certMovesHeader',
      dataStore['msgs']['Certificate Moves']);
  var now = new Date();
  var month = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'
  ][now.getMonth()];
  var dateString = now.getFullYear() + '-' +
      zeroPad(now.getMonth(), 2) + '-' +
      zeroPad(now.getDate(), 2);
  var lang = dataStore['hl'] || en;
  if (lang == 'en') {
    dateString = month + ' ' + now.getDate() + ', ' + now.getFullYear();
  } else if (now.toLocaleDateString) {
    dateString = now.toLocaleDateString(lang);
  }
  certDate = new TextBox(cubeObject, 'certDate', dateString);
  if (navigator.userAgent.indexOf('MSIE') > -1 ||
      navigator.userAgent.indexOf('Trident') > -1) {
      certDate.domElement.style.marginTop = '-210px';
  }
  var endTime = now.getTime();
  var elapsedTime = (endTime - startTime) / 1000;
  var timeSec = zeroPad(Math.floor(elapsedTime % 60), 2);
  var timeMin = zeroPad(Math.floor(elapsedTime / 60), 2);
  certTimeNumber =
      new TextBox(cubeObject, 'certTimeNumber', timeMin + ':' + timeSec);
  certTimeHeader = new TextBox(cubeObject, 'certTimeHeader',
      dataStore['msgs']['Certificate Time']);
  certLarryName = new TextBox(cubeObject, 'certLarryName', 'Lawrence Page');
  certErnoName = new TextBox(cubeObject, 'certErnoName', 'Erno Rubik');
  googleLogo = new DivBox(cubeObject, 'googleLogo');
  larrySignature = new DivBox(cubeObject, 'larrySignature');
  ernoSignature = new DivBox(cubeObject, 'ernoSignature');
  lineLeft = new DivBox(cubeObject, 'lineLeft');
  lineRight = new DivBox(cubeObject, 'lineRight');
  textBoxes = [certName, certSolved, certMovesNumber, certMovesHeader,
    certDate, certTimeNumber, certTimeHeader, certLarryName,
    certErnoName, googleLogo, larrySignature,
    ernoSignature, lineLeft, lineRight
  ];
  textBoxes.forEach(function(textbox) {
    textbox.opacity = 0;
    textbox.css3DObject.element.style.opacity = 0;
  });
}
function setupCore() {
  var core = cube.cubelets[13];
  core.faces.forEach(function(face) {
    var logoFace = document.createElement('div');
    logoFace.classList.add('logoFace');
    face.element.appendChild(logoFace);
  });
  if (isIe) {
    var f = document.querySelectorAll(".faceDown .logoFace");
    f[0].classList.add("ie");
  }
}
function prepareFaces(){
  var f = document.querySelectorAll(".cube .face");
  for(var i=0;i<f.length;i++){
    f[i].style.webkitBackfaceVisibility = "visible";
    f[i].style.mozBackfaceVisibility = "visible";
    f[i].style.oBackfaceVisibility = "visible";
    f[i].style.backfaceVisibility = "visible";
  }
}
function preparePlayBack() {
  allObjects.forEach(function(object) {
    object.frames = [];
  });
  frames.forEach(function(frame, frameIndex) {
    frame.forEach(function(coords, objIndex) {
      var object = allObjects[coords.id];
      var tweenCoords = {
        x: coords.position.x,
        y: coords.position.y,
        z: coords.position.z,
        xr: coords.rotation.x,
        yr: coords.rotation.y,
        zr: coords.rotation.z,
        xrcss: coords.rotationCSS.x,
        yrcss: coords.rotationCSS.y,
        zrcss: coords.rotationCSS.z,
        opacity: coords.opacity
      };
      object.frames.push(tweenCoords);
    });
  });
  allObjects.forEach(function(object) {
    object.tweens = [];
    for (var i = 0; i < object.frames.length - 1; i++) {
      var frameTween = new TWEEN.Tween(object.frames[i])
      .to({
            x: object.frames[i + 1].x,
            y: object.frames[i + 1].y,
            z: object.frames[i + 1].z,
            xr: object.frames[i + 1].xr,
            yr: object.frames[i + 1].yr,
            zr: object.frames[i + 1].zr,
            xrcss: object.frames[i + 1].xrcss,
            yrcss: object.frames[i + 1].yrcss,
            zrcss: object.frames[i + 1].zrcss,
            opacity: object.frames[i + 1].opacity
          }, tweenSpeed)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
            object.css3DObject.position.x = this.x;
            object.css3DObject.position.y = this.y;
            object.css3DObject.position.z = this.z;
            object.rotation.x = this.xr;
            object.rotation.y = this.yr;
            object.rotation.z = this.zr;
            object.css3DObject.rotation.x = this.xrcss;
            object.css3DObject.rotation.y = this.yrcss;
            object.css3DObject.rotation.z = this.zrcss;
            if (object.css3DObject.element) {
              object.css3DObject.element.style.opacity = this.opacity;
            } else {
              var i = 6;
              while (i-- > 0) {
                object.faces[i].element.style.opacity = this.opacity;
              }
            }
            object.opacity = this.opacity;
          });
      object.tweens.push(frameTween);
    }
    for (var i = 0; i < object.tweens.length - 1; i++) {
      object.tweens[i].chain(object.tweens[i + 1]);
    }
  });
}
function playFrames() {
  allObjects.forEach(function(object) {
    object.tweens[0].start(cube.time);
  });
}
function importFramesFromJson() {
  if (isMobile) {
    frames = certDataMobile.frames;
  } else {
    frames = certData.frames;
  }
}
