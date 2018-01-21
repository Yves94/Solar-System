/*­\
|*| Main Variable
\*/

var camera, controls, scene, renderer, stats;
var planet_mesh, light_texture, planet_orbit_geometry, planet_selected_mesh;
var celestial_body = [];
var light_mesh;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

/*­\
|*| Constant
\*/

var camera_scope = 100;
var camera_init = { x: -0, y: 50, z: 0 };

var sky_dimension = 50;

/*­\
|*| Functions
\*/

init();
buildSystem();
animate();

function init() {

    // Stats FPS
    stats = new Stats();
    document.body.appendChild( stats.dom );

    // Camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, camera_scope );
	camera.position.set(camera_init.x, camera_init.y, camera_init.z);
    
    // Controls
    controls = new THREE.OrbitControls( camera );
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Scene
    scene = new THREE.Scene();

    // Axes X,Y,Z
    scene.add( new THREE.AxesHelper( 20 ) );

    // Light
    light_texture = new THREE.MeshStandardMaterial( {
        emissive: 0xffffff,
        emissiveIntensity: 1,
        color: 0x000000
    });

    var light_geometry = new THREE.SphereBufferGeometry( 3, 32, 32 );
    var light_mesh = new THREE.PointLight( 0xffffff, 3, 0, 2 );
    light_mesh.add( new THREE.Mesh( light_geometry, light_texture ) );
    light_mesh.position.set( 0, 0, 0 );
    light_mesh.castShadow = true;

    scene.add( light_mesh );
    

    var light_hemisphere = new THREE.HemisphereLight( 0x000000, 0x0f0e0d, 0.005 );
    scene.add( light_hemisphere );

    // Render
    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.physicallyCorrectLights = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function buildSystem() {
    var mars = new Planet('Mars', 1, 32, 6, 0.005, 0.0005).Build();
    celestial_body.push(mars);

    var terre = new Planet('Terre', 3, 32, 15, 0.005, 0.0005).Build();
    celestial_body.push(terre);
}

function animate() {

    requestAnimationFrame( animate );
    
    // Light
    renderer.toneMappingExposure = Math.pow( 3, 5.0 );

    celestial_body.forEach(function(cb) {
        cb.Animate();
    });

    // Camera value GUI
    $('.camX').html(Math.round(camera.position.x * 100) / 100);
    $('.camY').html(Math.round(camera.position.y * 100) / 100);
    $('.camZ').html(Math.round(camera.position.z * 100) / 100);

    renderer.render( scene, camera );

    controls.update();
    TWEEN.update();
    stats.update();

}

function resetCamera() {

    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    var tween = new TWEEN.Tween(from)
        .to(camera_init, 600)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .onComplete(function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .start();

}