var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [ 0, 0, 0 ];
var matrixLoc;
var rotateMatrix = mat4();
var n = 2.0;
var flag = true;


window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );
     gl = WebGLUtils.setupWebGL( canvas );    
     if ( !gl ) { alert( "WebGL isn't available" ); }       
    // Three Vertices
    var vertices = [
            vec3( -1, -1, 0),
            vec3(  1,  1, 0),
            vec3(  1, -1, 0) 
    ];    

    var colors = [
        vec3(1, 0, 0),
        vec3(0, 1, 0),
        vec3(0, 0, 1)
    ];

   
    
    //  Configure WebGL   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );  

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );        
 
    // Load the data into the GPU        
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );   
    
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor ); 
    thetaLoc = gl.getUniformLocation(program, "theta");

    matrixLoc = gl.getUniformLocation(program, "rotate");
    //event listeners for buttons
    document.getElementById( "xButton" ).onclick = rotateX;
    document.getElementById( "yButton" ).onclick = rotateY;
    document.getElementById( "zButton" ).onclick = rotateZ;
    document.getElementById( "PauseButton" ).onclick = PauseRotate;
    render();
};

function rotateX() {
    axis = xAxis;
};

function rotateY() {
    axis = yAxis;
};

function rotateZ(){
    axis = zAxis;
}

function PauseRotate(){
    if (flag){
        n = 0.0;
        flag = false;
    }else{
        n=2.0;
        flag = true;
    }
    
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    theta[axis] += n;
    rotateMatrix = mult(rotate(theta[xAxis], 1, 0, 0),
    mult(rotate(theta[yAxis], 0, 1, 0),
    rotate(theta[zAxis], 0, 0, 1) ));
    gl.uniformMatrix4fv(matrixLoc, 0, flatten(rotateMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    requestAnimFrame( render );
}
