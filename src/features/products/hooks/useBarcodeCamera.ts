'use client'

import { useCallback, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'

type UseBarcodeCameraResult = {
  cameraError: string | null
  isStartingCamera: boolean
  startCamera: (
    videoElement: HTMLVideoElement,
    onDetected: (barcode: string) => void,
  ) => Promise<void>
  stopCamera: () => void
}

function getCameraErrorMessage(error: Error): string {
  if (error.name === 'NotAllowedError') {
    return 'Camera access was blocked. Allow camera access in your browser and try again.'
  }

  if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
    return 'No available camera was found on this device.'
  }

  if (error.name === 'NotReadableError') {
    return 'The camera is already in use by another application.'
  }

  return 'The camera could not be started. Check your browser permissions and try again.'
}

export function useBarcodeCamera(): UseBarcodeCameraResult {
  const scannerControls = useRef<IScannerControls | null>(null)
  const scanSession = useRef(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isStartingCamera, setIsStartingCamera] = useState(false)

  const stopCamera = useCallback(() => {
    scanSession.current += 1
    scannerControls.current?.stop()
    scannerControls.current = null
    setIsStartingCamera(false)
  }, [])

  const startCamera = useCallback(
    async (
      videoElement: HTMLVideoElement,
      onDetected: (barcode: string) => void,
    ): Promise<void> => {
      stopCamera()
      const activeSession = scanSession.current
      setCameraError(null)
      setIsStartingCamera(true)

      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const codeReader = new BrowserMultiFormatReader()
        const controls = await codeReader.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: { ideal: 'environment' } },
          },
          videoElement,
          (result, _error, activeControls) => {
            if (!result || activeSession !== scanSession.current) return

            const barcode = result.getText().trim()
            if (!barcode) return

            activeControls.stop()
            onDetected(barcode)
          },
        )

        if (activeSession !== scanSession.current) {
          controls.stop()
          return
        }

        scannerControls.current = controls
      } catch (caughtError) {
        if (activeSession !== scanSession.current) return

        const error =
          caughtError instanceof Error
            ? caughtError
            : new Error('The camera could not be started.')
        setCameraError(getCameraErrorMessage(error))
      } finally {
        if (activeSession === scanSession.current) {
          setIsStartingCamera(false)
        }
      }
    },
    [stopCamera],
  )

  return {
    cameraError,
    isStartingCamera,
    startCamera,
    stopCamera,
  }
}
