let sortIntervals = {}; // храним интервал для каждой канвы

function bubbleSort(canvasId){
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    let arr = [];
    for(let i=0;i<50;i++) arr.push(Math.floor(Math.random()*250));

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        arr.forEach((v,i)=>{
            ctx.fillStyle="#bb86fc";
            ctx.fillRect(i*12,canvas.height-v,10,v);
        });
    }

    draw();

    let i = 0, j = 0;

    function step(){
        if(i<arr.length){
            if(j<arr.length-i-1){
                if(arr[j]>arr[j+1]){
                    [arr[j],arr[j+1]]=[arr[j+1],arr[j]];
                }
                j++;
                draw();
                sortIntervals[canvasId] = setTimeout(step,50);
            } else { i++; j=0; step(); }
        } else {
            delete sortIntervals[canvasId]; // закончено
        }
    }

    step();
}

function resetSort(canvasId){
    // прерываем анимацию
    if(sortIntervals[canvasId]) {
        clearTimeout(sortIntervals[canvasId]);
        delete sortIntervals[canvasId];
    }

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

// Угадай планету
function guessPlanet(selected, correct, resultId){
    document.getElementById(resultId).innerHTML=selected===correct?"✅ Верно!":"❌ Неверно";
}


function drawMandelbrot(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const maxIter = 100;

    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            let x0 = (px - width/2) * 4/width;
            let y0 = (py - height/2) * 4/height;
            let x = 0, y = 0;
            let iteration = 0;

            while (x*x + y*y <= 4 && iteration < maxIter) {
                let xtemp = x*x - y*y + x0;
                y = 2*x*y + y0;
                x = xtemp;
                iteration++;
            }

            const color = iteration === maxIter ? 0 : 255 - Math.floor(iteration*255/maxIter);
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(px, py, 1, 1);
        }
    }
}
document.getElementById("startFractal").onclick = function() {
    drawMandelbrot("fractalCanvas");
};
const canvas = document.getElementById("fibCanvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("fibSlider");

function draw(zoomValue) {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Параметры золотой спирали
    const phi = (1 + Math.sqrt(5)) / 2; // 1.618
    const b = Math.log(phi) / (Math.PI / 2); // Коэффициент роста

    // Динамический масштаб на основе ползунка
    // Чем больше zoomValue, тем сильнее "приближение"
    const scale = 5 * Math.exp(zoomValue / 50);

    ctx.strokeStyle = "#bb86fc";
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Рисуем спираль как набор мелких линий для точности
    for (let theta = 0; theta < 20; theta += 0.1) {
        // Формула: r = a * e^(b * theta)
        // Чтобы "приближаться", мы вычитаем смещение из текущего угла
        const currentTheta = theta - (zoomValue / 20);
        const r = scale * Math.pow(phi, (2 * currentTheta) / Math.PI);

        const x = centerX + r * Math.cos(currentTheta);
        const y = centerY + r * Math.sin(currentTheta);

        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

// Инициализация
slider.oninput = () => draw(parseFloat(slider.value));
document.getElementById("resetFib").onclick = () => {
    slider.value = 0;
    draw(0);
};

// Запуск при загрузке
draw(0);



// Маятник с изменяемой длиной и массой
function initPendulum() {
    const pendCanvas = document.getElementById("pendulum");
    if (!pendCanvas) return;
    const ctxP = pendCanvas.getContext("2d");

    let length = parseFloat(document.getElementById("pendLength").value);
    let mass = parseFloat(document.getElementById("pendMass").value);
    let angle = Math.PI / 4;
    let angleVel = 0;
    const gravity = 9.8;

    document.getElementById("pendLength").oninput = function() { length = parseFloat(this.value); }
    document.getElementById("pendMass").oninput = function() { mass = parseFloat(this.value); }

    function drawPendulum() {
        ctxP.clearRect(0, 0, pendCanvas.width, pendCanvas.height);

        const angleAcc = -gravity / length * Math.sin(angle);
        angleVel += angleAcc * 0.05;
        angleVel *= 0.99; // демпфирование
        angle += angleVel;

        const x = pendCanvas.width / 2 + length * Math.sin(angle);
        const y = 50 + length * Math.cos(angle);

        ctxP.beginPath();
        ctxP.moveTo(pendCanvas.width / 2, 50);
        ctxP.lineTo(x, y);
        ctxP.strokeStyle = "#66ccff";
        ctxP.lineWidth = 2;
        ctxP.stroke();

        ctxP.beginPath();
        ctxP.arc(x, y, mass * 3, 0, Math.PI * 2);
        ctxP.fillStyle = "#bb86fc";
        ctxP.fill();

        requestAnimationFrame(drawPendulum);
    }

    drawPendulum();
}

function launch() {
    const canvas = document.getElementById("physCanvas");
    const ctx = canvas.getContext("2d");

    // Параметры из полей ввода
    const angleDeg = parseFloat(document.getElementById("angle").value);
    const speed = parseFloat(document.getElementById("speed").value);

    const angleRad = angleDeg * Math.PI / 180;
    const g = 9.8;
    const scale = 5; // Масштаб: сколько пикселей в 1 метре
    let t = 0;

    function anim() {
        // Очистка холста
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ФИЗИЧЕСКИЕ РАСЧЕТЫ
        // x = v0 * cos(a) * t
        let x = speed * Math.cos(angleRad) * t;

        // y = v0 * sin(a) * t - (g * t^2) / 2
        // В JS координата Y идет сверху вниз, поэтому вычитаем из высоты
        let y_phys = (speed * Math.sin(angleRad) * t) - (0.5 * g * Math.pow(t, 2));

        // Перевод в пиксели
        let drawX = x * scale;
        let drawY = canvas.height - (y_phys * scale);

        // Отрисовка объекта
        ctx.beginPath();
        ctx.arc(drawX, drawY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#66ccff";
        ctx.fill();
        ctx.closePath();

        t += 0.05; // Шаг времени

        // Условие остановки: если упал на землю или вылетел за экран
        if (drawY <= canvas.height && drawX <= canvas.width) {
            requestAnimationFrame(anim);
        } else {
            // "Приземляем" шар ровно на пол в конце
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(drawX, canvas.height - 8, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    anim();
}


function startParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let pts = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2
    }));

    function animate() {
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        pts.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Рисуем линии между близкими точками
            for (let j = i + 1; j < pts.length; j++) {
                let d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
                if (d < 100) {
                    ctx.strokeStyle = `rgba(0, 212, 255, ${1 - d / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.stroke();
                }
            }
            ctx.fillStyle = "#bb86fc";
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}



function initBlackHole() {
    const canvas = document.getElementById('blackHoleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: -100, y: -100 };

    // Создаем "звездную пыль"
    for(let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    function animate() {
        // Эффект шлейфа (motion blur)
        ctx.fillStyle = 'rgba(5, 5, 15, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Вычисляем дистанцию до черной дыры (курсора)
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 150) {
                // Затягивание
                const force = (150 - dist) / 1500;
                p.x += dx * force;
                p.y += dy * force;
                ctx.fillStyle = "#00d4ff"; // Свечение при поглощении
            } else {
                ctx.fillStyle = "#fff";
                p.x += p.speed; // Обычное движение звезд
            }

            // Бесконечный цикл движения
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            if (p.y < 0) p.y = canvas.height;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Рисуем саму Черную Дыру
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#6a00ff";
        ctx.fill();
        ctx.strokeStyle = "#bc13fe";
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(animate);
    }
    animate();
}

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', initBlackHole);



function generateNewPlanet() {
    console.log("Генерация запущена..."); // Проверка в консоли (F12)
    const canvas = document.getElementById('planetGenerator');
    if (!canvas) {
        console.error("Канвас planetGenerator не найден!");
        return;
    }
    const ctx = canvas.getContext('2d');

    // Очистка перед рисованием
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0; // Сбрасываем тени от прошлых генераций

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70 + Math.random() * 50;
    const hue = Math.floor(Math.random() * 360);
// Рисуем локальное звездное поле вокруг планеты
for(let i=0; i<100; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*1.5, 0, Math.PI*2);
    ctx.fill();
}

    // 1. Рисуем кольца (до планеты, чтобы они были "сзади")
    if (Math.random() > 0.5) {
        ctx.strokeStyle = `hsla(${hue}, 40%, 70%, 0.4)`;
        ctx.lineWidth = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 2, radius * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 2. Тело планеты
    const grad = ctx.createRadialGradient(centerX - radius/2, centerY - radius/2, radius/5, centerX, centerY, radius);
    grad.addColorStop(0, `hsl(${hue}, 80%, 80%)`);
    grad.addColorStop(0.4, `hsl(${hue}, 70%, 50%)`);
    grad.addColorStop(1, `hsl(${hue}, 90%, 10%)`);

    ctx.shadowBlur = 30;
    ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Текстура (облака/кратеры)
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-atop'; // Рисовать только ПОВЕРХ планеты
    for(let i=0; i<8; i++) {
        ctx.fillStyle = `hsla(${hue + 30}, 30%, 90%, 0.1)`;
        ctx.beginPath();
        ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*radius, 0, Math.PI*2);
        ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // 4. Текст
    const names = ["Альфа", "Омега", "Зета", "Прайм", "Нова"];
    const types = ["Газовый гигант", "Океан", "Пустыня", "Лед"];

    document.getElementById('p-name').innerText = "Название: " + names[Math.floor(Math.random()*names.length)] + "-" + Math.floor(Math.random()*100);
    document.getElementById('p-type').innerText = "Тип: " + types[Math.floor(Math.random()*types.length)];
    document.getElementById('p-temp').innerText = "Температура: " + (Math.random()*200 - 100).toFixed(0) + "°C";
    document.getElementById('p-dist').innerText = "Дистанция: " + (Math.random()*1000).toFixed(0) + " св. лет";
}

// ПРОВЕРКА: Автозапуск
setTimeout(generateNewPlanet, 500);
