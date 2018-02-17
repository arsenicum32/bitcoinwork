var convLLN = function convLLN(a) {
  var rad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500.0;

  var lat = a[0],
      lon = a[1];
  var cosLat = Math.cos(lat * Math.PI / 180.0);
  var sinLat = Math.sin(lat * Math.PI / 180.0);
  var cosLon = Math.cos(lon * Math.PI / 180.0);
  var sinLon = Math.sin(lon * Math.PI / 180.0);
  return {
    x: rad * cosLat * cosLon,
    y: rad * cosLat * sinLon,
    z: rad * sinLat
  };
};

var link = "/data/cities.json";

var cubes = [];
axios.get(link).then(function (e) {
  cubes = e.data.features.map(function (e) {
    return convLLN(e.geometry.coordinates, 100);
  });
  cubes = cubes.map(function (e) {
    return addCube(e);
  });
  init(cubes);

});

var land = "/data/land.json";

var objs =[]
// axios.get(land).then(function(e) {
//   var dt = e.data.features;
//   for(var i in dt){
//     var cd = dt[i].geometry.coordinates;
//     for(var n in cd){
//
//       //console.log(cd[n][0]);
//       //objs.push( cd[n])//convLLN( cd[n], 100) )
//       scene.add(addCube( convLLN( cd[n][0], 100) ))
//     }
//     //console.log(
//     //  dt[i].geometry.coordinates
//     //);
//   }
// })

function addCube(coords) {
  particle = new THREE.Sprite( materialSprite );
  particle.position.set(
    coords.x,coords.y,coords.z
  );
  particle.scale.x = particle.scale.y = Math.random() * .2 + .5;
  return particle;
}

var keyFrames = [];

var testAnimaion =[
  {"x":300,"y":122,"z":403},
  {"x":220.2461507156409,"y":101.24430322952522,"z":287.1731558226203},
  {"x":157.588194051027,"y":86.02343105908835,"z":207.18646619830943}
];
window.addEventListener('keypress', function(e) {
  console.log('w: ' + JSON.stringify(camera.rotation));
  console.log('p: ' + JSON.stringify(camera.position));
  if(e.keyCode == 32){
    keyFrames.push({
      position: camera.position,
      rotation: camera.rotation
    })
  }
})

function init(cub) {
  var radius = 6371;
  var tilt = 0.41;
  var rotationSpeed = 0.02;

  var cloudsScale = 1.005;
  var moonScale = 0.23;

  var MARGIN = 0;
  var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
  var SCREEN_WIDTH = window.innerWidth;
  ////////
  window.scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000104 );
				scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

  window.camera = new THREE.PerspectiveCamera(
    5,//75,
    window.innerWidth / window.innerHeight, 0.1, 1000);



  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, 480); // window.innerHeight);
  document.body.appendChild(renderer.domElement);


  camera.position.x = 300;
  camera.position.y = 122;
  camera.position.z = 403;
  camera.rotation.x = -0.17731397430259171;
  camera.rotation.y = 0.5956468148773906;
  camera.rotation.z = 0.07089564560095399;

  keyFrames.push({
    position: camera.position,
    rotation: camera.rotation
  })

  /// test TWEEN animation
  // var cp = testAnimaion[0].position ;
  // var tween = new TWEEN.Tween(cp) // Create a new tween that modifies 'coords'.
  //     .to(testAnimaion[1].position , 2000) // Move to (300, 200) in 1 second.
  //     .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
  //     // .onUpdate(function() { // Called after tween.js updates 'coords'.
  //     //     // Move 'box' to the position described by 'coords' with a CSS translation.
  //     //     console.log(cp);
  //     //     camera.position.x = cp.x;
  //     //     camera.position.y = cp.y;
  //     //     camera.position.z = cp.z;
  //     //     // camera.rotation.x = cp.rotation._x;
  //     //     // camera.rotation.y = cp.rotation._y;
  //     //     // camera.rotation.z = cp.rotation._z;
  //     // })
  //     .onStart(e=> {
  //       console.log("start");
  //     })


  ///
  window.flyControls = new THREE.FlyControls(camera);
  flyControls.movementSpeed = 25;
  flyControls.domElement = document.querySelector("#container");
  flyControls.rollSpeed = Math.PI / 24;
  flyControls.autoForward = false;
  flyControls.dragToLook = true;
  var ambientLight = new THREE.AmbientLight(0x383838);
  scene.add(ambientLight);
  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 140, 130);
  spotLight.intensity = 2;
  //scene.add(spotLight);

  //// Glow around Earth
  var geometry = new THREE.SphereGeometry( 100.1, 32, 32 );
  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    emissive: 0xffffff
  })
  material.side = THREE.BackSide
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  ///////


