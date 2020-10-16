
// Ширина и высота экрана
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// Инициализация канваса
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");

// Растягиваем на весь экран
canvas.width = vw;
canvas.height = vh;

// Установить пикселб в т. (x, y) с прозрачностью c
let plot = function (x, y, c) { 
    if (isFinite(x) && isFinite(y)) {
        let color = {
            r: plot.color.r,
            g: plot.color.g,
            b: plot.color.b,
            a: plot.color.a * c
        };
        setPixel(x, y, color);
    }
};

// Функция установки пикселя в js
function setPixel(x, y, c) {
    c = c || 1;
    let p = ctx.createImageData(1, 1);
    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;
    let data = ctx.getImageData(x, y, 1, 1).data;
    if (data[3] <= p.data[3])
        ctx.putImageData(p, x, y);
}

// Рисует шестиугольник
function hexagon(x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    let angle = 0;
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        angle += Math.PI / 3;
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

// Заливка области
function fill(x, y, color) {
    let startColor = ctx.getImageData(x, y, 1, 1).data;
    plot.color = color;
    let q = [ { x: x, y: y } ];
    for (let i = 0; i != q.length; i++) {
        let x = q[i].x, y = q[i].y;
        let data = ctx.getImageData(x, y, 1, 1).data;
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height && data[0] == startColor[0] && data[1] == startColor[1] && data[2] == startColor[2] && data[3] == startColor[3]) {
            plot(x, y, 1);
            let s = q.length;
            q[s] = { x: x + 1, y: y };
            q[s + 1] = { x: x - 1, y: y };
            q[s + 2] = { x: x, y: y + 1 };
            q[s + 3] = { x: x, y: y - 1 };
        }
    }
}

// Радиусы шестиугольников
let R = 50;
let r = Math.sqrt(3) * R / 2;

// Считаем количество шестиугольников, которое поместилось
let cntX = Math.floor(canvas.width / (2 * R));
let offsetX = (canvas.width - cntX * 2 * R) / 2;
let cntY = Math.floor(canvas.height / (2 * r));
let offsetY = (canvas.height - cntY * 2 * r) / 2;

for (let i = 0; i < cntY; i++) {
    for (let j = 0; j < cntX; j++) {
        let x = R + offsetX + (2 * R) * j;
        let y = r + offsetY + (2 * r) * i;

        hexagon(x, y, R);
        fill(x, y, { r: 123, g: 104, b: 238, a: 255 });

        if (j > 0) {
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(-R / 2, -r);
            ctx.lineTo(-R * 3 / 2, -r);
            ctx.moveTo(-R / 2, r);
            ctx.lineTo(-R * 3 / 2, r);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            fill(x - R, y - r / 2, { r: 65, g: 105, b: 225, a: 255 });
            fill(x - R, y + r / 2, { r: 65, g: 105, b: 225, a: 255 });
        }
    }
}

// fill(R + offsetX, r + offsetY, { r: 200, g: 100, b: 200, a: 255 });