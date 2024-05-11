
import { useEffect } from 'react'
import { NextPage } from 'next'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Buffer: NextPage = () => {
  let canvas: HTMLElement

  useEffect(() => {
    if(canvas) return

    canvas = document.getElementById('canvas')!

    const scene = new THREE.Scene()
    const sizes = {width: innerWidth, height: innerHeight}
    const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)

    camera.position.set(0, 0, 20);
    const renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true, alpha: true})
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const loader = new OBJLoader();
    loader.load(
      'FinalBaseMesh.obj', // モデルファイルへのパス
      // モデルが読み込まれたときの処理
      (obj) => {
        obj.scale.set(0.5, 0.5, 0.5); // 元々のモデルサイズを維持？
        // obj.rotation.y = Math.PI / 2;
        scene.add(obj);
      },
      (progress) => {
        // モデルの読み込み進行状況を表示（オプション）
        console.log('Loading model: ' + (progress.loaded / progress.total * 100) + '% loaded');
      },
      (error) => {
        // エラー処理
        console.error('An error happened', error);
      }
    );

    scene.add(new THREE.AmbientLight(0xffffff));

    // アニメーション
    const clock = new THREE.Clock()
    const tick = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()


    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio)
    })
  }, [])

  return (
    <div>
      <canvas id="canvas" />
    </div>
  )
}

export default Buffer