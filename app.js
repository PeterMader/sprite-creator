document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('canvas')
  const dropZone = document.getElementById('drop-zone')
  const ctx = canvas.getContext('2d')
  const button = document.getElementById('submit')
  const details = document.getElementById('details')
  const space = document.getElementById('space')

  canvas.height = 0
  canvas.width = 0

  const sprite = {
    items: 0,
    images: []
  }

  const remove = function () {
    while (details.firstChild) {
      details.removeChild(details.firstChild)
    }
  }

  // parse the input value and round it
  const getSpace = () => (Number(space.value) + 0.5) | 0

  const update = function () {
    const {images} = sprite
    let index
    let y = 0

    remove()

    for (index in images) {
      const item = images[index]
      ctx.drawImage(item, 0, y)

      const element = document.createElement('div')
      element.classList.add('details-item')
      element.style.top = y + 'px'
      element.textContent = item.fileName + '; y=' + y
      details.appendChild(element)

      y += item.height + getSpace()
    }
  }

  const setHeight = function () {
    canvas.height = sprite.images.reduce((accumulator, image) => {
      return accumulator + image.height
    }, 0) + getSpace() * (sprite.items - 1)
  }

  const isImageRegex = /image.*/

  const addImage = function (image) {
    const {images} = sprite
    images.push(image)
    image.onload = function () {
      if (image.width > canvas.width) {
        canvas.width = image.width
        details.style.left = (canvas.width + 20) + 'px'
      }
      setHeight()
      update()
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
        sprite.items += 1

        reader.onload = function (imageEvent) {
          var image = new Image()
          image.src= imageEvent.target.result
          image.fileName = file.name
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

  document.getElementById('clear').addEventListener('click', () => {
    sprite.items = 0
    sprite.images = []
    canvas.width = 0
    canvas.height = 0

    remove()
  })

  space.addEventListener('change', function () {
    setHeight()
    update()
  })

  button.addEventListener('click', (e) => {
    button.href = canvas.toDataURL()
  })

})
