const fontsData = [
    {
        name: "21063.otf",
        fontFamily: "CustomFont21063",
        defaultText: "Aa"
    },
    {
        name: "20552.otf",
        fontFamily: "CustomFont20552",
        defaultText: "Aa"
    }
];

let currentIndex = 0;
let currentHue = 0;
let currentBrightness = 100;

const fontPreview = document.getElementById('fontPreview');
const fontName = document.getElementById('fontName');
const textInput = document.getElementById('textInput');
const sizeSlider = document.getElementById('sizeSlider');
const sizeLabel = document.getElementById('sizeLabel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const applyBtn = document.getElementById('applyBtn');
const alignButtons = document.querySelectorAll('.align-btn');

const paletteBtn = document.getElementById('paletteBtn');
const colorPanel = document.getElementById('colorPanel');
const colorSlider = document.getElementById('colorSlider');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightLabel = document.getElementById('brightLabel');
const indicator = document.getElementById('indicator');

function updateSlider(index) {
    const currentFont = fontsData[index];
    fontName.textContent = currentFont.name;
    fontPreview.style.fontFamily = currentFont.fontFamily;
    
    if (textInput.value.trim() === "") {
        fontPreview.textContent = currentFont.defaultText;
    } else {
        fontPreview.textContent = textInput.value;
    }
}

// Улучшенная функция: обновляет цвет + перекрашивает подложку ползунка яркости
function updateTextColor() {
    const hslColor = `hsl(${currentHue}, 100%, ${currentBrightness}%)`;
    fontPreview.style.color = hslColor;
    indicator.style.backgroundColor = hslColor;

    // ДИНАМИЧЕСКИЙ ГРАДИЕНТ: от черного к максимально яркому выбранному оттенку
    brightnessSlider.style.background = `linear-gradient(to right, #000000, hsl(${currentHue}, 100%, 50%), #ffffff)`;
}

paletteBtn.addEventListener('click', () => {
    paletteBtn.classList.toggle('active');
    colorPanel.classList.toggle('open');
});

colorSlider.addEventListener('input', (e) => {
    currentHue = e.target.value;
    updateTextColor();
});

brightnessSlider.addEventListener('input', (e) => {
    currentBrightness = e.target.value;
    brightLabel.textContent = `${currentBrightness}%`;
    updateTextColor();
});

sizeSlider.addEventListener('input', (e) => {
    const currentSize = e.target.value;
    fontPreview.style.fontSize = `${currentSize}px`;
    sizeLabel.textContent = `${currentSize}px`;
});

textInput.addEventListener('input', () => {
    updateSlider(currentIndex);
});

// Выравнивание
alignButtons.forEach(button => {
    button.addEventListener('click', () => {
        alignButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const alignment = button.getAttribute('data-align');
        fontPreview.style.textAlign = alignment;
    });
});

// Переключатели
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? fontsData.length - 1 : currentIndex - 1;
    updateSlider(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === fontsData.length - 1) ? 0 : currentIndex + 1;
    updateSlider(currentIndex);
});

applyBtn.addEventListener('click', () => {
    const currentText = fontPreview.textContent;
    const currentAlign = fontPreview.style.textAlign || 'center';
    const currentSize = sizeSlider.value;
    const finalColor = `hsl(${currentHue}, 100%, ${currentBrightness}%)`;
    console.log(`Применено! Шрифт: ${fontsData[currentIndex].name}, Размер: ${currentSize}px, Цвет: ${finalColor}, Текст: "${currentText}", Выравнивание: ${currentAlign}`);
});

updateSlider(currentIndex);
updateTextColor();