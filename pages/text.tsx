import { useEffect } from 'react'
import { NextPage } from 'next'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const Text: NextPage = () => {
  let canvas: HTMLElement

  useEffect(() => {
    if(canvas) return
    canvas = document.getElementById('canvas')!

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;

    // カメラ
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, - 400, 600 );

    // シーン
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    const loader = new FontLoader();
    // let obj: THREE.Object3D; // モデルを格納する変数
    loader.load(
      'helvetiker_regular.typeface.json', // モデルファイルへのパス
      function (font) {
        // テキストのスタイル
        const color = 0x006699;
        const matDark = new THREE.LineBasicMaterial( {color: color,side: THREE.DoubleSide} );
        const matLite = new THREE.MeshBasicMaterial( {color: color,transparent: true,opacity: 0.4,side: THREE.DoubleSide} );
        const message = '   Three.js\nSimple text.';
  
        // 3Dテキストの設定
        const shapes = font.generateShapes( message, 100 );
        const geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );

        // スタイルと3D設定を組み合わせて3Dオブジェクトを作成
        const text = new THREE.Mesh( geometry, matLite );
        text.position.z = - 150;
        scene.add( text );

        const holeShapes = [];

        // 貫通する穴?を再現している?
        for ( let i = 0; i < shapes.length; i ++ ) {
          const shape = shapes[ i ];

          if ( shape.holes && shape.holes.length > 0 ) {
            for ( let j = 0; j < shape.holes.length; j ++ ) {
              const hole = shape.holes[ j ];
              holeShapes.push( hole );
            }
          }
        }
        shapes.push.apply( shapes, holeShapes );

        // 背景のテキストを作成
        const lineText = new THREE.Object3D();
        for ( let i = 0; i < shapes.length; i ++ ) {
          const shape = shapes[ i ];
          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints( points );

          geometry.translate( xMid, 0, 0 );

          const lineMesh = new THREE.Line( geometry, matDark );
          lineText.add( lineMesh );
        }
        scene.add( lineText );

        renderer.render(scene, camera);
      }
    ); // load function end

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ユーザによってカメラを操作できるようにする
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0);

    // アニメーションでカメラの位置を変える
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // リサイズ時の処理
    window.addEventListener('resize', () => {
      innerWidth = window.innerWidth
      innerHeight = window.innerHeight
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
    })
  }, [])

  return <div><canvas id="canvas" /></div>
}

export default Text