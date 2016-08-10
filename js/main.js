var scene = null;
var camera = null;
var particles = null;
var particleCount = 20000;

var main = function(global) {
	scene = new THREE.Scene();
	
	var width 	= window.innerWidth;
	var height 	= window.innerHeight;
	var fov 	= 60;				// 画角
	var aspect	= width / height;	// 撮影結果縦横比
	var near	= 1;				// ニアークリップの距離（ここより近い部分は描画されない）
	var far		= 1000;				// ファークリップの距離（ここより遠い部分は描画されない）
	camera	= new THREE.PerspectiveCamera( fov, aspect, near, far );

	// カメラの位置を設定
	camera.position.set( 0, 0, 120 );

	// ページにレンダラーを追加する
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize( width, height );
	document.getElementById("content").appendChild( renderer.domElement );

	// カメラを移動できるようにコントローラーを追加する
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.5;
	controls.enablePan = true;
	controls.enableZoom = true;
	controls.minDistance = 50.0;
	controls.maxDistance = 200.0;
	controls.target.set( 0, 0, 0 );
	controls.maxPolarAngle = Math.PI * 1;

	// 光源を追加する
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 0.7, 0.7 );
	scene.add( directionalLight );

	var geometry = new THREE.Geometry();
	var colors = [];
	for ( var i = 0; i < particleCount; i++ ) {
		var spred = 100;
		var vector = new THREE.Vector3(Math.random() * spred - spred/2,
									   Math.random() * spred - spred/2,
									   Math.random() * spred - spred/2);
		var color = new THREE.Color(Math.random() * 0xffffff);
		colors.push(color);
		if (vector.length() < spred / 2) {
			geometry.vertices.push(vector);
		}
	}

	geometry.colors = colors;
	var materials = new THREE.PointsMaterial({
		size:4,
		blending: THREE.AdditiveBlending,
		transparent: true,
		vertexColors: true,
		map: THREE.ImageUtils.loadTexture("img/particle1.png"),
		depthTest: false,
	});

	particles = new THREE.PointCloud( geometry, materials );
	scene.add( particles );

	particles.geometry.vertices.forEach(function(val, index, array) {
		var basePosition = val;

		createjs.Tween.get(val, {loop:true})
		.to({
			x:0,
			y:70,
			z:0
		}, 5000, createjs.Ease.CubicOut)
		.wait(1000)
		.to({
			x:basePosition.x + (200 + -400 * Math.random()),
			y:basePosition.y + -100 * Math.random(),
			z:basePosition.z + (200 + -400 * Math.random()),
		}, 10000, createjs.Ease.ElasticOut)
		.to({
			y:basePosition.y - 200,
		}, 5000)
		.to({
			x:basePosition.x,
			y:basePosition.y,
			z:basePosition.z,
		}, 2000)
		.wait(3000);
	});

	var boxGeo = new THREE.BoxGeometry(5, 5, 5);
	var boxMat = new THREE.MeshLambertMaterial({color:0xff00ff});
	var boxObj = new THREE.Mesh( boxGeo, boxMat );
	scene.add(boxObj);
	createjs.Tween.get(boxObj.position, {loop:true})
	.to({
		x:50,
	}, 2000, createjs.Ease.elasticInOut)
	.wait(200)
	.to({
		x:-50,
	}, 2000, createjs.Ease.elasticInOut)
	.wait(200)
	.to({
		x:0,
	}, 2000, createjs.Ease.elasticInOut)
	.wait(500);
	createjs.Tween.get(boxObj.rotation, {loop:true})
	.to({
		x:5,
		y:5,
		z:5,
	}, 5000, createjs.Ease.linearNone);
	
	// 描画ループ
	( function renderLoop () {
		requestAnimationFrame( renderLoop );
		
		//particles.rotation.y += 0.01;
		particles.geometry.vertices.forEach(function(val, index, array) {
			//val.y -= 0.1 * Math.random();
			//val.x += -0.1 + Math.random() * 0.2;
			//val.z += -0.1 + Math.random() * 0.2;
		});
		if (isPausing == false) {
			particles.rotation.y += 0.01;
		}
		particles.geometry.verticesNeedUpdate = true;

		// 描画
		renderer.render( scene, camera );
	} )();
}

window.addEventListener('DOMContentLoaded', main, false);

isPausing = false;
window.onmousedown = function() {
	isPausing = true;
	createjs.Ticker.paused = true;
}

window.onmouseup = function() {
	isPausing = false;
	createjs.Ticker.paused = false;
}