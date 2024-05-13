// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
        gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1){
        gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1){
        gl_FragColor = texture2D(u_Sampler1,v_UV);
    } else if (u_whichTexture == 2){
        gl_FragColor = texture2D(u_Sampler2,v_UV);
    } else{
        gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// Global Vars
let canvas;
let gl;
let a_Position;
let a_UV;
let u_Size;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;


// Classes //


/*
                POINT
*/

class Point{
    constructor(){
        this.type = "point";
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render() {
        var xy = this.position
        var rgba = this.color;
        var size = this.size;
        
        gl.disableVertexAttribArray(a_Position);
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size,size);

        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}


/*
                    TRIANGLES
*/


class Triangle{
    constructor(){
        this.type="triangle"
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

               // Pass the color of a point to u_FragColor variable
               gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
               // Pass the size of a point to u_Size variable
               gl.uniform1f(u_Size,size);
       
               // Draw
               var d = this.size/200.0
               drawTriangle( [xy[0]-d,xy[1],xy[0]+d,xy[1],xy[0],xy[1]+2*d])
    }
}

// Draws a Triangle //

function drawTriangle(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to ceate the buffer object");
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW)


    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

// Draws a 3D Triangle //

function drawTriangle3D(vertices){
    var n = vertices.length/3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to ceate the buffer object");
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW)


    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

// Draws a UV of 3D Triangle //
function drawTriangle3DUV(vertices,uv){
    var n = vertices.length/3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to ceate the buffer object");
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW)


    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);

    // Creating buffer for UV object
    var uvBuffer = gl.createBuffer();
    if(!uvBuffer){
        console.log("Failed to create the buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_UV,2,gl.FLOAT,false,0,0);
    
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES,0,n);
}

/*
                    CIRCLES
*/

class Circle{
    constructor(){
        this.type = "circle";
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
        this.segments = g_segmentCount;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        
        var d = this.size/200.0
               
        let angleStep = 360/this.segments;
            for(var angle = 0; angle < 360; angle=angle+angleStep){
                let centerPt = [xy[0],xy[1]];
                let angle1=angle;
                let angle2=angle+angleStep;
                let vec1=[Math.cos(angle1*Math.PI/180)*d,Math.sin(angle1*Math.PI/180)*d]
                let vec2=[Math.cos(angle2*Math.PI/180)*d,Math.sin(angle2*Math.PI/180)*d]
                let pt1 = [centerPt[0]+vec1[0],centerPt[1]+vec1[1]];
                let pt2 = [centerPt[0]+vec2[0],centerPt[1]+vec2[1]];
            
                drawTriangle( [xy[0],xy[1],pt1[0],pt1[1],pt2[0],pt2[1]])
            }

               
    }
}

/*
                    CUBES
*/

class Cube{
    constructor(){
        this.type = "cube";;
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture,this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

        // Front

        drawTriangle3DUV([0,0,0 , 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0 , 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

        // Back

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3DUV([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0], [0,1, 0,0, 1,1]);
        drawTriangle3DUV([1.0,0.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0], [1,0, 0,0, 1,1]);

        // Top

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0],[0,0, 0,1, 1,1]);
        drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0],[0,0, 1,1, 1,0]);

        // Bottom

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3DUV([1.0,0.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0],[1,0, 0,0, 0,0]);
        drawTriangle3DUV([1.0,0.0,1.0, 0.0,0.0,0.0, 1.0,0.0,0.0],[1,0, 0,0, 1,0]);

        // Left

        gl.uniform4f(u_FragColor,rgba[0]*.8,rgba[1]*.8,rgba[2]*.8,rgba[3]);

        drawTriangle3DUV([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,1.0,0.0],[1,1, 0,1, 1,0]);
        drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,0.0],[0,0, 0,1, 1,0]);

        // Right

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0],[0,0, 0,1, 1,0]);
        drawTriangle3DUV([0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0],[1,1, 1,0, 0,1]);
    }

    renderfast(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture,this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

        var allverts = [];
        var alluv = []
        // Front

        allverts = allverts.concat(0,0,0, 1.0,1.0,0.0, 1.0,0.0,0.0);
        alluv = alluv.concat(0,0, 1,1, 1,0);
        allverts = allverts.concat(0.0,0.0,0.0 , 0.0,1.0,0.0, 1.0,1.0,0.0);
        alluv = alluv.concat(0,0, 0,1, 1,1);

        // Back

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        allverts = allverts.concat(0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0);
        alluv = alluv.concat(0,1, 0,0, 1,1);
        allverts = allverts.concat(1.0,0.0,1.0, 0.0,0.0,1.0, 1.0,1.0,1.0);
        alluv = alluv.concat(1,0, 0,0, 1,1);

        // Top

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        allverts = allverts.concat(0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0);
        alluv = alluv.concat(0,0, 0,1, 1,1);
        allverts = allverts.concat(0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0);
        alluv = alluv.concat(0,0, 1,1, 1,0);

        // Left

        gl.uniform4f(u_FragColor,rgba[0]*.8,rgba[1]*.8,rgba[2]*.8,rgba[3]);

        allverts = allverts.concat(1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,1.0,0.0);
        alluv = alluv.concat(1,1, 0,1, 1,0);
        allverts = allverts.concat(1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,0.0);
        alluv = alluv.concat(0,0, 0,1, 1,0);

        // Right

        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        allverts = allverts.concat(0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0);
        alluv = alluv.concat(0,0, 0,1, 1,0);
        allverts = allverts.concat(0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0);
        alluv = alluv.concat(1,1, 1,0, 0,1);

        if(g_bruh == 1){
            console.log(alluv.length)
            console.log(allverts.length)
            console.log("here")
            g_bruh+=1;
        }

        drawTriangle3DUV(allverts,alluv)
    }

}

