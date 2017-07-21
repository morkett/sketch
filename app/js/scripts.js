  const canvas = document.querySelector('#draw');
  const canvasBg = document.querySelector('#canvasBg');

  const ctx = canvas.getContext('2d');
  const ctxBg = canvasBg.getContext('2d');

  const colorPicker = document.querySelector('.colorSelector');
  const brushSize = document.querySelector('.brushSize');
  const brushSizePreview = document.querySelector('.brushSizePreview');
  const brushOpacity = document.querySelector('.brushOpacity');
  const brushTool = document.querySelector('.brush');
  const brushPanel = document.querySelector('.brushPanel');
  const navPanel = document.querySelector('.imgNav');
  const panelCross = document.querySelector('#panelCross');
  const navCross = document.querySelector('#imgNavCross');
  const sprayCross = document.querySelector('#sprayPanelCross');
  const bgTool = document.querySelector('.bg');
  const navTool = document.querySelector('.nav');
  const clearTool = document.querySelector('.clear');
  const saveTool = document.querySelector('.save');
  const sprayTool = document.querySelector('.spray');
  const sprayDensity = document.querySelector('.sprayDensity');
  const sprayRadius = document.querySelector('.sprayRadius');
  const sprayPanel = document.querySelector('.sprayPanel');
  const dlToolLink = document.querySelector('#download');
  const error = '/images/error.png';
  function loadCanvas(){
    const dataURL = localStorage.getItem('canvas');
    const img = new Image;
    img.src = dataURL;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    document.getElementById('canvasImg').src = dataURL || error;
  }
  function loadCanvasBg(){
    const dataURL = localStorage.getItem('canvasBg');
    const img = new Image;
    img.src = dataURL;
    img.onload = function () {
      ctxBg.drawImage(img, 0, 0);
    };
    document.getElementById('canvasBgImg').src = dataURL || error;
  }

  loadCanvasBg();

  loadCanvas();

  //canvas size
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  canvas.width = 800;
  canvas.height = 450;

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
  let density = sprayDensity.value;
  let radius = sprayRadius.value;
  function draw(e) {

    if(!isDrawing) {
      changeBrushSize();
      changeBrushOpacity();
      return;
    }
    //blur
    // ctx.shadowColor = colorPicker.value;
    // ctx.shadowBlur = 5;

    //spray draw
    if (canSpray) {
      for (let i = density; i--; ) {

        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = colorPicker.value;
        const offsetX = getRandomInt(-radius, radius);
        const offsetY = getRandomInt(-radius, radius);
        ctx.fillRect(lastX + offsetX, lastY + offsetY, 1, 1);
      }
    }

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
    const dataURLbg = canvasBg.toDataURL('image/png');

     // set canvasImg image src to dataURL
     // so it can be saved as an image
    document.getElementById('canvasImg').src = dataURL;
    document.getElementById('canvasBgImg').src = dataURLbg;



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
      canSpray = false;
      activeTool(sprayTool, canSpray);
      sprayPanel.classList.add('hide');
      brushPanel.classList.remove('hide');
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
      canSpray = false;
      activeTool(sprayTool, canSpray);
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
      canSpray = false;
      activeTool(sprayTool, canSpray);
      sprayPanel.classList.add('hide');
      brushPanel.classList.remove('hide');
    } else {
      brushPanel.classList.add('hide');
    }
  }

  navCross.addEventListener('click', showNav);
  navTool.addEventListener('click', showNav);
  let showNavPanel = true;

  function showNav() {
    showNavPanel = !showNavPanel;
    activeTool(navTool, showNavPanel);
    if(!showNavPanel) {
      navPanel.classList.add('hide');
    } else {
      navPanel.classList.remove('hide');
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
      ctxBg.rect(0,0,canvas.width,canvas.height);
      ctxBg.fillStyle = colorPicker.value;
      ctxBg.fill();

      const dataURLbg = canvasBg.toDataURL('image/png');
      document.getElementById('canvasBgImg').src = dataURLbg;
      // ctx.globalCompositeOperation='source-over';
      setTimeout(function () {
        bgTool.classList.remove('active');
      }, 250);
    }
  }

// SPRAY TOOL
  sprayTool.addEventListener('click', sprayOn);
  sprayCross.addEventListener('click', sprayOn);


  let canSpray = false;

  function sprayOn() {
    canSpray = !canSpray;
    activeTool(sprayTool, canSpray);
    if(canSpray) {
      showBrushPanel = false;
      brushPanel.classList.add('hide');
      activeTool(brushTool, showBrushPanel);

      sprayPanel.classList.remove('hide');
    } else {
      sprayPanel.classList.add('hide');
    }
  }

  sprayRadius.addEventListener('mousemove', changeSpray);
  sprayRadius.addEventListener('click', changeSpray);

  sprayDensity.addEventListener('mousemove', changeSpray);
  sprayDensity.addEventListener('click', changeSpray);

  function changeSpray() {
    radius = sprayRadius.value;
    density = sprayDensity.value;
  }

// CLEAR TOOL

  let isClearTool = false;
  clearTool.addEventListener('click', clearCanvas);
  function clearCanvas() {
    isClearTool = !isClearTool;
    if(isClearTool) {
      clearTool.classList.add('active');
      setTimeout(function () {
        clearTool.classList.remove('active');
      }, 250);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxBg.clearRect(0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    const dataURLbg = canvasBg.toDataURL('image/png');

    document.getElementById('canvasImg').src = dataURL;
    document.getElementById('canvasBgImg').src = dataURLbg;
  }

// SAVE TOOL

  let isSaveTool = false;
  saveTool.addEventListener('click', saveCanvas);

  function saveCanvas() {
    localStorage.setItem('canvas', canvas.toDataURL());
    localStorage.setItem('canvasBg', canvasBg.toDataURL());
    isSaveTool = !isSaveTool;
    if(isSaveTool) {
      saveTool.classList.add('active');
      setTimeout(function () {
        saveTool.classList.remove('active');
      }, 250);
    }
  }

  //DOWNLOAD TOOL
  let isDlTool = false;
  function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  const dlTool = document.querySelector('.dl');
  dlToolLink.addEventListener('click', function() {
    isDlTool = !isDlTool;
    if(isDlTool) {
      dlTool.classList.add('active');
      setTimeout(function () {
        dlTool.classList.remove('active');
      }, 250);
    }
    downloadCanvas(this, 'draw', 'test.png');
  }, false);

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


//random for spray
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
