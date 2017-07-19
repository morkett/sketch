// TODO: ADD RADIO BUTTONS SET TO TRUE/FALSE to turn multi-hue: on/off
// TODO: add a selection of BUTTONS
// TODO: choose to hide buttons with key press
// TODO: allow user to choose their own colour
// TODO: allow user to change thickness of brush
// TODO:transparency
// TODO: save image
// TODO: Style navigator

// TODO: background-colour

// TODO: show preview on brush
// TODO: email image

  const canvas = document.querySelector('#draw');

  const ctx = canvas.getContext('2d');

  const colorPicker = document.querySelector('.colorSelector');

  //canvas size
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

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
  let changeHue = false;

  function draw(e) {
    if(!isDrawing) return;
    ctx.lineWidth = 10;
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
      ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 1)`;
      hue++;
      console.log(ctx.strokeStyle);
      if(hue >= 360) {
        hue = 0;
      }
    } else {
      ctx.strokeStyle = colorPicker.value;
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
    const dataURL = canvas.toDataURL('image/png');

     // set canvasImg image src to dataURL
     // so it can be saved as an image
    document.getElementById('canvasImg').src = dataURL;
  }

  canvas.addEventListener('mousedown', (e) =>  {
    isDrawing = true;
    console.log(isDrawing);
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);

// TOOLS
  function activeTool(tool, can) {
    if(can) {
      tool.classList.add('active');
    } else {
      tool.classList.remove('active');
    }
  }


  //ERASER
  const eraser = document.querySelector('.eraser');

  eraser.addEventListener('click', erase);
  let canErase = false;

  function erase() {
    canErase = !canErase;
    activeTool(eraser, canErase);
    if (canErase) {
      console.log('erase active');
      ctx.globalCompositeOperation='destination-out';
    } else {
      ctx.globalCompositeOperation='source-over';
    }
  }

  //RainbowTool
  const rainbow = document.querySelector('.rainbow');
  let canRain = false;
  rainbow.addEventListener('click', rain);


  function rain() {
    canRain = !canRain;
    activeTool(rainbow, canRain);
    if (canRain) {
      changeHue = true;
      console.log('rainbox active');
    } else {
      changeHue = false;
    }
  }

  colorPicker.addEventListener('click', selectColor);

  function selectColor() {
    console.log('clicked');
    canRain = false;
    activeTool(rainbow, canRain);
    changeHue = false;
    console.log({changeHue}, {canRain});
  }






// //Preview Move
//   const body = document.querySelector('body');
//   const preview = document.querySelector('.preview');
// // preview.style.right = 100;
//
//   body.addEventListener('mousemove', (e) =>  {
//     preview.style.backgroundColor = `hsla(${hue}, 100%, 50%, 1)`;
//     preview.style.top = e.clientY + 10 + 'px';
//     preview.style.left = e.clientX + 10 + 'px';
//     console.log(body);
//
//   });