var g_bruh = 1

// My second "primitive shape"
class Pyramid{
    constructor(){
        this.type = "pyramid";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = g_segmentCount;
        this.matrix = new Matrix4();
    }

    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);
        
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);
        drawTriangle3D([1.0,0.0,1.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);
        
        gl.uniform4f(u_FragColor,rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.5,1,.5]);

        gl.uniform4f(u_FragColor,rgba[0]*.8,rgba[1]*.8,rgba[2]*.8,rgba[3]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,0.0,1.0, 0.5,1,.5]);
        
        gl.uniform4f(u_FragColor,rgba[0]*.7,rgba[1]*.7,rgba[2]*.7,rgba[3]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,1.0, 0.5,1,.5]);

        gl.uniform4f(u_FragColor,rgba[0]*.6,rgba[1]*.6,rgba[2]*.6,rgba[3]);
        drawTriangle3D([0.0,0.0,1.0, 1.0,0.0,1.0, 0.5,1,.5]);



    }
}

// Camera Stuff //

function cross(other1, other2) {
    // This function should create and return a new vector.
    let v3 = new Vector3(); // Modify this line to calculate cross product between other1 and other2.
  
    v3.elements[0] = ((other1.elements[1]*other2.elements[2]) - (other1.elements[2]*other2.elements[1]))
    v3.elements[1] = -((other1.elements[0]*other2.elements[2]) - (other1.elements[2]*other2.elements[0]))
    v3.elements[2] = ((other1.elements[0]*other2.elements[1]) - (other1.elements[1]*other2.elements[0]))
  
    return v3;
  }

