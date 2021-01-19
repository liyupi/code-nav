ResizeableTextBox = function(cube, name, text, min, max){
 THREE.Object3D.call( this );
 this.cube = cube;
 this.name = name;
 this.text = text;
 this.opacity = 1.0;
 this.longWord = "";
 this.maxWordLength = 15;
 this.min = min !== undefined ? min : 50;
 this.max = max !== undefined ? max : 180;
 if(isMobile){
  this.max = max !== undefined ? max : 210;
 }
 this.cube.object3D.add( this );
 var domElement = document.createElement( 'div' );
 domElement.classList.add( 'textBox' );
 domElement.id = name;
 this.css3DObject = new THREE.CSS3DObject( domElement );
 domElement.textContent = text;
 this.css3DObject.name = 'css3DObject-' + name;
 this.domElement = domElement;
 this.add( this.css3DObject );
 if (text) {
   this.setTextResize(text);
 }
 requestAnimationFrame( this.resize.bind( this ));
}
ResizeableTextBox.prototype = Object.create( THREE.Object3D.prototype );
ERNO.extend( ResizeableTextBox.prototype, {
 prepareText: function(text){
  if (!text) return;
  var words = text.split(" ");
  var longWord = words[0];
  var longWordIndex = 0;
  this.text = text;
  if (words.length>1) {
   this.longWord = words[0];
   for(var i=0; i< words.length; i++){
    if(words[i].length > this.longWord.length){
     this.longWord = words[i];
     longWordIndex=i;
    }
   }
   if(words[longWordIndex].length>this.maxWordLength)words[longWordIndex] = words[longWordIndex].substring(0, this.maxWordLength) + "...";
   this.longWord = words[longWordIndex];
   var brokenText = "";
   if(words.length>2){
    for(var i=0; i<words.length; i++){
     brokenText += words[i] + " ";
    }
    this.text= brokenText;
   }else{
    brokenText = words[0] + " " + words[1];
   }
   this.text = brokenText;
  };
 },
  setTextResize: function(text){
  this.prepareText(text);
  this.resize();
  this.css3DObject.element.textContent = this.text;
  return this;
 },
  resize: function () {
  var fontSize = Math.min( this.max, Math.max( this.min, this.css3DObject.element.clientWidth / this.longWord.length*1.3 ));
     this.css3DObject.element.style.fontSize = fontSize  + 'px';
    },
 setText: function(text){
  this.css3DObject.element.textContent = text;
  this.text = text;
  return this;
 },
 setOpacity: function(opacity){
  this.opacity = opacity;
  this.css3DObject.element.style.opacity = opacity;
  return this;
 }
});
