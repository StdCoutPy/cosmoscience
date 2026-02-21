/* ===== ЗВЁЗДНЫЙ ФОН ===== */
const starCanvas=document.createElement("canvas");
starCanvas.id="starsCanvas";
document.body.appendChild(starCanvas);
const starCtx=starCanvas.getContext("2d");

function resizeStars(){
    starCanvas.width=window.innerWidth;
    starCanvas.height=window.innerHeight;
}
resizeStars();
window.addEventListener("resize",resizeStars);
let stars = [];
function createStars() {
    stars = [];
    for(let i=0; i<400; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            z: Math.random() * window.innerWidth, // Глубина
            r: Math.random() * 2
        });
    }
}
createStars();

function drawStars() {
    starCtx.fillStyle = "black";
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    stars.forEach(s => {
        s.z -= 2; // Скорость полета
        if(s.z <= 0) s.z = window.innerWidth;

        // Проекция 3D в 2D
        let x = (s.x - window.innerWidth/2) * (window.innerWidth/s.z) + window.innerWidth/2;
        let y = (s.y - window.innerHeight/2) * (window.innerWidth/s.z) + window.innerHeight/2;
        let radius = s.r * (window.innerWidth/s.z);

        starCtx.beginPath();
        starCtx.arc(x, y, radius, 0, Math.PI*2);
        starCtx.fillStyle = `rgba(255, 255, 255, ${1 - s.z/window.innerWidth})`;
        starCtx.fill();
    });
    requestAnimationFrame(drawStars);
}

drawStars();
/* ===== СОЗВЕЗДИЕ НАВИГАЦИИ ===== */
/* ===== УМНОЕ СОЗВЕЗДИЕ (РАБОТАЕТ ВЕЗДЕ) ===== */
function initConstellation() {
    const navCanvas = document.getElementById("constellationNav");
    if (!navCanvas) return;
    const ctx = navCanvas.getContext("2d");

    // 1. ОПРЕДЕЛЯЕМ ГДЕ МЫ НАХОДИМСЯ
    const inHtmlFolder = window.location.pathname.includes('/html/');
    const prefix = inHtmlFolder ? "" : "html/";
    const homePath = inHtmlFolder ? "../index.html" : "index.html";

    let angle = 0;
    const centerX = 225, centerY = 225;
    const radius = 160;

    // 2. ДАННЫЕ СТРАНИЦ
    const pages = [
        { a: 0, f: prefix + "math.html", n: "1", id: "leg-1" },
        { a: Math.PI/2, f: prefix + "physics.html", n: "2", id: "leg-2" },
        { a: Math.PI, f: prefix + "cs.html", n: "3", id: "leg-3" },
        { a: 3*Math.PI/2, f: prefix + "universe.html", n: "4", id: "leg-4" }
    ];

    const centerHome = { x: centerX, y: centerY, f: homePath, n: "0", id: "leg-0" };

    // 3. ОТСЛЕЖИВАНИЕ МЫШИ
    let mouseX = 0, mouseY = 0;
    navCanvas.onmousemove = (e) => {
        const r = navCanvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
    };

    // 4. ГЛАВНЫЙ ЦИКЛ ОТРИСОВКИ
    function draw() {
        ctx.clearRect(0, 0, 450, 450);

        // Линии созвездия
        ctx.strokeStyle = "rgba(77, 166, 255, 0.2)";
        ctx.lineWidth = 1;
        pages.forEach(p => {
            const x = centerX + radius * Math.cos(p.a + angle);
            const y = centerY + radius * Math.sin(p.a + angle);
            p.currentX = x; p.currentY = y; // СОХРАНЯЕМ ТЕКУЩИЕ КООРДИНАТЫ
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        let currentHoverId = null;

        // Рисуем внешние кнопки (1-4)
        pages.forEach(p => {
            const dist = Math.hypot(mouseX - p.currentX, mouseY - p.currentY);
            const isHover = dist < 25;
            if (isHover) currentHoverId = p.id;

            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, isHover ? 22 : 18, 0, Math.PI*2);
            ctx.fillStyle = isHover ? "#ff4d4d" : "#66ccff";
            ctx.shadowBlur = isHover ? 20 : 10;
            ctx.shadowColor = isHover ? "red" : "#4da6ff";
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.n, p.currentX, p.currentY);
        });

        // Рисуем центр (0)
        const distToCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
        const centerHover = distToCenter < 30;
        if (centerHover) currentHoverId = centerHome.id;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI*2);
        ctx.fillStyle = centerHover ? "#ffcc00" : "rgba(100, 150, 255, 0.3)";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("0", centerX, centerY);

        // Подсветка легенды (проверяем наличие элементов)
        [centerHome, ...pages].forEach(p => {
            const el = document.getElementById(p.id);
            if (el) {
                if (p.id === currentHoverId) el.classList.add('legend-active');
                else el.classList.remove('legend-active');
            }
        });

        angle += 0.002;
        requestAnimationFrame(draw);
    }

    // 5. КЛИК ДЛЯ ПЕРЕХОДА
    navCanvas.onclick = () => {
        // Проверка центра
        if (Math.hypot(mouseX - centerX, mouseY - centerY) < 30) {
            window.location.href = centerHome.f;
        }
        // Проверка орбит
        pages.forEach(p => {
            if (Math.hypot(mouseX - p.currentX, mouseY - p.currentY) < 25) {
                window.location.href = p.f;
            }
        });
    };

    draw();
}



