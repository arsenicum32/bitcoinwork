

			//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var mesh, renderer, scene, camera;

var gui;

var API = {
	offsetX: 0,
	offsetY: 0,
	repeatX: 0.25,
	repeatY: 0.25,
	rotation: Math.PI / 4, // positive is counter-clockwise
	centerX: 0.5,
	centerY: 0.5
};


init();
render();


function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 10, 15, 25 );
	scene.add( camera );

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.minDistance = 20;
	controls.maxDistance = 50;
	controls.maxPolarAngle = Math.PI / 2;

	var geometry = new THREE.BoxGeometry( 10, 10, 10 );

	var loader = new THREE.TextureLoader();
	var texture = loader.load( 'images/earthmap1k.jpg', render );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	texture.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

	var material = new THREE.MeshBasicMaterial( { map: texture } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	updateUvTransform();

	initGui();

	window.addEventListener( 'resize', onWindowResize, false );

}

function render() {

	renderer.render( scene, camera );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function updateUvTransform() {

	var texture = mesh.material.map;
  //texture.matrixAutoUpdate = true;

	if ( texture.matrixAutoUpdate === false ) {

		texture.offset = {x:  API.offsetX,y: API.offsetY };
		texture.repeat = {x: API.repeatX,y: API.repeatY };
		texture.center = {x: API.centerX,y: API.centerY };
		texture.rotation = API.rotation; // rotation is around [ 0.5, 0.5 ]

	} else {

		// one way...
		texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );

		// another way...
    // console.log(texture);
		// texture.matrix
		//     .identity()
		//     .translate( - API.centerX, - API.centerY )
		//     .rotate( API.rotation )					// I don't understand how rotation can preceed scale, but it seems to be required...
		//     .scale( API.repeatX, API.repeatY )
		//     .translate( API.centerX, API.centerY )
		//     .translate( API.offsetX, API.offsetY );

	}

	render();

}

function initGui() {

	var drop;

	gui = new dat.GUI();

	gui.add( API, 'offsetX', 0.0, 1.0 ).name( 'offset.x' ).onChange( updateUvTransform );
	gui.add( API, 'offsetY', 0.0, 1.0 ).name( 'offset.y' ).onChange( updateUvTransform );
	gui.add( API, 'repeatX', 0.25, 2.0 ).name( 'repeat.x' ).onChange( updateUvTransform );
	gui.add( API, 'repeatY', 0.25, 2.0 ).name( 'repeat.y' ).onChange( updateUvTransform );
	gui.add( API, 'rotation', - 2.0, 2.0 ).name( 'rotation' ).onChange( updateUvTransform );
	gui.add( API, 'centerX', 0.0, 1.0 ).name( 'center.x' ).onChange( updateUvTransform );
	gui.add( API, 'centerY', 0.0, 1.0 ).name( 'center.y' ).onChange( updateUvTransform );

}
