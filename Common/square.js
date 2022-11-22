var canvas;
var gl;
var lines;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var indexConvex = 0;
var randomX;
var randomY;

var convexPoints = [];

let points = new Array(20);

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

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

    lines = WebGLUtils.setupWebGL(canvas);
    if (!lines) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    lines.viewport(0, 0, canvas.width, canvas.height);
    lines.clearColor(0.5, 0.5, 0.5, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    var programLines = initShaders(lines, "vertex-shader", "fragment-shader");

    gl.useProgram(program);
    lines.useProgram(programLines);

    //--------------------------------------------------------------------------------------------------//

    var lineBuffer = lines.createBuffer();
    lines.bindBuffer(lines.ARRAY_BUFFER, lineBuffer);
    lines.bufferData(lines.ARRAY_BUFFER, 8 * maxNumVertices, lines.STATIC_DRAW);

    var linePosition = lines.getAttribLocation(programLines, "vPosition");
    lines.vertexAttribPointer(linePosition, 2, lines.FLOAT, false, 0, 0);
    lines.enableVertexAttribArray(linePosition);

    //--------------------------------------------------------------------------------------------------//

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

    gl.clear(gl.COLOR_BUFFER_BIT);
    document.getElementById("RandomizePoints").onclick = RandomizePoints;

    canvas.addEventListener("mousedown", function (event) {
        //const [minSize, maxSize] = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);
        //gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        /*for (var i = 0; i < 20; i++) {
            randomX = getRandomInt(1, 512);
            randomY = getRandomInt(1, 512);
            points[i] = new Point(randomX, randomY);


            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            var t = vec2(2 * randomX / canvas.width - 1,
                2 * (canvas.height - randomY) / canvas.height - 1);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[(index) % 7]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
            index++;

        }*/

        RandomizePoints(index, vBuffer, cBuffer, gl, points, Point);

        let n = points.length;
        convexPoints = convexHull(points, n);

        /*for (let i = 0; i < convexPoints.length; i++) {
            console.log(convexPoints.length);
            indexConvex = convexPoints.length;

            lines.bindBuffer(lines.ARRAY_BUFFER, vBuffer);
            var l = vec2(2 * convexPoints[i].x / canvas.width - 1,
                2 * (canvas.height - convexPoints[i].y) / canvas.height - 1);
            lines.bufferSubData(lines.ARRAY_BUFFER, 8 * index, flatten(l));

            lines.bindBuffer(lines.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[(index) % 7]);
            lines.bufferSubData(lines.ARRAY_BUFFER, 16 * index, flatten(l));

            console.log("(" + convexPoints[i].x + ", " +
                convexPoints[i].y + ")");

            index++;
        }*/

    });

    /*for (var i = 0; i < 20; i++) {
        console.log(points[i].x + ", " + points[i].y);
    }*/



    render();

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
}

function DrawLines(index, vBuffer, cBuffer, gl, convexPoints){
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < convexPoints.length; i++) {
        console.log(convexPoints.length);
        indexConvex = convexPoints.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        var l = vec2(2 * convexPoints[i].x / canvas.width - 1,
            2 * (canvas.height - convexPoints[i].y) / canvas.height - 1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(l));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        t = vec4(colors[(index) % 7]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(l));

        console.log("(" + convexPoints[i].x + ", " +
            convexPoints[i].y + ")");

        index++;
        gl.drawArrays(gl.LINE_LOOP, 0, index);
    }
}

function RandomizePoints(index, vBuffer, cBuffer, gl, points, Point) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    for (var i = 0; i < 20; i++) {
        randomX = getRandomInt(1, 512);
        randomY = getRandomInt(1, 512);
        points[i] = new Point(randomX, randomY);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        var t = vec2(2 * randomX / canvas.width - 1,
            2 * (canvas.height - randomY) / canvas.height - 1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));
        

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        t = vec4(colors[(index) % 7]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
        index++;
    }
    console.log("entrou--->"+index);
    gl.drawArrays(gl.POINTS, 0, index);
}


function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

function convexHull(points, n) {

    // There must be at least 3 points
    if (n < 3) return;

    // Initialize Result
    let hull = [];

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++)
        if (points[i].x < points[l].x)
            l = i;

    // Start from leftmost point, keep moving
    // counterclockwise until reach the start point
    // again. This loop runs O(h) times where h is
    // number of points in result or output.
    let p = l, q;
    do {

        // Add current point to result
        hull.push(points[p]);

        // Search for a point 'q' such that
        // orientation(p, q, x) is counterclockwise
        // for all points 'x'. The idea is to keep
        // track of last visited most counterclock-
        // wise point in q. If any point 'i' is more
        // counterclock-wise than q, then update q.
        q = (p + 1) % n;

        for (let i = 0; i < n; i++) {
            // If i is more counterclockwise than
            // current q, then update q
            if (orientation(points[p], points[i], points[q])
                == 2)
                q = i;
        }

        // Now q is the most counterclockwise with
        // respect to p. Set p as q for next iteration,
        // so that q is added to result 'hull'
        p = q;

    } while (p != l);  // While we don't come to first
    // point

    // Print Result

    for (let temp of hull.values()) {
        console.log("(" + temp.x + ", " +
            temp.y + ")");
    }

    return hull;
}


function render() {
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.POINTS, 0, index);
    //lines.drawArrays(lines.LINE_LOOP, 0, 20);
    window.requestAnimFrame(RandomizePoints);
}
