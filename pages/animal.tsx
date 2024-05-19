// 自分で作成した3Dモデルを表示するサンプル

import { useEffect } from 'react'
import { NextPage } from 'next'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Human: NextPage = () => {
  let canvas: HTMLElement

  useEffect(() => {
    if(canvas) return

    canvas = document.getElementById('canvas')!
    const scene = new THREE.Scene()

    // 見えかたを決めるカメラ
    const camera = new THREE.PerspectiveCamera(80, innerWidth / innerHeight, 0.1, 1000)
    camera.position.set(0, 2, 7);

    // レンダラー
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true})
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ユーザによってカメラを操作できるようにする
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0);

    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer;
    loader.load(
      'mm_project.glb', // モデルファイルへのパス
      // モデルが読み込まれたときの処理
      (gltf: GLTFLoader) => {
        // アニメーションを動かすための処理
        const animations = gltf.animations;
        if (animations && animations.length) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          for (let i = 0; i < animations.length; i++) {
            let animation = animations[i];
            mixer.clipAction(animation).play();
          }
        }
        scene.add(gltf.scene);
      }
    );

    const clock = new THREE.Clock();
    // requestAnimationFramenによって
    // ブラウザの描画タイミングに合わせてアニメーションが行われる
    // たとえ追加のアニメーションがなくても、この関数は必要っぽい
    const animate = () => {
      // この関数により、
      requestAnimationFrame(animate);
      // アニメーションを動かすために必要
      // 経過時間を取得して更新してる？？
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // シーンとカメラをレンダリング
      renderer.render(scene, camera);
    }
    animate();

    // 素材の色で表示されるように
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

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