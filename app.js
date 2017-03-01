document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('canvas')
  const dropZone = document.getElementById('drop-zone')
  const ctx = canvas.getContext('2d')
  const button = document.getElementById('submit')

  const sprite = {
    items: 0,
    width: 0,
    height: 0,
    images: []
  }

  const isImageRegex = /image.*/

  const addImage = (image) => {
    const {images} = sprite
    images.push(image)
    image.onload = function () {
      if (image.width > sprite.width) {
        canvas.width = sprite.width = image.width
      }
      canvas.height = sprite.height += image.height
      let index
      let y = 0
      for (index in images) {
        const item = images[index]
        ctx.drawImage(item, 0, y)
        y += item.height
      }
    }
  }

  dropZone.addEventListener('drop', function(e) {
    e.stopPropagation()
    e.preventDefault()
    const files = e.dataTransfer.files

    let index
    for (index in files) {
      const file = files[index]
      if (isImageRegex.test(file.type)) {
        const reader = new FileReader()

        reader.onload = function (imageEvent) {
          var image = new Image()
          image.src= imageEvent.target.result
          addImage(image)
        }

        reader.readAsDataURL(file)
      }
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  dropZone.addEventListener('dragend', (e) => {
    const dt = e.dataTransfer
    if (dt.items) {
      const {items} = dt
      let index
      for (index in items) {
        const item = items[index]
        items.remove(index)
      }
    } else {
      ev.dataTransfer.clearData()
    }
  })

  button.addEventListener('click', (e) => {
    button.href = canvas.toDataURL()
  })

})
