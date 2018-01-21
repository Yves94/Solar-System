/*
*   Planet class
*   This class build a planet.
*/
function Planet( name, radius, resolution, distance, rotation_period, revolution_period ) {

    // Name of the planet [String]
    this.name = name;
    
    // Radius of the planet [Number]
    this.radius = radius;

    // Number of vertical and horizontal segment [Number]
    this.resolution = resolution;

    // Distance from the host star. [Number]
    this.pos_x = distance;
    this.pos_y = 0;
    this.pos_z = 0;

    // 1 day
    this.rotation_period = rotation_period;

    // 1 year
    this.revolution_period = revolution_period;

    this.texture = new THREE.MeshStandardMaterial();
    this.mesh = null;
    this.orbit = null;

    this.Texture = function( image ) {

        this.texture = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0
        });

        var textureLoader = new THREE.TextureLoader();
        
        var texture = this.texture;

        textureLoader.load( image, function( map ) {
            map.anisotropy = 4;
            texture.map = map;
            texture.needsUpdate = true;
        });

        return this;

    }

    this.Build = function() {

        var geometry = new THREE.SphereGeometry( this.radius, this.resolution, this.resolution );
        
        var mesh = new THREE.Mesh( geometry, this.texture );

        mesh.name = this.name;
        mesh.position.set( this.pos_x, this.pos_y, this.pos_z );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.mesh = mesh;

        scene.add( mesh );

        this.Orbit();
        
        celestial_body.push( this );

        return this;

    }

    this.Orbit = function() {
        
        // Orbit path
        
        var geometry = new THREE.RingGeometry( this.pos_x, this.pos_x + 0.01, this.resolution * 2 );

        var texture = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

        var mesh = new THREE.Mesh( geometry, texture );

        mesh.position.set( 0, 0, 0 );
        mesh.rotation.set( 67.55, 0, 0 );

        scene.add( mesh );

        // Orbit mouvement

        this.orbit = new THREE.Object3D();
        scene.add( this.orbit );
        
        var pivot = new THREE.Object3D();
        pivot.rotation.y = 0;
        this.orbit.add( pivot );

        pivot.add( this.mesh );

        return this;

    }

    this.Animate = function () { 

        // Animate rotation period
        this.mesh.rotation.y += this.rotation_period;

        // Animate revolution period
        this.orbit.rotation.y += this.revolution_period;

    }
}
