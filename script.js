/* ===================== CANVAS ===================== */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("image-input");
const imageAreaText = document.querySelector(".image-area p");

/* ===================== BUTTONS ===================== */
const btnReset = document.querySelector(".btn-reset");
const btnDownload = document.querySelector(".btn-download");

/* ===================== CONTROLS ===================== */
const controls = document.querySelectorAll(".control input[type='range']");
const presetButtons = document.querySelectorAll(".preset-btns button");

/* ===================== IMAGE ===================== */
let img = new Image();
let imageLoaded = false;

/* ===================== FILTER STATE ===================== */
let filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  "hue-rotate": 0,
  blur: 0,
  grayscale: 0,
  opacity: 100,
  invert: 0
};

/* ===================== APPLY FILTER ===================== */
function applyFilter() {
  if (!imageLoaded) return;
  
  ctx.filter = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturate}%)
    hue-rotate(${filters["hue-rotate"]}deg)
    blur(${filters.blur}px)
    grayscale(${filters.grayscale}%)
    opacity(${filters.opacity}%)
    invert(${filters.invert}%)
  `;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
}

/* ===================== LOAD IMAGE ===================== */
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  
  img.src = URL.createObjectURL(file);
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    
    imageLoaded = true;
    imageAreaText.style.display = "none";
    
    applyFilter();
  };
});

/* ===================== SLIDER CONTROL ===================== */
controls.forEach(slider => {
  slider.addEventListener("input", () => {
    if (!imageLoaded) return;
    
    const filterName = slider.dataset.filter;
    filters[filterName] = slider.value;
    
    applyFilter();
  });
});

/* ===================== RESET ===================== */
btnReset.addEventListener("click", () => {
  if (!imageLoaded) return;
  
  filters = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    "hue-rotate": 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    invert: 0
  };
  
  controls.forEach(slider => {
    slider.value = filters[slider.dataset.filter];
  });
  
  applyFilter();
});

/* ===================== DOWNLOAD ===================== */
btnDownload.addEventListener("click", () => {
  if (!imageLoaded) return;
  
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

/* ===================== PRESETS ===================== */
const PRESETS = {
  original: {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    "hue-rotate": 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    invert: 0
  },
  vintage: {
    brightness: 110,
    contrast: 90,
    saturate: 80,
    "hue-rotate": 15,
    blur: 0,
    grayscale: 10,
    opacity: 100,
    invert: 0
  },
  drama: {
    brightness: 95,
    contrast: 150,
    saturate: 130,
    "hue-rotate": 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    invert: 0
  },
  cool: {
    brightness: 100,
    contrast: 110,
    saturate: 120,
    "hue-rotate": 180,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    invert: 0
  },
  warm: {
    brightness: 105,
    contrast: 110,
    saturate: 140,
    "hue-rotate": 320,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    invert: 0
  },
  bw: {
    brightness: 100,
    contrast: 120,
    saturate: 0,
    "hue-rotate": 0,
    blur: 0,
    grayscale: 100,
    opacity: 100,
    invert: 0
  }
};

/* ===================== PRESET BUTTONS ===================== */
presetButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!imageLoaded) return;
    
    const preset = PRESETS[btn.dataset.preset];
    if (!preset) return;
    
    filters = { ...preset };
    
    controls.forEach(slider => {
      slider.value = filters[slider.dataset.filter];
    });
    
    applyFilter();
    
    // Active animation (portfolio polish)
    presetButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
