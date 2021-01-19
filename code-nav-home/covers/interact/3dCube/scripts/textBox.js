TextBox = function(cube, name, text, min, max){
 THREE.Object3D.call( this );
 this.cube = cube;
 this.name = name;
 this.text = text;
 this.opacity = 1.0;
 this.cube.object3D.add( this );
 var domElement = document.createElement( 'div' );
 domElement.classList.add( 'textBox' );
 domElement.id = name;
 this.css3DObject = new THREE.CSS3DObject( domElement );
 domElement.innerHTML = text;
 this.css3DObject.name = 'css3DObject-' + name;
 this.domElement = domElement;
 this.add( this.css3DObject );
}
TextBox.prototype = Object.create( THREE.Object3D.prototype );
ERNO.extend( TextBox.prototype, {
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