window.addEventListener("DOMContentLoaded",initConstellation);



document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = rect.width / 2;
        const yc = rect.height / 2;

        const dx = x - xc;
        const dy = y - yc;

        card.style.transform = `perspective(1000px) rotateX(${-dy/20}deg) rotateY(${dx/20}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
});




//звук
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSpaceSound(type) {
    if (!audioCtx) audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
        // Короткий высокочастотный "блип"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    if (type === 'click') {
        // Технологичный "клик"
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }
}

// Автоматически вешаем звуки на все кнопки и карточки
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button, .card, .constellation-legend div').forEach(el => {
        el.addEventListener('mouseenter', () => playSpaceSound('hover'));
        el.addEventListener('click', () => playSpaceSound('click'));
    });
});function startAmbient() {
    // Создаем контекст, если его нет
    if (!audioCtx) audioCtx = new AudioCtx();

    // Если контекст приостановлен (защита браузера), возобновляем его
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const createLayer = (freq, vol) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        // LFO для "плавания" звука (сделаем его глубже)
        lfo.type = 'sine';
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = vol * 0.5; // Амплитуда колебания громкости

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.value = vol;
        osc.start();
        lfo.start();
    };

    // Два мягких слоя: низкий гул и "эфир"
    createLayer(55, 0.03);  // Глубокий бас (нота Ля)
    createLayer(110, 0.02); // Октавой выше для объема
}

// ПРОВЕРКА ЗАПУСКА:
// Вешаем на всё окно один обработчик, который сработает один раз
window.addEventListener('mousedown', () => {
    if (!audioCtx || audioCtx.state !== 'running') {
        startAmbient();
        console.log("Космический амбиент запущен");
    }
}, { once: true });

function playSpaceSound(type) {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
        osc.type = 'sine'; // Самый мягкий звук
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2); // Долгое затухание

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }

    if (type === 'click') {
        osc.type = 'triangle'; // Чуть плотнее, чем синус, но мягче квадрата
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}


// Логика заставки
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.addEventListener('click', () => {
            // 1. Плавно скрываем заставку
            intro.style.opacity = '0';
            intro.style.visibility = 'hidden';

            // 2. Активируем звук (теперь браузер разрешит)
            if (typeof startAmbient === "function") {
                startAmbient();
            }

            // 3. Звуковой эффект входа
            if (typeof playSpaceSound === "function") {
                playSpaceSound('click');
            }

            console.log("Система активирована");
        });
    }
});
