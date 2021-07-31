//Core components
var canvas;			// Reference to the canvas object		
var program;		// Reference to the shader program
var webGL;			// Reference to the WebGL context

//Attribute information
var element = 3;	// Number of elements per vertex
var normal  = 0;	// Don't normalize the data
var stride  = 0;	// Byte size of each set of elements 
var offset  = 0;	// Offset to the start of the first element in a set
var fudge   = 0.80;	// Value required for the perspective view.

//HTML slider states
var input  = [0, 0, 0];		// Value of the X, Y, Z axis input sliders

//Mouse co-ordinates
var mouseInitX = 0;	// X co-ordinate of the mouse when clicked
var mouseInitY = 0;	// Y co-ordinate of the mouse when clicked
var mouseDragX = 0;	// X co-ordinate of the mouse when dragged after clicking the stone
var mouseDragY = 0;	// Y co-ordinate of the mouse when dragged after clicking the stone

//Stone properties
var state  = 0;		// State of the stone (0=NotClicked, 1=Clicked, 2=Launched); 
var slice  = 120;		// Number of layers in the sphere 
var radius = 0.5;	// Radius of the sphere

//Default transformation values
var sTrans = [  0.00, -0.20,  0.00 ];	// Default translation of the stone
var sRotat = [  0.00,  0.00,  0.00 ];	// Default rotation of the stone
var sScale = [  0.15,  0.15,  0.15 ];	// Default scale of the stone

var bTrans = [  0.00, -0.50,  0.00 ];	// Default translation of the base
var bRotat = [  0.00,  0.00,  0.00 ];	// Default rotation of the base
var bScale = [  0.50,  0.50,  0.50 ];	// Default scale of the base

//Physics Attributes
var horDrag = 0.0001;		// Horizontal Drag
var gravity = 0.01;			// Gravity (Vertical Drag)
var projOffset = [0, 0, 0];	// Offset of the projectile from physics
var projForce  = [0, 0, 0];	// Force vector that acts on the projecile

//GL Buffers
var sVertex = [];	// Holds the vertex information of the stone
var sColor = [];	// Holds the color information of the stone


//Converts degrees to radians
function DegToRad(degree) { return degree*Math.PI/180; }
//Converts radians to degrees
function RadToDeg(radian) { return radian*180/Math.PI; }

//Fills a buffer "buff" with vertex informations of a sphere with "r" radius and "sl" slices/layers
function MakeSphere(r, sl, buff)
{
	var lRad;	// Radius of the lower layer
	var uRad;	// Radius of the upper layer
	
	//Constructing the bottom Triangle Fan
	for(i = 0; i < sl; i++)
	{
		lRad = Math.sqrt(Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * 0))), 2));
		uRad = Math.sqrt(Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * 1))), 2));
		

		buff.push(lRad * Math.sin(DegToRad(360 / sl) * i));
		buff.push(-r * Math.cos(DegToRad(180 / sl) * 0));
		buff.push(lRad * Math.cos(DegToRad(360 / sl) * i));
		
		buff.push(uRad * Math.sin(DegToRad(360 / sl) * i));
		buff.push(-r * Math.cos(DegToRad(180 / sl) * 1));
		buff.push(uRad * Math.cos(DegToRad(360 / sl) * i));
		
		buff.push(uRad * Math.sin(DegToRad(360 / sl) * (i + 1)));
		buff.push(-r * Math.cos(DegToRad(180 / sl) * 1));
		buff.push(uRad * Math.cos(DegToRad(360 / sl) * (i + 1)));
	}
	
	//Constructing the body
	for(i = 1; i < sl-1; i++)
	{
		lRad = Math.sqrt(Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * i))), 2));
		uRad = Math.sqrt(Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * (i + 1)))), 2));
		
		for(j = 0; j < sl+1; j++)
		{		
			buff.push(lRad * Math.sin(DegToRad(360 / sl * j)));
			buff.push(-r * Math.cos(DegToRad(180 / sl * i)));
			buff.push(lRad * Math.cos(DegToRad(360 / sl * j)));
		
			buff.push(uRad * Math.sin(DegToRad(360 / sl * (j + 1))));
			buff.push(-r * Math.cos(DegToRad(180 / sl * (i + 1))));
			buff.push(uRad * Math.cos(DegToRad(360 / sl * (j + 1))));
		
			buff.push(lRad * Math.sin(DegToRad(360 / sl * (j + 1))));
			buff.push(-r * Math.cos(DegToRad(180 / sl * i)));
			buff.push(lRad * Math.cos(DegToRad(360 / sl * (j + 1))));
			
			buff.push(uRad * Math.sin(DegToRad(360 / sl * j)));
			buff.push(-r * Math.cos(DegToRad(180 / sl * (i + 1))));
			buff.push(uRad * Math.cos(DegToRad(360 / sl * j)));
		
			buff.push(uRad * Math.sin(DegToRad(360 / sl * (j + 1))));
			buff.push(-r * Math.cos(DegToRad(180 / sl * (i + 1))));
			buff.push(uRad * Math.cos(DegToRad(360 / sl * (j + 1))));
		
			buff.push(lRad * Math.sin(DegToRad(360 / sl * j)));
			buff.push(-r * Math.cos(DegToRad(180 / sl * i)));
			buff.push(lRad * Math.cos(DegToRad(360 / sl * j)));
		
		}
	}
	
	//Constructing the Top Triangle Fan
	for(i = 0; i < sl; i++)
	{
		lRad = Math.sqrt( Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * 0))), 2));
		uRad = Math.sqrt( Math.pow(r, 2) - Math.pow(r * (Math.cos(DegToRad(180 / sl * 1))), 2));

		
		buff.push(lRad * Math.sin(DegToRad(360 / sl) * i));
		buff.push(-r * Math.cos(DegToRad(180 / sl * sl)));
		buff.push(lRad * Math.cos(DegToRad(360 / sl) * i));
		
		buff.push(uRad * Math.sin(DegToRad(360 / sl) * (i+1)));
		buff.push(-r * Math.cos(DegToRad(180 / sl * (sl- 1 )) * 1));
		buff.push(uRad * Math.cos(DegToRad(360 / sl) * (i + 1)));
		
		buff.push(uRad * Math.sin(DegToRad(360 / sl) * i));
		buff.push(-r * Math.cos(DegToRad(180 / sl * (sl - 1)) * 1));
		buff.push(uRad * Math.cos(DegToRad(360 / sl) * i));
	}
}