class Camera{
    constructor(){
        this.eye = new Vector3([0,0,0]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.fov = 60;
        this.speed = .1;
        this.alpha = 15
    }
    moveForward(){
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        f = f.normalize();
        f = f.mul(this.speed);
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);

    }
    moveBack(){
        let b = new Vector3();
        b = b.set(this.eye);
        b = b.sub(this.at);
        b = b.normalize();
        b = b.mul(this.speed);
        this.eye = this.eye.add(b);
        this.at = this.at.add(b);
    }
    moveLeft(){
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        let s = cross(this.up,f);
        s = s.normalize();
        s = s.mul(this.speed);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }
    moveRight(){
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        let s = cross(f,this.up);
        s = s.normalize();
        s = s.mul(this.speed);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }
    panLeft(){
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        var rotateMatLeft = new Matrix4();
        rotateMatLeft.setRotate(this.alpha,this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var f_prime = rotateMatLeft.multiplyVector3(f);
        this.at = this.at.set(this.eye);
        this.at = this.at.add(f_prime);
        angle-=15
    }
    panRight(){
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        var rotateMatLeft = new Matrix4();
        rotateMatLeft.setRotate(-this.alpha,this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var f_prime = rotateMatLeft.multiplyVector3(f);
        this.at = this.at.set(this.eye);
        this.at = this.at.add(f_prime);
        angle+=15
    }
    getPosition(){
        sendTextToHTML(Math.floor(this.eye.elements[0]+20) + "," + Math.floor(this.eye.elements[2]+20) + " angle : " + Math.abs(Math.floor(angle)),"player");
        return [Math.floor(this.eye.elements[0]+20),Math.floor(this.eye.elements[2]+20)]
    }
}

var g_camera = new Camera();

function keydown(){
    document.addEventListener('keypress',function(event){
        switch(event.keyCode){
            case 119:
                g_camera.moveForward();
                break;
            case 115:
                g_camera.moveBack();
                break;    
            case 97:
                g_camera.moveLeft();
                break;
            case 100:
                g_camera.moveRight();
                break;
            case 113:
                g_camera.panLeft();
                break;
            case 101:
                g_camera.panRight();
                break;
            case 114:
                /*
                var playerAngle = Math.abs(Math.floor(angle));
                var playerPos = g_camera.getPosition()
                if(playerAngle < 45){
                    if(g_map[playerPos[0]][playerPos[1]-1] > 0){
                        break;
                    }
                    g_map[playerPos[0]][playerPos[1]-1] = 1
                }else if(playerAngle > 135 && playerAngle < 270){
                    if(g_map[playerPos[0]][playerPos[1]-1] > 0){
                        break;
                    }
                    g_map[playerPos[0]][playerPos[1]+1] = 1
                }else if(playerAngle > 45 && Math.sign(angle) == -1){
                    if(g_map[playerPos[0]][playerPos[1]-1] > 0){
                        break;
                    }
                    g_map[playerPos[0]-1][playerPos[1]] = 1
                }else if(playerAngle < 225 && Math.sign(angle) == 1){
                    if(g_map[playerPos[0]][playerPos[1]-1] > 0){
                        break;
                    }
                    g_map[playerPos[0]+1][playerPos[1]] = 1
                }*/
                var playerPos = g_camera.getPosition()
                g_map[playerPos[0]][playerPos[1]] = 1
                break;
            case 102:
                /*
                var playerAngle = Math.abs(Math.floor(angle));
                var playerPos = g_camera.getPosition()
                if(playerAngle < 45){
                    g_map[playerPos[0]][playerPos[1]-1] = 0
                }else if(playerAngle > 135 && playerAngle < 270){
                    g_map[playerPos[0]][playerPos[1]+1] = 0
                }else if(playerAngle > 45 && Math.sign(angle) == -1){
                    g_map[playerPos[0]-1][playerPos[1]] = 0
                }else if(playerAngle < 225 && Math.sign(angle) == 1){
                    g_map[playerPos[0]+1][playerPos[1]] = 0
                }*/
                var playerPos = g_camera.getPosition()
                g_map[playerPos[0]][playerPos[1]] = 0
                console.log("here")
                break;
            default:
                console.log(event.keyCode);
                break;
        }
    });
}

let mousePos = [0,0];
let deltaPos = [0,0];
let prevPos = [0,0];
let angle = 0

function mouseLook(event){
    document.addEventListener('mousemove',function(event){
        mousePos[0] = event.x;
        mousePos[1] = event.y;

        deltaPos[0] = mousePos[0] - prevPos[0];
        
        angle += deltaPos[0];
        angle = angle % 360

        let f = new Vector3();
        f = f.set(g_camera.at);
        f = f.sub(g_camera.eye);
        var rotateMatLeft = new Matrix4();
        rotateMatLeft.setRotate(-deltaPos[0],g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]);
        var f_prime = rotateMatLeft.multiplyVector3(f);
        g_camera.at = g_camera.at.set(g_camera.eye);
        g_camera.at = g_camera.at.add(f_prime);

        prevPos[0] = mousePos[0];




    });

}

/*
function placeBlock(){
    var playerPos = g_camera.getPosition()
    document.addEventListener("mousedown", function(event){
        if(event.button == 2){
            g_map[playerPos[0]][playerPos[1]] = 1;
        }else if(event.button == 0){
            g_map[playerPos[0]][playerPos[1]] = 0;
        }
    });
}*/

// Map //

let g_map = [
    [10,10,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,10,10],
    [10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,0,0,2,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,2,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,2,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,2,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,2,2,2,2,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,0,0,0,2,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,0,0,0,0,0,2,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,2,0,0,2,2,2,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,2,0,0,0,0,2,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,2,0,0,0,0,2,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,2,2,2,2,2,2,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10],
    [10,10,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,5,4,10,10],
]

function drawMap(){
    for(x=0;x<32;x++){
        for(y=0;y<32;y++){
            if(g_map[x][y]>0){
                for(z=0;z<g_map[x][y];z++){
                    var body = new Cube();
                    body.textureNum = 2
                    body.matrix.translate(x-20,-.75+z,y-20);
                    body.renderfast();
                }
            }
        }
    }
}

// UV and Texturing //

function initTextures(gl, n){
    // Get the storage location of the u_Sampler
    var image0 = new Image(); // Create an image object
    var image1 = new Image();
    var image2 = new Image();

    var texture0 = gl.createTexture(); // Create a texture object
    var texture1 = gl.createTexture(); // Create a texture object
    var texture2 = gl.createTexture();

    image0.onload = function(){ sendTextureToGLSL(texture0, u_Sampler0, image0, 0); };
    image0.src = "grass.jpg";

    image1.onload = function(){ sendTextureToGLSL(texture1, u_Sampler1, image1, 1); };
    image1.src = "sky.png";

    image2.onload = function(){ sendTextureToGLSL(texture2, u_Sampler2, image2, 2); }
    image2.src = "cobble.png";

    return true;
}


function sendTextureToGLSL(texture,u_Sampler,image,texUnit){
    console.log(texUnit)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    
    if(texUnit == 0){
        gl.activeTexture(gl.TEXTURE0);
    } else if(texUnit == 1){
        gl.activeTexture(gl.TEXTURE1);
    } else if(texUnit == 2){
        gl.activeTexture(gl.TEXTURE2);
    }
    
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
    gl.uniform1i(u_Sampler,texUnit);

    console.log("Finished load_texture");
}



// WEBGL SETUP & MAIN //

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById("asg3");

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
      }

      // // Get the storage location of a_Position
      a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
      }

      a_UV = gl.getAttribLocation(gl.program, 'a_UV');
      if (a_UV < 0){
        console.log("Failed to get the storage location of a_UV");
        return;
      }
    
      // Get the storage location of u_FragColor
      u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
      if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
      }

      u_ProjectionMatrix = gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
      if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
      }

      u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
      if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
      }

      u_whichTexture = gl.getUniformLocation(gl.program,'u_whichTexture');
      if (!u_whichTexture) {
        console.log("Failed to get the storage location of u_whichTexture");
        return;
      }

      // Textures

      u_Sampler0 = gl.getUniformLocation(gl.program,'u_Sampler0');
      if (!u_Sampler0) {
        console.log("Failed to get the storage location of u_Sampler0");
        return;
      }

      u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1');
      if (!u_Sampler1) {
        console.log("Failed to get the storage location of u_Sampler1");
        return;
      }

      u_Sampler2 = gl.getUniformLocation(gl.program,'u_Sampler2');
      if (!u_Sampler2) {
        console.log("Failed to get the storage location of u_Sampler2");
        return;
      }

      //---------

      u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
      if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
      }

      u_GlobalRotateMatrix = gl.getUniformLocation(gl.program,'u_GlobalRotateMatrix');
      if (!u_GlobalRotateMatrix) {
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return;
      }

      var identityM = new Matrix4();
      gl.uniformMatrix4fv(u_ModelMatrix,false,identityM.elements);

}

