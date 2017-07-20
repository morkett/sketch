// TODO: choose to hide buttons with key press
// TODO: save image
// TODO: background-colour
// TODO: styles
// TODO: show preview on brush
// TODO: email image

  const canvas = document.querySelector('#draw');

  const ctx = canvas.getContext('2d');

  const colorPicker = document.querySelector('.colorSelector');
  const brushSize = document.querySelector('.brushSize');
  const brushSizePreview = document.querySelector('.brushSizePreview');
  const brushOpacity = document.querySelector('.brushOpacity');
  const brushTool = document.querySelector('.brush');
  const brushPanel = document.querySelector('.brushPanel');
  const panelCross = document.querySelector('#panelCross');
  const bgTool = document.querySelector('.bg');

  //canvas size
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  ctx.strokeStyle = '#BADA55';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize.value;
  // ctx.globalCompositeOperation = 'multiply';

  let isBgTool = false;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  let hue = 0;
  let changeHue = false;

  function draw(e) {
    if(!isDrawing) {
      changeBrushSize();
      changeBrushOpacity();

      return;
    }


    // ctx.lineWidth = 10;
    ctx.lineWidth = brushSize.value;
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


    changeBrushSize();
    changeBrushOpacity();
    if(changeHue === true) {
      ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${brushOpacity.value})`;
      hue++;
      if(hue >= 360) {
        hue = 0;
      }
    } else {
      const hex = colorPicker.value.replace('#', '');
      // transformToRGBA
      // const rgba = hexToRgb(hex);
      const hsl = rgbToHsl(hex);
      ctx.strokeStyle = `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%,${brushOpacity.value})`;
    }
    // save canvas image as data url (png format by default)
    const dataURL = canvas.toDataURL('image/png');

     // set canvasImg image src to dataURL
     // so it can be saved as an image
    document.getElementById('canvasImg').src = dataURL;
  }

  canvas.addEventListener('mousedown', (e) =>  {
    isDrawing = true;
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
    } else {
      changeHue = false;
    }
  }

  //brushTool
  let showBrushPanel = false;

  brushTool.addEventListener('click', showBrush);
  panelCross.addEventListener('click', showBrush);


  function showBrush() {
    showBrushPanel = !showBrushPanel;
    activeTool(brushTool, showBrushPanel);
    activeTool(panelCross, showBrushPanel);
    if(showBrushPanel) {
      brushPanel.classList.remove('hide');
    } else {
      brushPanel.classList.add('hide');
    }
  }

  colorPicker.addEventListener('click', selectColor);
  colorPicker.addEventListener('mousemove', selectColor);

  function selectColor() {
    canRain = false;
    activeTool(rainbow, canRain);
    changeHue = false;
  }

  brushSize.addEventListener('mousemove', changeBrushSize);
  brushSize.addEventListener('click', changeBrushSize);

  function changeBrushSize() {
    brushSizePreview.style.width = brushSize.value + 'px';
    brushSizePreview.style.height = brushSize.value + 'px';
    // brushSizePreview.style.borderRadius = brushSize.value + 'px';
    const hex = colorPicker.value.replace('#', '');
    const hsl = rgbToHsl(hex);
    ctx.strokeStyle = `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%,${brushOpacity.value})`;

    brushSizePreview.style.background = ctx.strokeStyle;
  }

  brushOpacity.addEventListener('mousemove', changeBrushOpacity);
  brushOpacity.addEventListener('click', changeBrushOpacity);

  function changeBrushOpacity() {
    const hex = colorPicker.value.replace('#', '');
    const hsl = rgbToHsl(hex);
    ctx.strokeStyle = `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%,${brushOpacity.value})`;
    changeBrushSize();
  }

//BG TOOL
  bgTool.addEventListener('click', bgToolOn);
  function bgToolOn() {
    isBgTool = !isBgTool;
    if(isBgTool) {
      bgTool.classList.add('active');
      canvas.style.background = colorPicker.value;
      setTimeout(function () {
        bgTool.classList.remove('active');
      }, 250);
    }
  }


//CONVERT COLOURS

  function rgbToHsl(hex){

    const bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max === min){
      h = s = 0; // achromatic
    }else{
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
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
