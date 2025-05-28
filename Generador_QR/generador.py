import qrcode
img = qrcode.make('2DAM')
type(img)  # qrcode.image.pil.PilImage
img.save("conseguirpuntos.png")