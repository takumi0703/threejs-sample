// Three.js サンプル

import { useEffect } from 'react'
import { NextPage } from 'next'
import * as THREE from 'three'
// OBJLoader に対する型定義は、自前で定義するのは難しいため、型チェックを無効化
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Human: NextPage = () => {
  let canvas: HTMLElement

  useEffect(() => {
    if(canvas) return

    canvas = document.getElementById('canvas')!
    const scene = new THREE.Scene()

    // 見えかたを決めるカメラ
    const camera = new THREE.PerspectiveCamera(80, innerWidth / innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 10);

    // レンダラー
    // 基本この設定でいいはず
    // https://threejs.org/docs/#api/en/renderers/WebGLRenderer
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true})
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // objファイルの読み込み
    const loader = new OBJLoader();
    let obj: THREE.Object3D; // モデルを格納する変数
    loader.load(
      'FinalBaseMesh.obj', // モデルファイルへのパス
      // モデルが読み込まれたときの処理
      (loadedObj: THREE.Object3D) => {
        loadedObj.scale.set(0.3, 0.3, 0.3); // 元々のモデルサイズを維持？
        scene.add(loadedObj);
        obj = loadedObj;
      }
    );

    // モデルに動きをつける
    const animate = () => {
      // この関数により、ブラウザの描画タイミングに合わせてアニメーションが行われる
      requestAnimationFrame(animate);

      // モデルをY軸を中心に回転させる
      if (obj) { obj.rotation.y += 0.02;}
    
      // シーンとカメラをレンダリング
      renderer.render(scene, camera);
    }
    animate();

    // 画面全体がこのライトの影響を受ける
    scene.add(new THREE.AmbientLight(0x555555));
    // 他にもSpotLightなどがあり、特定の位置から特定の方向に向かって光を当てることができる

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

  return (
    <div>
      <canvas id="canvas" />
    </div>
  )
}

export default Human