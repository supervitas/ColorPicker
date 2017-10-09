import * as THREE from 'three';
import ColorPickVert from './ColorPick.vert';
import ColorPickFrag from './ColorPick.frag';

class ColorPicker {
	constructor({objectsForPicking, renderer, camera}) {
		this._objectsForPicking = objectsForPicking;
		this._renderer = renderer;
		this._camera = camera;
		
		this._objectsById = new Map();

		this._pickingRenderTarget = this._createColorPickingRT();
		this._pickingScene = new THREE.Scene();
		this._pixelBuffer = new Uint8Array(4);
        
		this._initColorPicking();
	}

	_createColorPickingRT() {
		const pickingRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
			{ minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

		return pickingRenderTarget;
	}
    
	_initColorPicking() {
		const pickingMaterial = new THREE.RawShaderMaterial({
			vertexShader: ColorPickVert,
			fragmentShader: ColorPickFrag,
			uniforms: {
				pickingColor: {
					value: new THREE.Color()
				}
			}
		});

		for (let i = 0; i < this._objectsForPicking.length; i++) {

			const pickingObject = this._objectsForPicking[i].clone();
			pickingObject.material = pickingMaterial.clone();
			pickingObject.material.uniforms.pickingColor.value.setHex(i + 1);            					
		
			this._pickingScene.add(pickingObject);            
			this._objectsById.set(i + 1, this._objectsForPicking[i]);
		}
	}

	pick(x, y) {
		this._renderer.autoClear = true;				
		this._renderer.render(this._pickingScene, this._camera, this._pickingRenderTarget);
		this._renderer.context.finish();	

		this._renderer.readRenderTargetPixels(
			this._pickingRenderTarget,
			x,
			this._pickingRenderTarget.height - y,
			1,
			1,
			this._pixelBuffer
		);

		const id = (this._pixelBuffer[0] << 16) | (this._pixelBuffer[1] << 8) | (this._pixelBuffer[2]);        		   
                        
		return this._objectsById.get(id)|| null;
	}
}
export {ColorPicker};