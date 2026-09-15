'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  ArrowLeft,
  Camera,
  ImageUp,
  LoaderCircle,
  ScanBarcode,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { decodeBarcodeFromImage } from '../barcode-scanner.utils'
import { useBarcodeCamera } from '../hooks/useBarcodeCamera'

type ScannerMode = 'choose' | 'camera' | 'upload'

type BarcodeScannerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDetected: (barcode: string) => void
}

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onDetected,
}: BarcodeScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mode, setMode] = useState<ScannerMode>('choose')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isScanningImage, setIsScanningImage] = useState(false)
  const {
    cameraError,
    isStartingCamera,
    startCamera,
    stopCamera,
  } = useBarcodeCamera()

  const finishScan = useCallback(
    (barcode: string) => {
      stopCamera()
      onDetected(barcode)
      onOpenChange(false)
    },
    [onDetected, onOpenChange, stopCamera],
  )

  useEffect(() => {
    if (!open || mode !== 'camera' || !videoRef.current) return

    void startCamera(videoRef.current, finishScan)
    return stopCamera
  }, [finishScan, mode, open, startCamera, stopCamera])

  useEffect(() => {
    if (open) return

    stopCamera()
    setMode('choose')
    setUploadError(null)
    setIsScanningImage(false)
  }, [open, stopCamera])

  const selectMode = (nextMode: ScannerMode) => {
    setUploadError(null)
    setMode(nextMode)
  }

  const handleImageSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file such as JPG, PNG, or WebP.')
      return
    }

    setUploadError(null)
    setIsScanningImage(true)

    try {
      const barcode = await decodeBarcodeFromImage(file)

      if (!barcode) {
        setUploadError(
          'No barcode was detected. Try a sharper image with the full barcode visible.',
        )
        return
      }

      finishScan(barcode)
    } catch (caughtError) {
      setUploadError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The selected image could not be scanned.',
      )
    } finally {
      setIsScanningImage(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) stopCamera()
    onOpenChange(nextOpen)
  }

  const title =
    mode === 'camera'
      ? 'Scan with camera'
      : mode === 'upload'
        ? 'Scan an image'
        : 'Add a barcode'

  const description =
    mode === 'camera'
      ? 'Hold the product barcode inside the guide. It will be detected automatically.'
      : mode === 'upload'
        ? 'Choose a clear image that contains one visible barcode.'
        : 'Choose how you want to capture the product barcode.'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 text-[#16292b] shadow-[0_40px_80px_-30px_rgba(12,75,71,0.55)] dark:bg-[#12201f] dark:text-[#eaf3f1] sm:max-w-[520px] [&>button]:right-5 [&>button]:top-5 [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button]:rounded-[10px] [&>button]:border [&>button]:border-[#e3e9e8] [&>button]:opacity-100 dark:[&>button]:border-[#2b4340]">
        <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
        <DialogHeader className="border-b border-[#edf1f0] px-6 py-5 pr-16 text-left dark:border-[#1e322f]">
          <div className="flex items-start gap-3">
            {mode !== 'choose' && (
              <button
                type="button"
                onClick={() => selectMode('choose')}
                aria-label="Back to barcode options"
                className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px] border border-[#e3e9e8] text-[#5f7273] transition-colors hover:border-[#00beaa] hover:text-[#007f78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:text-[#9fb3b0]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
            )}
            <div>
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-[12.5px] leading-5 text-[#687a7b] dark:text-[#9fb3b0]">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {mode === 'choose' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => selectMode('camera')}
                className="group rounded-2xl border border-[#dce3e2] bg-[#fbfcfc] p-5 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[#00beaa] hover:bg-[#f1fbf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#16292b] dark:hover:border-[#12cdbe] dark:hover:bg-[#183532]"
              >
                <span className="grid size-11 place-items-center rounded-[13px] bg-[#e4f7f4] text-[#007f78] dark:bg-[#1b3936] dark:text-[#7fe0da]">
                  <Camera className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-4 block text-[14px] font-semibold">
                  Scan with camera
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-[1.55] text-[#687a7b] dark:text-[#9fb3b0]">
                  Use a webcam or your device&apos;s rear camera for live scanning.
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectMode('upload')}
                className="group rounded-2xl border border-[#dce3e2] bg-[#fbfcfc] p-5 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[#00beaa] hover:bg-[#f1fbf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#16292b] dark:hover:border-[#12cdbe] dark:hover:bg-[#183532]"
              >
                <span className="grid size-11 place-items-center rounded-[13px] bg-[#eef4e8] text-[#56832d] dark:bg-[#273823] dark:text-[#b6dc8c]">
                  <ImageUp className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-4 block text-[14px] font-semibold">
                  Upload an image
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-[1.55] text-[#687a7b] dark:text-[#9fb3b0]">
                  Select an existing photo containing a clear barcode.
                </span>
              </button>
            </div>
          )}

          {mode === 'camera' && (
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#071110]">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="size-full object-cover"
                  aria-label="Live camera preview for barcode scanning"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[12%] top-1/2 h-[42%] -translate-y-1/2 rounded-xl border-2 border-[#7fe0da] shadow-[0_0_0_999px_rgba(3,15,14,0.38)]"
                >
                  <span className="absolute inset-x-4 top-1/2 h-px bg-[#12cdbe] shadow-[0_0_10px_2px_rgba(18,205,190,0.65)]" />
                </div>
                {isStartingCamera && (
                  <div className="absolute inset-0 grid place-items-center bg-[#071110]/80 text-white">
                    <div className="text-center">
                      <LoaderCircle className="mx-auto size-6 animate-spin text-[#7fe0da]" />
                      <p className="mt-2 text-xs">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div role="alert" className="mt-3 flex gap-2.5 rounded-xl border border-[#f1caca] bg-[#fff8f7] p-3 text-[#9f2d2d] dark:border-[#5c2a2a] dark:bg-[#211717] dark:text-[#ffaaa5]">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-[12px] leading-5">{cameraError}</p>
                </div>
              )}
            </div>
          )}

          {mode === 'upload' && (
            <div>
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9cbc8] bg-[#fbfcfc] px-6 py-8 text-center transition-colors hover:border-[#00beaa] hover:bg-[#f1fbf9] has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#12cdbe] dark:border-[#36524e] dark:bg-[#16292b] dark:hover:border-[#12cdbe] dark:hover:bg-[#183532]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelection}
                  disabled={isScanningImage}
                  className="sr-only"
                />
                {isScanningImage ? (
                  <LoaderCircle className="size-7 animate-spin text-[#007f78] dark:text-[#7fe0da]" />
                ) : (
                  <ScanBarcode className="size-8 text-[#007f78] dark:text-[#7fe0da]" aria-hidden="true" />
                )}
                <span className="mt-3 text-[13px] font-semibold">
                  {isScanningImage ? 'Scanning image...' : 'Choose barcode image'}
                </span>
                <span className="mt-1 text-[11.5px] text-[#7c8e8e] dark:text-[#9fb3b0]">
                  Image files only
                </span>
              </label>

              {uploadError && (
                <div role="alert" className="mt-3 flex gap-2.5 rounded-xl border border-[#f1caca] bg-[#fff8f7] p-3 text-[#9f2d2d] dark:border-[#5c2a2a] dark:bg-[#211717] dark:text-[#ffaaa5]">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-[12px] leading-5">{uploadError}</p>
                </div>
              )}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="mt-5 h-10 w-full rounded-xl border-[#dce3e2] bg-white text-[12.5px] text-[#3f5254] shadow-none dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
