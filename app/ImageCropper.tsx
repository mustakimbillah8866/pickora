'use client'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

async function getCroppedImg(src: string, crop: any): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((res) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => res(img)
    img.src = src
  })
  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
  return new Promise((res) => canvas.toBlob(b => res(b!), 'image/jpeg', 0.9))
}

export default function ImageCropper({ src, aspect, onDone, onCancel }:
  { src: string; aspect: number; onDone: (blob: Blob) => void; onCancel: () => void }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.5)
  const [area, setArea] = useState<any>(null)
  const onComplete = useCallback((_: any, px: any) => setArea(px), [])

  async function done() {
    if (!area) return
    const blob = await getCroppedImg(src, area)
    onDone(blob)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-4 w-full max-w-md">
        <div className="relative w-full h-64 bg-gray-100 rounded">
          <Cropper image={src} crop={crop} zoom={zoom} aspect={aspect} minZoom={0.3}
            restrictPosition={false}
            onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onComplete} />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm">জুম:</span>
          <input type="range" min={0.3} max={3} step={0.05} value={zoom}
            onChange={e => setZoom(Number(e.target.value))} className="flex-1" />
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onCancel} className="flex-1 bg-gray-200 rounded-lg py-2 text-sm">বাতিল</button>
          <button onClick={done} className="flex-1 bg-emerald-600 text-white rounded-lg py-2 text-sm">ক্রপ ও আপলোড</button>
        </div>
      </div>
    </div>
  )
}