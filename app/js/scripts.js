// TODO: ADD RADIO BUTTONS SET TO TRUE/FALSE to turn multi-hue: on/off
// TODO: add a selection of BUTTONS
// TODO: choose to hide buttons with key press
// TODO: allow user to choose their own colour
// TODO: allow user to change thickness of brush
// TODO: show preview on brush
// TODO:transparency
// TODO: erase brush - https://stackoverflow.com/questions/25907163/html5-canvas-eraser-tool-without-overdraw-white-color
// TODO: save image
// TODO: Show image nav in corner
// TODO: email image
// TODO: background-colour

  const canvas = document.querySelector('#draw');

  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth + window.innerWidth;
  canvas.height = window.innerHeight + window.innerHeight;

  ctx.strokeStyle = '#BADA55';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = '10';
  // ctx.globalCompositeOperation = 'multiply';

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  let hue = 0;
  let direction = true;
  let changeHue = true;

  function draw(e) {
    if(!isDrawing) return //stop the fn from running when they are not pressed down
    console.log(e);
    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 1)`;
    ctx.lineWidth = hue / 10;
    ctx.beginPath();
    // start from

    ctx.moveTo(lastX, lastY);
    // go to
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    // lastX = e.offsetX;
    // lastY = e.offsetY;
    // es6
    [lastX, lastY] = [e.offsetX, e.offsetY];
    if(changeHue === true) {
      hue++;
      if(hue >= 360) {
        hue = 0;
      }
    }
    if(ctx.lineWidth <= 20 || ctx.lineWidth <= 10) {
      direction = !direction;
    }

    if(direction) {
      ctx.lineWidth++;
    } else {
      ctx.lineWidth--;
    }

    // save canvas image as data url (png format by default)
     var dataURL = canvas.toDataURL();

     // set canvasImg image src to dataURL
     // so it can be saved as an image
     document.getElementById('canvasImg').src = dataURL;
  }

  canvas.addEventListener('mousedown', (e) =>  {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });


  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
