import "./app.css";
import * as THREE from 'three';
import ColorPickVert from './ColorPick.vert';
import ColorPickFrag from './ColorPick.frag';

class App {
    constructor() {
        this._canvasContainer = document.getElementById('canvas-container');
        
        this._scene = new THREE.Scene();        
        this._camera = this._createCamera();            
        this._renderer = this._createRenderer();        
        this._pickingRenderTarget = this._createColorPickingRT();   
        this._pickingScene = new THREE.Scene();

        this._texture = this._loadTexture();

        this._canvasContainer.appendChild(this._renderer.domElement);            

        this._cubes = [];
        this._addCubes();

        this._mouse = new THREE.Vector2();

        this._render = this.render.bind(this);

        this._addListeners();
        this._render();
    }

    _addListeners() {
        window.addEventListener("click", this._onMouseMove.bind(this), false);
    }
    _onMouseMove(event) {         
        this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        this._checkIntersections();
    }

    _loadTexture() {
        const texture = new THREE.TextureLoader().load("src/test_texture.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture;
    }

    _createColorPickingRT() {
        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        pickingRenderTarget.texture.generateMipmaps = false;
        pickingRenderTarget.texture.minFilter = THREE.NearestFilter;

        return renderTarget;
    }

    _createRenderer() {
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        return renderer;
    }

    _createCamera() {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        return camera;
    }

    _addCubes(count = 10) {
        const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1 );
        const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this._texture });

        const negativeRandom = () => {
            const neg = Math.random() < 0.5 ? -1 : 1
            return neg;
        };
        
        for (let i = 0; i < count; i++) {
            const cube = new THREE.Mesh(boxGeometry, boxMaterial);
            
            cube.position.set(negativeRandom() * Math.random() * i * 2, negativeRandom() * Math.random() * i * 2, 0);

            this._cubes.push(cube);
            this._scene.add(cube);                        
        }
    }

    _rotateCubes() {
        for (const cube of this._cubes) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
    }

    render() {
        requestAnimationFrame(this._render);
                
        this._rotateCubes();        
        this._renderer.render(this._scene, this._camera);        
    }

    _checkIntersections() {
        this._raycaster.setFromCamera(this._mouse, this._camera);
        const intersects = this._raycaster.intersectObjects(this._cubes);

        for (const intersected of intersects) {
            
        }       
    }
}

new App();