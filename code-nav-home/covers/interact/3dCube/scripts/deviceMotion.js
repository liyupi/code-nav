function deviceMotion( cube, element ){
 var x, y,
  bounds = getBoundingClientRect( element ),
  target = new THREE.Euler(),
  deviceOrientation = {},
  screenOrientation = 0,
  compassHeading, fixedAlpha,
  alpha, beta, gamma;
 var api = {
  paused: false,
  range: new THREE.Euler( Math.PI * 0.06, Math.PI * 0.06, 0 ),
  decay: 0.1
 }
 function getBoundingClientRect( element ){
  var bounds = element !== document ? element.getBoundingClientRect() : {
   left: 0,
   top: 0,
   width: window.innerWidth,
   height: window.innerHeight
  };
  if( element !== document ){
   var d = element.ownerDocument.documentElement;
    bounds.left += window.pageXOffset - d.clientLeft;
    bounds.top  += window.pageYOffset - d.clientTop;
   }
   return bounds;
 }
 element.addEventListener( 'mousemove', function( event ){
  if( !api.paused ){
   x = event.pageX / bounds.width  * 2.0 - 1.0;
   y = event.pageY / bounds.height * 2.0 - 1.0;
  }
 })
 setObjectQuaternion = function () {
  var zee = new THREE.Vector3( 0, 0, 1 );
  var euler = new THREE.Euler();
  var q0 = new THREE.Quaternion();
  var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) );
  return function ( quaternion, alpha, beta, gamma, orient ) {
   euler.set( beta, alpha, - gamma, 'YXZ' );
   quaternion.setFromEuler( euler );
   quaternion.multiply( q1 );
   quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );
   quaternion.inverse();
  }
 }();
 var quat = new THREE.Quaternion();
 function update(){
  cube.autoRotate = false
  if( x !== undefined && y !== undefined ){
   target.copy( api.range );
   target.y *= x;
   target.x *= y;
   cube.autoRotateObj3D.rotation.y += ( target.y - cube.autoRotateObj3D.rotation.y ) * api.decay;
   cube.autoRotateObj3D.rotation.x += ( target.x - cube.autoRotateObj3D.rotation.x ) * api.decay;
  }
  requestAnimationFrame( update );
 }
 requestAnimationFrame( update );
 return api;
}