function convertCoordinatesEventToGL(ev){

    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

//var g_eye = [0,0,3];
//var g_at=[0,0,-100];
//var g_up=[0,1,0];

function renderGnome(){
    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.matrix.translate(-.25,-.3,1.5);
    body.matrix.rotate(0,1,0,0)
    body.matrix.rotate(-g_bodyAngle,1,0,0)
    var bodyCoords = new Matrix4(body.matrix);
    body.matrix.scale(.5,.6,.3);
    body.render(); 

    var arm2 = new Cube();
    arm2.color = [0.5,0.0,0.0,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(.6,0,.05)
    arm2.matrix.rotate(180,0,0,1)
    arm2.matrix.rotate(180,0,1,0)
    arm2.matrix.translate(-.1,-.6,-.2)
    arm2.matrix.rotate(-g_armAngle,0,0,1)
    var arm2Coords = new Matrix4(arm2.matrix)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var hand1 = new Cube();
    hand1.color = [1.0,1.0,0.0,1.0];
    hand1.matrix = new Matrix4(arm2Coords);
    hand1.matrix.scale(.15,.15,.05)
    hand1.matrix.translate(0,4,1.5);
    hand1.matrix.rotate(-g_handAngle,0,0,1)
    hand1.render();

    var hand2 = new Cube();
    hand2.color = [1.0,1.0,0.0,1.0];
    hand2.matrix = new Matrix4(bodyCoords);
    hand2.matrix.scale(.15,.15,.05)
    hand2.matrix.translate(-1,-1,2);
    hand2.render();

    var arm3 = new Cube();
    arm2.color = [0.5,0.0,0.0,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(-.2,0,.05)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var leg1 = new Cube();
    leg1.color = [0.0,0.0,.5,1.0];
    leg1.matrix.translate(.05,-.9,1.55)
    leg1.matrix.scale(.2,.6,.2);
    leg1.render();

    var leg2 = new Cube();
    leg2.color = [0.0,0.0,.5,1.0];
    leg2.matrix.translate(-.25,-.9,1.55)
    leg2.matrix.scale(.2,.6,.2);
    leg2.render();



    // Head //

    var head = new Cube();
    head.color = [1.0,1.0,0.0,1.0];
    head.matrix = bodyCoords;
    head.matrix.translate(.1,.6,0);
    head.matrix.rotate(-g_headAngle,1,0,0);
    var headCoords = new Matrix4(head.matrix);
    head.matrix.scale(.3,.3,.3);
    head.render(); 

    var hat = new Pyramid();
    hat.color = [1,0,0,1];
    hat.matrix = new Matrix4(headCoords);
    hat.matrix.translate(0,.3,0)
    hat.matrix.scale(.3,.3,.3);
    hat.matrix.translate(0,g_hatTranslate,0)
    hat.render();

    var eye1 = new Cube();
    eye1.color = [.3,.3,.3,1];
    eye1.matrix = new Matrix4(headCoords);
    eye1.matrix.translate(0,.15,-.05)
    eye1.matrix.scale(.12,.1,.05);
    eye1.render();

    var eye2 = new Cube();
    eye2.color = [.3,.3,.3,1];
    eye2.matrix = new Matrix4(headCoords);
    eye2.matrix.translate(.18,.15,-.05)
    eye2.matrix.scale(.12,.1,.05);
    eye2.render();

    var eye3 = new Cube();
    eye3.color = [.3,.3,.3,1];
    eye3.matrix = new Matrix4(headCoords);
    eye3.matrix.translate(0.1,.2,-.05)
    eye3.matrix.scale(.12,.05,.05);
    eye3.render();
}

function renderAllShapes(){
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(g_camera.fov,canvas.width/canvas.height,.1,1000);
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle,1,1,1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

    //placeBlock();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var ground = new Cube();
    ground.color = [1,0,0,1];
    ground.textureNum = 0;
    ground.matrix.translate(0,-.75,0);
    ground.matrix.scale(70,.01,70)
    ground.matrix.translate(-.5,0,-.5);
    ground.render();

    var sky = new Cube();
    sky.color = [1,0,0,1];
    sky.textureNum = 1;
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-.5,-.5,-.5);
    sky.render();

    renderGnome();

    var body = new Cube();
    body.color = [0.0,0.0,1.0,1.0];
    body.matrix.translate(-4.25,-.3,8.5);
    body.matrix.rotate(0,1,0,0)
    body.matrix.rotate(-g_bodyAngle,1,0,0)
    var bodyCoords = new Matrix4(body.matrix);
    body.matrix.scale(.5,.6,.3);
    body.render(); 

    var arm2 = new Cube();
    arm2.color = [0.0,0.0,0.5,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(.6,0,.05)
    arm2.matrix.rotate(180,0,0,1)
    arm2.matrix.rotate(180,0,1,0)
    arm2.matrix.translate(-.1,-.6,-.2)
    arm2.matrix.rotate(-g_armAngle,0,0,1)
    var arm2Coords = new Matrix4(arm2.matrix)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var hand1 = new Cube();
    hand1.color = [1.0,1.0,0.0,1.0];
    hand1.matrix = new Matrix4(arm2Coords);
    hand1.matrix.scale(.15,.15,.05)
    hand1.matrix.translate(0,4,1.5);
    hand1.matrix.rotate(-g_handAngle,0,0,1)
    hand1.render();

    var hand2 = new Cube();
    hand2.color = [1.0,1.0,0.0,1.0];
    hand2.matrix = new Matrix4(bodyCoords);
    hand2.matrix.scale(.15,.15,.05)
    hand2.matrix.translate(-1,-1,2);
    hand2.render();

    var arm3 = new Cube();
    arm2.color = [0.0,0.0,0.5,1.0];
    arm2.matrix = new Matrix4(bodyCoords);
    arm2.matrix.translate(-.2,0,.05)
    arm2.matrix.scale(.2,.6,.2);
    arm2.render();

    var leg1 = new Cube();
    leg1.color = [0.0,0.0,.5,1.0];
    leg1.matrix.translate(-3.95,-.9,8.55)
    leg1.matrix.scale(.2,.6,.2);
    leg1.render();

    var leg2 = new Cube();
    leg2.color = [0.0,0.0,.5,1.0];
    leg2.matrix.translate(-4.25,-.9,8.55)
    leg2.matrix.scale(.2,.6,.2);
    leg2.render();



    // Head //

    var head = new Cube();
    head.color = [1.0,1.0,0.0,1.0];
    head.matrix = bodyCoords;
    head.matrix.translate(.1,.6,0);
    head.matrix.rotate(-g_headAngle,1,0,0);
    var headCoords = new Matrix4(head.matrix);
    head.matrix.scale(.3,.3,.3);
    head.render(); 

    var hat = new Pyramid();
    hat.color = [0,0,1,1];
    hat.matrix = new Matrix4(headCoords);
    hat.matrix.translate(0,.3,0)
    hat.matrix.scale(.3,.3,.3);
    hat.matrix.translate(0,g_hatTranslate,0)
    hat.render();

    var eye1 = new Cube();
    eye1.color = [.3,.3,.3,1];
    eye1.matrix = new Matrix4(headCoords);
    eye1.matrix.translate(0,.15,-.05)
    eye1.matrix.scale(.12,.1,.05);
    eye1.render();

    var eye2 = new Cube();
    eye2.color = [.3,.3,.3,1];
    eye2.matrix = new Matrix4(headCoords);
    eye2.matrix.translate(.18,.15,-.05)
    eye2.matrix.scale(.12,.1,.05);
    eye2.render();

    var eye3 = new Cube();
    eye3.color = [.3,.3,.3,1];
    eye3.matrix = new Matrix4(headCoords);
    eye3.matrix.translate(0.1,.2,-.05)
    eye3.matrix.scale(.12,.05,.05);
    eye3.render();

    drawMap();
    

    //////////////////////////////////////////////////////////


    var duration = performance.now() - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration) + " position : " + g_camera.getPosition(), "numdot");

}

function sendTextToHTML(text,htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let g_globalAngle = 0;
let g_bodyAngle = 0;
let g_headAngle = 0;
let g_armAngle = 0;
let g_handAngle = 0;
let animation = true;
let g_hatTranslate = 0


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    initTextures(gl,0);
    keydown();
    mouseLook();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0
var g_seconds=performance.now()/1000.0-g_startTime;
var timer = 0;

function tick() {

    g_seconds=performance.now()/1000-g_startTime;

    canvas.onmousedown = function(ev){
        console.log("HERE")
        if(ev.buttons){
            console.log(ev.clientX);
            g_globalAngle.x = ev.clientX;
            g_globalAngle.y = ev.clientY;
        }
    }


    updateAnimationAngles();
    canvas.onmousedown = function(ev){
        if((ev.shiftKey && ev.buttons)){
            g_hatTranslate = Math.abs(Math.sin(g_seconds - timer))
            timer = g_seconds;
            console.log(timer)
        }
    }

    if(g_hatTranslate != 0 && (g_seconds - timer < 3)){
        g_hatTranslate = Math.abs(Math.sin(g_seconds - timer))
    }else{
        g_hatTranslate = 0;
    }


    renderAllShapes();
    requestAnimationFrame(tick);
}

function updateAnimationAngles(){
    if(animation){
        g_bodyAngle = 45*Math.sin(g_seconds*10);
        g_armAngle = Math.abs(-30*Math.sin(g_seconds));
        g_headAngle = Math.abs(45*Math.sin(g_seconds*5));
    }
}

