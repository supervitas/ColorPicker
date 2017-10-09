import './app.css';
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
        this._pixelBuffer = new Uint8Array(4);

		this._texture = this._loadTexture();

		this._canvasContainer.appendChild(this._renderer.domElement);

		this._cubes = [];
        this._pickingObjects = [];
        this._selectedObject  = null                	

		this._mouse = new THREE.Vector2();

		this._render = this.render.bind(this);
        
        this._addListeners();

        this._addCubes();
		this._render();
	}

	_addListeners() {
		window.addEventListener('mousemove', this._onMouseMove.bind(this), false);
    }
    
	_onMouseMove(event) {
		this._mouse.x = event.clientX;
        this._mouse.y = event.clientY;
        
		this.pick();
	}

	_loadTexture() {
		const texture = new THREE.TextureLoader().load('src/test_texture.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);

		return texture;
	}

	_createColorPickingRT() {
		const pickingRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
			{ minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

		return pickingRenderTarget;
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

		const pickingMaterial = new THREE.RawShaderMaterial( {
			vertexShader: ColorPickVert,
			fragmentShader: ColorPickFrag,
			uniforms: {
				pickingColor: {
					value: new THREE.Color()
				}
			}
		});

		const negativeRandom = () => {
			const neg = Math.random() < 0.5 ? -1 : 1;
			return neg;
		};

		for (let i = 0; i < count; i++) {
			const cube = new THREE.Mesh(boxGeometry, boxMaterial);

			cube.position.set(negativeRandom() * Math.random() * i * 3, negativeRandom() * Math.random() * i * 1.5, 0);
			
			const pickingObject = cube.clone();
			pickingObject.material = pickingMaterial.clone();
            pickingObject.material.uniforms.pickingColor.value.setHex(i + 1);
            
            this._cubes[i + 1] = cube;
			this._pickingObjects[i + 1] = pickingObject;

            this._scene.add(cube);
			this._pickingScene.add(pickingObject);
		}
    }  

	_rotateCubes() {
		for (let i = 1; i < this._cubes.length; i++) {
            
            if (this._selectedObject === this._cubes[i]) continue;            

            this._cubes[i].rotation.x += 0.01;
            this._pickingObjects[i].rotation.x += 0.01;			
        }       
	}

	render() {
		requestAnimationFrame(this._render);

		this._renderer.autoClear = true;		
				
		this._renderer.render(this._pickingScene, this._camera, this._pickingRenderTarget);
		this._renderer.context.finish();	

		this._rotateCubes();

		this._renderer.render(this._scene, this._camera);
	}

	pick() {
		this._renderer.readRenderTargetPixels(
			this._pickingRenderTarget,
			this._mouse.x,
			this._pickingRenderTarget.height - this._mouse.y,
			1,
			1,
			this._pixelBuffer
		);

        const id = (this._pixelBuffer[ 0 ] << 16) | (this._pixelBuffer[ 1 ] << 8) | (this._pixelBuffer[ 2 ]);
        
        const selectedObject = this._cubes[id];
        
        if (selectedObject) {
            this._selectedObject = selectedObject;            
        } else {
            this._selectedObject = null;
        }
	}
}

new App();