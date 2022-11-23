
var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var idSquare = 0;
var index = 0;
var first = true;

var t1, t2, t3, t4;

var cIndex = 0;

class Square {
  constructor(x1, x2, y1, y2, idSquare) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.idSquare = idSquare;
  }

  points() {
    console.log(this.x1, this.x2, this.y1, this.y2, this.idSquare);
  }
}

var squares = [];

var colors = [
  vec4(0.0, 0.0, 0.0, 1.0),  // black
  vec4(1.0, 0.0, 0.0, 1.0),  // red
  vec4(1.0, 1.0, 0.0, 1.0),  // yellow
  vec4(0.0, 1.0, 0.0, 1.0),  // green
  vec4(0.0, 0.0, 1.0, 1.0),  // blue
  vec4(1.0, 0.0, 1.0, 1.0),  // magenta
  vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var m = document.getElementById("mymenu");

  m.addEventListener("click", function () {
    cIndex = m.selectedIndex;
  });


  canvas.addEventListener("mousedown", function (event) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    if (first) {
      first = false;
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
      t1 = vec2(2 * event.clientX / canvas.width - 1,
        2 * (canvas.height - event.clientY) / canvas.height - 1);

      console.log(2 * event.clientX / canvas.width - 1,
        2 * (canvas.height - event.clientY) / canvas.height - 1);
    }
    else {
      first = true;
      t2 = vec2(2 * event.clientX / canvas.width - 1,
        2 * (canvas.height - event.clientY) / canvas.height - 1);
      t3 = vec2(t1[0], t2[1]);
      t4 = vec2(t2[0], t1[1]);

      console.log(2 * event.clientX / canvas.width - 1,
        2 * (canvas.height - event.clientY) / canvas.height - 1);

      squares[0] = new Square(t1[0], t2[0], t1[1], t2[1], idSquare);


      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t3));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t2));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 3), flatten(t4));
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      index += 4;

      t = vec4(colors[cIndex]);

      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4), flatten(t));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 3), flatten(t));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 2), flatten(t));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 1), flatten(t));
      idSquare++;

      console.log(idSquare);
      
    }
    
    if (idSquare != 0) {

      if (2 * event.clientX / canvas.width - 1 > squares[0].x1 &&
        2 * (canvas.height - event.clientY) / canvas.height - 1 < squares[0].y1 &&
        2 * event.clientX / canvas.width - 1 < squares[0].x2 && 2 * (canvas.height - event.clientY) / canvas.height - 1 > squares[0].y2) {
        console.log("DENTRO DO QUADRADO " + squares[0].id);
      }
      console.log("entrou");
    };
    
  });

  //canvas.addEventListener("mousemove", MouseMove, false);

  render();
}

function verPontos(squares) {
  console.log(squares[0].x1);
}

function MouseMove(event, squares) {

}


function render() {

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < index; i += 4)
    gl.drawArrays(gl.TRIANGLE_FAN, i, 4);

  window.requestAnimFrame(render);
}
