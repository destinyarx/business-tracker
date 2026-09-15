export async function decodeBarcodeFromImage(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be scanned for a barcode.')
  }

  const [{ BrowserMultiFormatReader }, { NotFoundException }] =
    await Promise.all([
      import('@zxing/browser'),
      import('@zxing/library'),
    ])
  const imageUrl = URL.createObjectURL(file)

  try {
    const result = await new BrowserMultiFormatReader().decodeFromImageUrl(
      imageUrl,
    )
    const barcode = result.getText().trim()

    return barcode || null
  } catch (caughtError) {
    if (caughtError instanceof NotFoundException) return null

    throw caughtError instanceof Error
      ? caughtError
      : new Error('The selected image could not be scanned.')
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}
