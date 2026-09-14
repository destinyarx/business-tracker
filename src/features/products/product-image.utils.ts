const IMAGE_LOAD_TIMEOUT_MS = 8000

export function isLoadableImageUrl(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new window.Image()
    let isSettled = false
    let timeoutId = 0

    const finishValidation = (isValid: boolean) => {
      if (isSettled) return

      isSettled = true
      window.clearTimeout(timeoutId)
      image.onload = null
      image.onerror = null
      resolve(isValid)
    }

    timeoutId = window.setTimeout(
      () => finishValidation(false),
      IMAGE_LOAD_TIMEOUT_MS,
    )
    image.onload = () => finishValidation(true)
    image.onerror = () => finishValidation(false)
    image.src = imageUrl
  })
}