//Colors "num" number of triangles into solid shapes and stores values in buffer "buff".
//A sample color is taken in the form of R,G,B,and it's made lighter with a random value not greater than "dev" deviation
function LoadColors(R, G, B, dev, num, buff)
{
	for(i = 0, rand = Math.random() * dev; i < num; i++, rand = Math.random() * dev)
	{	
		buff.push(R+rand);
		buff.push(G+rand);
		buff.push(B+rand);
	}
}

window.onload = function setup()
{  
	//Callback functions for the sliders to update values when cahnged
	document.getElementById("XSlider").oninput = function(evt) { input[0] = Number(evt.target.value); }
	document.getElementById("YSlider").oninput = function(evt) { input[1] = Number(evt.target.value); }
	document.getElementById("ZSlider").oninput = function(evt) { input[2] = Number(evt.target.value); }
	
	//Getting the Canvas and WebGL references
	//(canvas name matches the one in Apple.html)
	canvas = document.getElementById( "Canvas" );
	webGL = WebGLUtils.setupWebGL( canvas );
    if ( !webGL ) { alert( "WebGL isn't available" ); }
	
	//Setup the default state of the canvas
	webGL.viewport( 0, 0, canvas.width, canvas.height );
    webGL.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	//Load Shaders specified in Apple.html
	//(Shader function names in parameter match the ones in Apple.html)
	program = initShaders( webGL, "vertexShader", "fragmentShader" );
    webGL.useProgram( program );
	
	//Get the reference of the fudge factor in the shader, and set it to a value
	var factorLoc = webGL.getUniformLocation(program, "fudgeFac");
	webGL.uniform1f(factorLoc, fudge);
	
	//Enable hiding backward facing polygons
	webGL.enable(webGL.CULL_FACE);
	//Enable hiding parts of polygons based on depth
	webGL.enable(webGL.DEPTH_TEST);
	
	//Create the vertices for the models
	MakeSphere(radius, slice, sVertex);
	
	//Apply colors to the vertices
	LoadColors(Math.random() * 0.5,  Math.random() * 0.5,  Math.random() * 0.5, 0.2, sVertex.length, sColor);
	LoadColors(0.54, 0.38, 0.11, 0.2, 272*3, bColor=[]);
	
	
	//Event listener for clicking the mouse
	//Dragging is initiated when the user clicks on the stone
	canvas.onmousedown= function(e) 
	{
		if(state==0)
		{
			var rect = canvas.getBoundingClientRect();
			mouseDragX=mouseInitX=((e.x-rect.left) - (canvas.width/2))/(canvas.width/2);
			mouseDragY=mouseInitY=((canvas.height-e.y+rect.top) - (canvas.height/2))/(canvas.height/2);
		
			var XDist = Math.pow((input[0] + sTrans[0]) / (1 + (input[2] + sTrans[2]) * fudge) - mouseInitX, 2);
			var YDist = Math.pow((input[1] + sTrans[1]) / (1 + (input[2] + sTrans[2]) * fudge) - mouseInitY, 2);
			var sRadi = Math.pow(radius * sScale[0] / (1 + (input[2] + sTrans[2]) * fudge), 2);
		
			if(XDist+YDist<sRadi)
			{	console.log("Clicked");
				state=1;
			}
		}
	}
	
	//Event listener for releasing the mouse click
	//If the rock was clicked, it launches it forward
	canvas.onmouseup= function(e) 
	{
		if(state==1)
		{
			state=2;
			
			var offsetY=mouseInitY-mouseDragY;
			var offsetX=mouseInitX-mouseDragX;
			projForce[0] = offsetX > 0.3 ? 0.3 : offsetX < -0.3 ?  -0.3 : offsetX;
			projForce[1] = offsetY > 0.3 ? 0.3 : offsetY < 0 ?  0 : offsetY;
			projForce[2] = offsetY > 0.3 ? 0.3 : offsetY < 0 ?  0 : offsetY;
		}
    }
	
	//Event listener for moving the mouse
	//If the stone is clicked, it updates the mouse position to calculate distance pulled
	canvas.onmousemove= function(e) 
	{
		if(state==1)
		{
			var rect = canvas.getBoundingClientRect();
			mouseDragX=((e.x-rect.left) - (canvas.width/2))/(canvas.width/2);
			mouseDragY=((canvas.height-e.y+rect.top) - (canvas.height/2))/(canvas.height/2);
		}
    }
	
	render();
}

