import './app.css';
import * as THREE from 'three';
import {ColorPicker} from './ColorPicker/ColorPicker';

class App {
	constructor({container = document.body}) {	
		this._scene = new THREE.Scene();
		this._camera = this._createCamera();
		this._renderer = this._createRenderer();
    
		this._texture = this._loadTexture('src/test_texture.jpg');
		
		container.appendChild(this._renderer.domElement);

		this._cubes = [];
		this._addCubes();		             			
		this._colorPicker = new ColorPicker({objectsForPicking: this._cubes, renderer: this._renderer, camera: this._camera});

		this._selectedObject = null;   
        
		this._addListeners();

		this._render = this.render.bind(this);
		this._render();
	}

	_addListeners() {
		window.addEventListener('mousemove', this._onMouseMove.bind(this), false);
	}
    
	_onMouseMove(event) {
		this._selectedObject = this._colorPicker.pick(event.clientX, event.clientY);
	}

	_loadTexture(path) {		
		const texture = new THREE.TextureLoader().load(path);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);

		return texture;
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
		const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this._texture});

		const negOrPosRand = () => {
			const neg = Math.random() < 0.5 ? -1 : 1;
			return neg;
		};

		for (let i = 0; i < count; i++) {
			const cube = new THREE.Mesh(boxGeometry, boxMaterial);

			cube.position.set(negOrPosRand() * Math.random() * i * 3, negOrPosRand() * Math.random() * i * 1.5, 0);
		
			this._cubes.push(cube);	
			this._scene.add(cube);			
		}
	}  

	_rotateCubes() {
		for (let i = 0; i < this._cubes.length; i++) {			
			
			if (this._selectedObject === this._cubes[i]) continue;            

			this._cubes[i].rotation.x += 0.01;					
		}       
	}

	render() {
		requestAnimationFrame(this._render);

		this._rotateCubes();

		this._renderer.render(this._scene, this._camera);
	}
}

new App({container: document.getElementById('canvas-container')});