//////////////////

  var geometry = new THREE.SphereGeometry( 100, 32, 32 );
  var material = new
  //THREE.MeshStandardMaterial()
  // THREE.MeshLambertMaterial({
  //   emissive: 0x333333
  // })
  THREE.MeshPhongMaterial()
  material.map
   = THREE.ImageUtils.loadTexture(
    //'images/earthmap1k.jpg'
    'images/earth_lights.gif'
  )
  //console.log(
  window.setSize = function(x, y){
    x?material.map.offset.x = x:null;
    y?material.map.offset.y = y:null;
  }
  //setSize(.13,.045)
  material.map.offset.x = .13
  material.map.offset.y = .045
  //);
  //.center.set( 0, 0 );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  //scene.add(cube);
///////////////////
//////// lines
// for (var i = 0; i < 3000; i++) {
// 					var geometry = new THREE.Geometry();
// 					var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
// 					vertex.normalize();
// 					vertex.multiplyScalar( 100 );
// 					geometry.vertices.push( vertex );
// 					var vertex2 = vertex.clone();
// 					vertex2.multiplyScalar( Math.random() * 0.13 + .9 );
// 					geometry.vertices.push( vertex2 );
// 					var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
// 					scene.add( line );
// 				}
//         ////

  for (var i in cub) {
    scene.add(cub[i]);
  }

  var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );


  //// starts in space
  var geometry = new THREE.Geometry();
				for ( var i = 0; i < 10000; i ++ ) {
					var vertex = new THREE.Vector3();
					vertex.x = THREE.Math.randFloatSpread( 2000 );
					vertex.y = THREE.Math.randFloatSpread( 2000 );
					vertex.z = THREE.Math.randFloatSpread( 2000 );
					geometry.vertices.push( vertex );
				}
  var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
  scene.add( particles );

  var clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, 480 );
    renderer.render( scene, camera );
  }

  var pick1=0,pick2=1;

  setInterval(function(){
    pick1 = Math.floor(Math.random()*cub.length);
    pick2 = Math.floor(Math.random()*cub.length);
  },120)

  var timer = 1 , index = 0;

  var animate = function animate() {
    var delta = clock.getDelta();
    flyControls.update(delta);
    //renderer.clear();

    camera.position.x = testAnimaion[index].x * timer + testAnimaion[index+1].x * (1 - timer);
    camera.position.y = testAnimaion[index].y * timer + testAnimaion[index+1].y * (1 - timer);
    camera.position.z = testAnimaion[index].z * timer + testAnimaion[index+1].z * (1 - timer);

    if(timer > 0){
      timer -= 0.004;
    }else{
      if( index + 1 < testAnimaion.length - 1 ){
        index++;
      }else{
        index=0;
      }
      timer=1;
    }

    //timer > 0 ? timer -= .01 : timer = 1;
    //console.log(delta);

    cub.map((e,i)=>{
      i!=pick1&&i!=pick2?e.scale.x = e.scale.y = Math.random() * .1 + .45:null
    })

    var ob = cub[pick1];
    ob.scale.x = ob.scale.y = Math.random() * 1.2 + .5;
    ob = cub[pick2];
    ob.scale.x = ob.scale.y = Math.random() * 1.2 + .5;

    //ob = cub[Math.floor(Math.random()*cub.length)];
    // ob.scale.x = ob.scale.y = Math.random() * 1.2 + .5;


    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    composer.render();
  };

  var composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );
  //hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
  //composer.addPass( hblur );
  var effectBloom = new THREE.BloomPass( 6.3 );
				//var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
				//effectCopy.renderToScreen = true;
        //composer.addPass( effectBloom );
				//composer.addPass( effectCopy );

  //vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
  //vblur.renderToScreen = true;
  //

  //var effectBloom = new THREE.BloomPass( 0.75 );
  // set this shader pass to render to screen so we can see the effects
  effectBloom.renderToScreen = true;


  composer.addPass( effectBloom );


  //

  var effectFilm = new THREE.FilmPass( .5, .5, window.innerWidth, false );
  effectFilm.renderToScreen = true;
  //composer.addPass( vblur );
  composer.addPass( effectFilm );
  composer.render();
  // var renderModel = new THREE.RenderPass( scene, camera );
	// var effectBloom = new THREE.BloomPass( 0.75 );
	// var effectFilm = new THREE.FilmPass( 0.5, 0.5, 1448, false );
	// effectFocus = new THREE.ShaderPass( THREE.FocusShader );
	// effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth;
	// effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight;
	// effectFocus.renderToScreen = true;
	// composer = new THREE.EffectComposer( renderer );
	// composer.addPass( renderModel );
	// composer.addPass( effectBloom );
	// composer.addPass( effectFilm );
	// composer.addPass( effectFocus );

  animate();
}
