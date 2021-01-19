ERNO.renderers = ERNO.renderers || {};
ERNO.renderers.IeCSS3D = (function(){
 var SceneType = THREE.Scene;
  THREE.Scene = SceneType || function(){};
 return function( cubelets, cube ){
  cube.hideInvisibleFaces = true;
  var renderer  = new ERNO.IeCss3DRenderer( cube ),
   scene   = new THREE.Object3D();
  renderer.scene = scene;
  scene.add( cube.autoRotateObj3D );
  scene.add( cube.camera );
  cube.domElement = renderer.domElement;
  var faceLabel, axis = new THREE.Vector3();
  cube.faces.forEach( function( face, i ){
   faceLabel = cube[face.face].label = new THREE.CSS3DObject( document.createElement( 'div' ) );
   faceLabel.element.classList.add( 'faceLabel' );
   faceLabel.position.copy( face.axis ).multiplyScalar( cube.size );
   faceLabel.position.negate();
   faceLabel.element.innerHTML = face.face.toUpperCase();
   cube.object3D.add( faceLabel );
  })
  cube.right.label.rotation.y = Math.PI *  0.5;
  cube.left.label.rotation.y  = Math.PI * -0.5;
  cube.back.label.rotation.y  = Math.PI;
  cube.up.label.rotation.x  = Math.PI * -0.5;
  cube.down.label.rotation.x  = Math.PI *  0.5;
  ERNO.extend( ERNO.Cubelet.prototype, ERNO.renderers.IeCSS3DCubelet.methods );
  cubelets.forEach( ERNO.renderers.IeCSS3DCubelet );
  function render(){
   if( cube.domElement.parentNode ){
    var parentWidth = cube.domElement.parentNode.clientWidth,
     parentHeight = cube.domElement.parentNode.clientHeight;
    if( cube.domElement.parentNode &&
      ( cube.domElement.clientWidth  !== parentWidth ||
     cube.domElement.clientHeight !== parentHeight )){
      cube.setSize( parentWidth, parentHeight );
    }
    renderer.render( scene, cube.camera );
   }
   requestAnimationFrame( render );
  }
  requestAnimationFrame( render );
  return renderer;
 }
 if( SceneType ) THREE.Scene = SceneType;
}());
ERNO.renderers.IeCSS3DCubelet = (function(){
 var axisMap = [
  'axisZ',
  'axisY',
  'axisX',
  'axisY',
  'axisX',
  'axisZ',
 ]
 return function( cubelet ){
  cubelet.add( cubelet.css3DObject = new THREE.Object3D() );
  cubelet.faces.forEach( function( face ) {
   face.object3D = new THREE.CSS3DObject( document.createElement( 'div' ));
   var faceElement = face.element = face.object3D.element;
   cubelet.css3DObject.add( face.object3D );
   faceElement.classList.add( 'cubeletId-' + cubelet.id );
   faceElement.classList.add( 'face' );
   faceElement.classList.add( axisMap[face.id] );
   faceElement.classList.add( 'face' + ERNO.Direction.getNameById( face.id ).capitalize() );
   var wireframeElement = document.createElement( 'div' );
   wireframeElement.classList.add( 'wireframe' );
   faceElement.appendChild( wireframeElement );
   var idElement = document.createElement( 'div' );
   idElement.classList.add( 'id' );
   faceElement.appendChild( idElement );
   var underlineElement = document.createElement( 'span' );
   underlineElement.classList.add( 'underline' );
   underlineElement.innerText = cubelet.id;
   idElement.appendChild( underlineElement );
   if( face.isIntrovert ){
    faceElement.classList.add( 'faceIntroverted' );
    if( cubelet.cube.hideInvisibleFaces ) faceElement.style.display = 'none';
   }
   else {
    faceElement.classList.add( 'faceExtroverted' );
    var stickerElement = document.createElement( 'div' );
    stickerElement.classList.add( 'sticker' );
    stickerElement.classList.add( face.color.name );
    faceElement.appendChild( stickerElement );
    var textElement = document.createElement( 'div' );
    textElement.classList.add( 'text' );
    textElement.innerText = face.id;
    face.text = textElement;
    faceElement.appendChild( textElement );
   }
  });
  cubelet.front.object3D.element.classList.add( 'axisZ' );
  cubelet.back.object3D.element.classList.add( 'axisZ' );
  cubelet.right.object3D.element.classList.add( 'axisX' );
  cubelet.left.object3D.element.classList.add( 'axisX' );
  cubelet.up.object3D.element.classList.add( 'axisY' );
  cubelet.down.object3D.element.classList.add( 'axisY' );
  var faceSpacing = ( cubelet.size / 2 )
  cubelet.front.object3D.position.z = faceSpacing;
  cubelet.up.object3D.rotation.x   = Math.PI * -0.5; cubelet.up.object3D.position.y   =  faceSpacing;
  cubelet.down.object3D.rotation.x  = Math.PI *  0.5; cubelet.down.object3D.position.y  = -faceSpacing;
  cubelet.left.object3D.rotation.y  = Math.PI * -0.5; cubelet.left.object3D.position.x  = -faceSpacing;
  cubelet.right.object3D.rotation.y  = Math.PI *  0.5; cubelet.right.object3D.position.x  =  faceSpacing;
  cubelet.front.object3D.rotation.z  = 0;    cubelet.front.object3D.position.z  =  faceSpacing;
  cubelet.back.object3D.rotation.y  = Math.PI;   cubelet.back.object3D.position.z  = -faceSpacing;
  cubelet.isTweening = false;
  cubelet.isEngagedX = false;
  cubelet.isEngagedY = false;
  cubelet.isEngagedZ = false;
  cubelet.show();
  cubelet.showIntroverts();
  cubelet.showPlastics();
  cubelet.showStickers();
  cubelet.hideIds();
  cubelet.hideTexts();
  cubelet.hideWireframes();
 }
}());
ERNO.renderers.IeCSS3DCubelet.methods = function(){
 function showItem( item ){
  item.style.display = 'block';
 }
 function hideItem( item ){
  item.style.display = 'none';
 }
 return {
  getFaceElements: function ( selector ){
   var selectorString = selector || '';
   return Array.prototype.slice.call( this.cube.domElement.querySelectorAll( '.cubeletId-'+ this.id + selectorString ));
  },
  show: function(){
   this.getFaceElements().forEach( showItem );
   this.showing = true
  },
  hide: function(){
   this.getFaceElements().forEach( hideItem );
   this.showing = false
  },
  showExtroverts: function(){
   this.getFaceElements( '.faceExtroverted' ).forEach( showItem );
   this.showingExtroverts = true;
  },
  hideExtroverts: function(){
   this.getFaceElements( '.faceExtroverted' ).forEach( hideItem );
   this.showingExtroverts = false;
  },
  showIntroverts: function(){
   var axis = new THREE.Vector3(),
    inv = new THREE.Matrix4(),
    only;
   return function( onlyAxis, soft ){
    only = '';
    if( onlyAxis ){
     inv.getInverse( this.matrix );
     axis.copy( onlyAxis ).transformDirection( inv );
     only = ( Math.abs( Math.round( axis.x )) === 1 ) ? '.axisX' : ( Math.round( Math.abs( axis.y )) === 1 ) ? '.axisY' : '.axisZ';
    }
    this.getFaceElements( '.faceIntroverted' + only ).forEach( showItem );
    if( !soft ) this.showingIntroverts = true;
   }
  }(),
  hideIntroverts: function(){
   var axis = new THREE.Vector3(),
    inv = new THREE.Matrix4(),
    only;
   return function( onlyAxis, soft ){
    only = '';
    if( onlyAxis ){
     inv.getInverse( this.matrix );
     axis.copy( onlyAxis ).transformDirection( inv );
     only = ( Math.abs( Math.round( axis.x )) === 1 ) ? '.axisX' : ( Math.round( Math.abs( axis.y )) === 1 ) ? '.axisY' : '.axisZ';
    }
    this.getFaceElements( '.faceIntroverted' + only ).forEach( hideItem );
    if( !soft ) this.showingIntroverts = false;
   }
  }(),
  showPlastics: function(){
   this.getFaceElements().forEach( function( item ){
    item.classList.remove( 'faceTransparent' );
   });
   this.showingPlastics = true;
  },
  hidePlastics: function(){
   this.getFaceElements().forEach( function( item ){
    item.classList.add( 'faceTransparent' );
   });
   this.showingPlastics = false;
  },
  hideStickers: function(){
   this.getFaceElements( ' .sticker' ).forEach( hideItem );
   this.showingStickers = false;
  },
  showStickers: function(){
   this.getFaceElements( ' .sticker' ).forEach( showItem );
   this.showingStickers = true;
  },
  showWireframes: function(){
   this.getFaceElements( ' .wireframe' ).forEach( showItem );
   this.showingWireframes = true;
  },
  hideWireframes: function(){
   this.getFaceElements( ' .wireframe' ).forEach( hideItem );
   this.showingWireframes = false;
  },
  showIds: function(){
   this.getFaceElements( ' .id' ).forEach( showItem );
   this.showingIds = true;
  },
  hideIds: function(){
   this.getFaceElements( ' .id' ).forEach( hideItem );
   this.showingIds = false;
  },
  showTexts: function(){
   this.getFaceElements( ' .text' ).forEach( showItem );
   this.showingTexts = true;
  },
  hideTexts: function(){
   this.getFaceElements( ' .text' ).forEach( hideItem );
   this.showingTexts = false;
  },
  getOpacity: function(){
   return this.opacity
  },
  setOpacity: function( opacityTarget, onComplete ){
   if( this.opacityTween ) this.opacityTween.stop()
   if( opacityTarget === undefined ) opacityTarget = 1
   if( opacityTarget !== this.opacity ){
    var
    that = this,
    elements = this.getFaceElements();
    tweenDuration = ( opacityTarget - this.opacity ).absolute().scale( 0, 1, 0, 1000 * 0.2 )
    this.opacityTween = new TWEEN.Tween({ opacity: this.opacity })
    .to({
     opacity: opacityTarget
    }, tweenDuration )
    .easing( TWEEN.Easing.Quadratic.InOut )
    .onUpdate( function(){
     that.opacity = this.opacity;
     elements.forEach( function( element ){
      element.style.opacity =  that.opacity;
     })
    })
    .onComplete( function(){
     if( onComplete instanceof Function ) onComplete()
    })
    .start()
   }
  },
  getStickersOpacity: function( value ){
   return parseFloat( stickerElements[0].style.opacity );
  },
  setStickersOpacity: function( value ){
   if( value === undefined ) value = 0.2;
   valueStr = value.toString();
   this.getFaceElements( ' .sticker' ).forEach( function( sticker ){
    sticker.style.opacity = valueStr;
   });
  }
 }
}()
