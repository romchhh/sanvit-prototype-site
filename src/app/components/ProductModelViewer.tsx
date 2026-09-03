'use client'

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { Box3, Vector3 } from 'three'
import type { BufferGeometry, Group } from 'three'
import styles from './ProductModelViewer.module.css'

const MODEL_TARGET_SIZE = 2.4

function usePreparedGeometry(geometry: BufferGeometry) {
  return useMemo(() => {
    const prepared = geometry.clone()
    prepared.computeVertexNormals()
    prepared.center()
    prepared.computeBoundingBox()

    const box = prepared.boundingBox ?? new Box3()
    const size = new Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = MODEL_TARGET_SIZE / maxDim
    prepared.scale(scale, scale, scale)
    prepared.computeBoundingBox()

    const scaledBox = prepared.boundingBox ?? new Box3()
    const scaledSize = new Vector3()
    scaledBox.getSize(scaledSize)
    const floorY = scaledBox.min.y

    return { prepared, floorY, scaledSize }
  }, [geometry])
}

function StlModel({ modelUrl }: { modelUrl: string }) {
  const groupRef = useRef<Group>(null)
  const geometry = useLoader(STLLoader, modelUrl) as BufferGeometry
  const { prepared, floorY } = usePreparedGeometry(geometry)

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.y = -floorY
    }
  }, [floorY])

  return (
    <group ref={groupRef}>
      <mesh geometry={prepared} castShadow receiveShadow>
        <meshStandardMaterial color="#c49a6c" roughness={0.5} metalness={0.04} />
      </mesh>
    </group>
  )
}

function Scene({ modelUrl }: { modelUrl: string }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.35} />
      <pointLight position={[0, 3, 2]} intensity={0.25} />

      <Suspense fallback={null}>
        <StlModel modelUrl={modelUrl} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0.45, 0]}
        enablePan={false}
        enableZoom
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={0.9}
        rotateSpeed={0.7}
        minDistance={1.8}
        maxDistance={9}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.15}
      />
    </>
  )
}

export default function ProductModelViewer({ modelUrl }: { modelUrl: string }) {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div className={styles.viewer} ref={viewerRef}>
      <div className={styles.frame}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [3.4, 2.2, 4.2], fov: 42, near: 0.1, far: 50 }}
          className={styles.canvas}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#f5f1ea']} />
          <Scene modelUrl={modelUrl} />
        </Canvas>
      </div>

      <p className={styles.hint}>
        <span className={styles.hintDesktop}>Коліщатко — наблизити / віддалити · Тягніть — обертати</span>
        <span className={styles.hintMobile}>Щипок — масштабувати · Тягніть — обертати</span>
      </p>
    </div>
  )
}
