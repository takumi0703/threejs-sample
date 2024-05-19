// テキストを立体的に表示する

import { useEffect } from 'react'
import { NextPage } from 'next'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import {Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'

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

    // JSON形式のフォントファイルを読み込む
    const loader = new FontLoader();
    loader.load(
      'helvetiker_regular.typeface.json', // モデルファイルへのパス
      function (font: Font) {
        // テキストのスタイル
        const baseColor = 0x007BFF;
        const message = '   Three.js\nSimple text.';
        // 前に表示されるテキストの枠線
        const matDark = new THREE.LineBasicMaterial( {color: baseColor,side: THREE.DoubleSide} );
        // 後ろ
        const matLite = new THREE.MeshBasicMaterial( {color: baseColor,transparent: true,opacity: 0.4,side: THREE.DoubleSide} );
  
        // 3Dテキストの設定

        // テキストの形状を生成
        const shapes = font.generateShapes( message, 70 );
        // 3D形状に変換
        const geometry = new THREE.ShapeGeometry( shapes );
        // 形状を中心に移動
        geometry.computeBoundingBox();
        if (geometry.boundingBox === null) return // 型エラー回避なので、実装的にはいらん
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );

        // 3Dオブジェクトにスタイルを適用
        const text = new THREE.Mesh( geometry, matLite );
        text.position.z = - 150; // 背後のテキストとの距離
        scene.add( text );

        // 背後のテキストの穴を作成(つまり、eなどの丸部分が透過されるように)
        const holeShapes = [];
        for ( let i = 0; i < shapes.length; i ++ ) {
          const shape = shapes[ i ];

          // 穴がある文字だと shape.holes が1以上になる?らしい
          if ( shape.holes && shape.holes.length > 0 ) {
            for ( let j = 0; j < shape.holes.length; j ++ ) {
              const hole = shape.holes[ j ];
              holeShapes.push( hole );
            }
          }
        }
        shapes.push.apply( shapes, holeShapes );

        // 前(ライン)のテキストを作成
        const lineText = new THREE.Object3D();
        for ( let i = 0; i < shapes.length; i ++ ) {
          const shape = shapes[ i ];
          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints( points );

          geometry.translate( xMid, 0, 0 );

          // ライン(ラインメッシュ)に変換
          const lineMesh = new THREE.Line( geometry, matDark );
          lineText.add( lineMesh );
        }
        scene.add( lineText );

        renderer.render(scene, camera);
      }
    ); // loader.load end

    // レンダラー
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ユーザによってカメラを操作できるようにする
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0);

    // カメラの位置を変える(アニメーションが必要)
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