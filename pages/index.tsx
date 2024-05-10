import type { NextPage } from 'next'
import { useEffect } from 'react'
import * as THREE from 'three'

const Home: NextPage = () => {
  let canvas: HTMLElement

  useEffect(() => {
    if (canvas) return
    // canvasを取得
    canvas = document.getElementById('canvas')!

    // Three.jsで何かを表示する際は、必ずシーン・カメラ・レンダラーの3つが必要で
    // 今回は、ボックスジオメトリーとライトも使用している
    
    // 1. シーン
    // Three.jsで表示する3D空間
    const scene = new THREE.Scene()

    // サイズ
    const sizes = {width: innerWidth,height: innerHeight}

    // カメラ
    // 3D空間をどの角度から見るかを決める
    // PerspectiveCamera(視野角, アスペクト比(横/縦), near, far)
    // near: カメラからの距離がnearより近い場合は描画されない(よりパフォーマンスを向上したい場合に変更を検討する)
    // far: カメラからの距離がfarより遠い場合は描画されない(よりパフォーマンスを向上したい場合に変更を検討する)
    const camera = new THREE.PerspectiveCamera(50,sizes.width / sizes.height,0.1,1000)

    // レンダラー
    // カメラで見たシーンを描画する
    const renderer = new THREE.WebGLRenderer({canvas: canvas || undefined,antialias: true,alpha: true})
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ボックスジオメトリー
    // 立方体を作成する
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshLambertMaterial({color: '#2497f0'})
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.z = -5
    box.rotation.set(10, 10, 10)
    scene.add(box)

    // ライト
    // 陰影をつける
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.2)
    pointLight.position.set(1, 2, 3)
    scene.add(pointLight)

    // アニメーション
    const clock = new THREE.Clock()
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      box.rotation.x = elapsedTime
      box.rotation.y = elapsedTime
      window.requestAnimationFrame(tick)
      renderer.render(scene, camera)
    }
    tick()

    // ブラウザのリサイズに対応する
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
    <>
      <canvas id="canvas"></canvas>
    </>
  )
}

export default Home