//Loads a set of vertices and colors with a specified transform matrix into the shader
function LoadObject(ve, co, tr)
{
	//Create a buffer for vertices and bind it to the pipeline
	var verticeBuff = webGL.createBuffer();
	webGL.bindBuffer( webGL.ARRAY_BUFFER, verticeBuff );
	webGL.bufferData( webGL.ARRAY_BUFFER, new Float32Array(ve), webGL.STATIC_DRAW );
	
	//Configure the attribute to read vertex information correctly
	var veCoords = webGL.getAttribLocation( program, "veCoords" );
	webGL.vertexAttribPointer(veCoords, element, webGL.FLOAT, normal, stride, offset);
	webGL.enableVertexAttribArray( veCoords );
	
	//Create a buffer for vertices and bind it to the pipeline
	var colorBuff = webGL.createBuffer();
    webGL.bindBuffer( webGL.ARRAY_BUFFER, colorBuff );
	webGL.bufferData( webGL.ARRAY_BUFFER, new Float32Array(co), webGL.STATIC_DRAW );
	
	//Configure the attribute to read vertex information correctly
	var veColors = webGL.getAttribLocation( program, "veColors" );
	webGL.vertexAttribPointer(veColors, element, webGL.FLOAT, normal, stride, offset);
	webGL.enableVertexAttribArray( veColors );
	
	//Get the reference of the transfromation matrix in the shader, and set it to
	//The transformation specified in the parameter list.
	var transform = webGL.getUniformLocation(program, "transform");
	webGL.uniformMatrix4fv(transform, false, tr);
}

//Clamps a transformation of the stone when dragged on the X axis
function ClampDragX(trans, min, max)
{
	var offset=mouseInitX-mouseDragX;
	return offset > max ? trans-max : offset < min ?  trans-min : trans-offset;
}

//Clamps a transformation of the stone when dragged on the Y axis
function ClampDragY(trans, min, max)
{
	var offset=mouseInitY-mouseDragY;
	return offset > max ? trans-max : offset < min ?  trans-min : trans-offset;
}

//Moves the object according to the forces acting on it, and modifies the forces
function ApplyForce(force, transform)
{
	transform[0]+=force[0];
	transform[1]+=force[1];
	transform[2]+=force[2];
	
	force[0] = Math.abs(force[0]) < horDrag ? 0 : force[0] < 0 ? force[0]+horDrag : force[0]-horDrag;
	force[1] = force[1] - gravity;
	force[2] = force[2] < horDrag ? 0 : force[2]-horDrag;
}

//Renders the scene
function render()
{
	//If the stone is launched, apply physics
	if(state==2) { ApplyForce(projForce, projOffset); }
		
		
	//Setup matrices for transformations 
	var sMatrix = m4.multiply(m4.scaling(sScale[0], 
										 sScale[1], 
										 sScale[2]),
							  m4.translation( ClampDragX(sTrans[0] + input[0] + projOffset[0], -0.2, 0.2), 
							                  ClampDragY(sTrans[1] + input[1] + projOffset[1], 0, 0.2),
											  ClampDragY(sTrans[2] + input[2] + projOffset[2], 0, 0.2)));
											  
											  
	var bMatrix = m4.multiply(m4.scaling(bScale[0], 
										 bScale[1], 
										 bScale[2]), 
							  m4.translation(bTrans[0] + input[0], 
							                 bTrans[1] + input[1], 
											 bTrans[2] + input[2]));
	
	//Clear the color buffer and depth buffer
	webGL.clear( webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
    
	//Load the buffers with the apple's data, and draw it
	LoadObject(sVertex, sColor, sMatrix);
	webGL.drawArrays( webGL.TRIANGLES, 0, sVertex.length/3 );
	
	//Load the buffers with the shadow's data, and draw it
	LoadObject(bVertex, bColor, bMatrix);
    webGL.drawArrays( webGL.TRIANGLES, 0, bVertex.length/3 );
	
	requestAnimationFrame(render);
}