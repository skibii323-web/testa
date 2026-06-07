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
let currentAlignment = 'center';

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

function updateTextColor() {
    const hslColor = `hsl(${currentHue}, 100%, ${currentBrightness}%)`;
    fontPreview.style.color = hslColor;
    indicator.style.backgroundColor = hslColor;
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

alignButtons.forEach(button => {
    button.addEventListener('click', () => {
        alignButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentAlignment = button.getAttribute('data-align');
        fontPreview.style.textAlign = currentAlignment;
    });
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? fontsData.length - 1 : currentIndex - 1;
    updateSlider(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === fontsData.length - 1) ? 0 : currentIndex + 1;
    updateSlider(currentIndex);
});

// Генерирует точную копию карточки без каких-либо лимитов на символы
applyBtn.addEventListener('click', () => {
    const textToRender = fontPreview.textContent;
    const activeFont = fontsData[currentIndex];
    
    const userSize = parseInt(sizeSlider.value);
    
    // МАКСИМАЛЬНОЕ КАЧЕСТВО: Увеличиваем масштаб рендера до 6 (в 3 раза больше, чем было)
    const scaleFactor = 6; 
    const fontSize = userSize * scaleFactor;
    const fontColor = `hsl(${currentHue}, 100%, ${currentBrightness}%)`;

    document.fonts.ready.then(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Базовая ширина 1200px, умноженная на масштаб (итоговая ширина файла будет 7200px)
        const baseWidth = 1200;
        const canvasWidth = baseWidth;
        
        ctx.font = `${fontSize}px "${activeFont.fontFamily}"`;

        // --- АЛГОРИТМ АВТОПЕРЕНОСА СТРОК ---
        const words = textToRender.split(' ');
        const lines = [];
        let currentLine = '';
        
        // Отступы по бокам тоже масштабируем, чтобы текст не прилипал к краям
        const paddingX = 60 * (scaleFactor / 2); 
        const maxTextWidth = canvasWidth - (paddingX * 2);

        for (let i = 0; i < words.length; i++) {
            let testLine = currentLine + words[i] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxTextWidth && i > 0) {
                lines.push(currentLine.trim());
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine.trim());
        // ----------------------------------

        // Вычисляем высоту под новое бешеное разрешение
        const lineHeight = fontSize * 1.3;
        const minHeight = 750 * (scaleFactor / 2); // Базовая минимальная высота с масштабом
        const canvasHeight = Math.max(minHeight, lines.length * lineHeight + (150 * (scaleFactor / 2)));

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Перезапускаем контекст под новое гигантское разрешение холста
        ctx.font = `${fontSize}px "${activeFont.fontFamily}"`;
        ctx.fillStyle = fontColor;
        ctx.textBaseline = 'middle';

        // Выравнивание по горизонтали
        let xPos = paddingX;
        if (currentAlignment === 'center') {
            ctx.textAlign = 'center';
            xPos = canvas.width / 2;
        } else if (currentAlignment === 'right') {
            ctx.textAlign = 'right';
            xPos = canvas.width - paddingX;
        } else {
            ctx.textAlign = 'left';
        }

        // Выравнивание по вертикали (все строки строго по центру)
        const totalTextHeight = lines.length * lineHeight;
        let yPos = (canvas.height - totalTextHeight) / 2 + lineHeight / 2;

        // Рисуем строки
        lines.forEach(line => {
            ctx.fillText(line, xPos, yPos);
            yPos += lineHeight;
        });

        // Скачивание ультра-четкого PNG
        const link = document.createElement('a');
        link.download = `font_preview_ultra_${Date.now()}.png`;
        link.href = canvas.toToDataURL ? canvas.toDataURL('image/png') : canvas.toDataURL(); 
        link.click();
    });
});

updateSlider(currentIndex);
updateTextColor();