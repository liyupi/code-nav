DivBox = function(cube, name){
 THREE.Object3D.call( this );
 this.cube = cube;
 this.name = name;
 this.cube.object3D.add( this );
 var domElement = document.createElement( 'div' );
 domElement.classList.add( 'DivBox' );
 domElement.id = name;
 this.css3DObject = new THREE.CSS3DObject( domElement );
 this.css3DObject.name = 'css3DObject-' + name;
 this.add( this.css3DObject );
}
DivBox.prototype = Object.create( THREE.Object3D.prototype );
ERNO.extend( DivBox.prototype, {
 setText: function(text){
  this.css3DObject.element.innerHTML = text;
  this.text = text;
  return this;
 },
 setOpacity: function(opacity){
  this.opacity = opacity;
  this.css3DObject.element.style.opacity = opacity;
  return this;
 }
});
