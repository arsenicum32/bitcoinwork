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

axios.get(land).then(function(e) {
  var dt = e.data.features;
  for(var i in dt){
    //console.log(
    //  dt[i].geometry.coordinates
    //);
  }
})

function addCube(coords) {
  //const {x,y,z} = convLLN(coords);
  var geometry = new THREE.Geometry();

  geometry.vertices.push(
  	new THREE.Vector3( -.12,  .12, 0 ),
  	new THREE.Vector3( -.12, -.12, 0 ),
  	new THREE.Vector3(  .12, -.12, 0 )
  );

  geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

  geometry.computeBoundingSphere();
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  //var cube = new THREE.Mesh(geometry, material);

  //var geometry = new THREE.BoxGeometry(.5, .5, .5);
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = coords.x;
  cube.position.y = coords.y;
  cube.position.z = coords.z;
  return cube;
}

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
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    25,//75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  //renderer.setClearColor(new THREE.Color(0x000000, 1.0));
  //renderer.shadowMapEnabled = true;
  renderer.setSize(window.innerWidth, 480); // window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 300;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

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
  material.map.offset.x = .12
  material.map.offset.y = .1
  //);
  //.center.set( 0, 0 );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  //scene.add(cube);
///////////////////


  for (var i in cub) {
    scene.add(cub[i]);
  }

  //scene.add(addCube({ x: 0, y: 1, z: 1 }));

  var constant = 10,
      target = cub[0],

  //{
  //  position: {x:0,y:0,z:0}
  //},
  radius = 2,
      elapsedTime = 0;

  var clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, 480 );
    renderer.render( scene, camera );
  }

  var animate = function animate() {
    elapsedTime += .001;
    var delta = clock.getDelta();
    flyControls.update(delta);
    renderer.clear();
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    //camera.position.x = target.position.x + radius * Math.cos(constant * elapsedTime);
    //camera.position.z = target.position.z + radius * Math.sin(constant * elapsedTime);
    //camera.lookAt(target.position);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
}
