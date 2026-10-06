const result = document.getElementById("result");
const iroh = document.getElementById("iroh")
const iroh_text = document.getElementById("iroh_text")
const question1 = document.getElementById("question1")
const atla_ost = document.getElementById("atla_ost")
const tunnel_ost = document.getElementById("tunnel_ost")
const azula = document.getElementById("azula")
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cave = document.getElementById("cave")
const appa = document.getElementById("appa");
const countdown = document.getElementById("countdown")
const dude = document.getElementById("dude")

const groups = { "Water": "Tribe", "Earth": "Kingdom", "Fire": "Nation", "Air": "Nomads" }


//////////////////////////////////
/// event by ChatGPT ///
let points = [];
let finished = false;

const player = {
    x: 0,
    y: 0,
    radius: 16,
    dragging: false
};
const playerImage = new Image();
playerImage.src = "images/lightning.png";

function createPath() {
    points = [
        { x: canvas.width * 0.10, y: canvas.height * 0.35 },
        { x: canvas.width * 0.30, y: canvas.height * 0.45 },
        { x: canvas.width * 0.50, y: canvas.height * 0.66 },
        { x: canvas.width * 0.65, y: canvas.height * 0.50 },
        { x: canvas.width * 0.90, y: canvas.height * 0.35 }
    ];
    player.x = points[0].x;
    player.y = points[0].y;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPath();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
    drawPlayer();
}

function drawPath() {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}

function drawPlayer() {
    ctx.drawImage(
        playerImage,
        player.x - player.radius,
        player.y - player.radius,
        player.radius * 2,
        player.radius * 2
    );
}

function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function getClosestPoint(pointer) {
    let closest = null;
    let closestDistance = Infinity;
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = dx * dx + dy * dy;
        let t =
            ((pointer.x - start.x) * dx +
                (pointer.y - start.y) * dy) / length;
        t = Math.max(0, Math.min(1, t));
        const x = start.x + t * dx;
        const y = start.y + t * dy;
        const distance = Math.hypot(
            pointer.x - x,
            pointer.y - y
        );
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = {
                x,
                y,
                segment: i,
                progress: t
            };
        }
    }
    return closest;
}

canvas.addEventListener("pointerdown", event => {
    if (finished) return;
    const pointer = getPointerPosition(event);
    const distance = Math.hypot(
        pointer.x - player.x,
        pointer.y - player.y
    );
    if (distance <= player.radius + 15) {
        player.dragging = true;
        canvas.setPointerCapture(event.pointerId);
    }
});

canvas.addEventListener("pointermove", event => {
    if (!player.dragging || finished) return;
    const pointer = getPointerPosition(event);
    const closest = getClosestPoint(pointer);
    if (Math.hypot(
        pointer.x - closest.x,
        pointer.y - closest.y
    ) > 40) {
        return;
    }
    player.x = closest.x;
    player.y = closest.y;
    const lastPoint = points[points.length - 1];
    if (Math.hypot(
        player.x - lastPoint.x,
        player.y - lastPoint.y
    ) < 5) {
        finish();
    }
    draw();
});

canvas.addEventListener("pointerup", () => {
    player.dragging = false;
});
canvas.addEventListener("pointercancel", () => {
    player.dragging = false;
});

function finish() {
    finished = true;
    player.dragging = false;
    document.body.classList.add("finished");
    canvas.style.display = "none";
    azula.style.display = "none";
}

playerImage.onload = resize;
if (playerImage.complete && playerImage.naturalWidth !== 0) {
    resize();
}
window.addEventListener("resize", resize);
/// end event by ChatGPT ///
//////////////////////////////////////


document.querySelectorAll(".clickable").forEach(item => {
    item.addEventListener("click", function () {
        if (this.dataset.correct === "Kung Fu Panda 4") {
            result.textContent = "Nope, it has been too long for that one.";
            result.style.color = "red";
        }
        else if (this.dataset.correct === "Spider-Man: Brand New Day") {
            result.textContent = "Yes, and what about the last one that we have seen at home?"
            result.style.color = "orange"
        }
        else if (this.dataset.correct === "Avatar Aang: Der Herr der Elemente") {
            result.textContent = "Exactly that one. And turn your volume on."
            result.style.color = "green"
            atla_ost.play();
            setTimeout(() => {
                iroh.style.display = "block"
                iroh_text.style.display = "block"
                question1.style.display = "none"
                document.body.style.backgroundImage = `url('images/map.jpg')`;
            }, 2100)
            setTimeout(() => {
                azula.style.display = "block"
                canvas.style.display = "block"
            }, 50000)
        }
        else if (this.dataset.correct === "Die Odyssee") {
            result.textContent = "Almost, but no."
            result.style.color = "red"
        }
        else if (this.dataset.correct === "Mein Nachbar Totoro") {
            result.textContent = "Puuhhh nahhh"
            result.style.color = "red"
        }
    })
})

const elementare = [
    {
        el: "water",
        el_text: "water_text",
        el_select1: "water_select1",
        el_input: "water_input",
        el_check: "water_check",
        elDone: "waterDone",
        book: "book1",
        answers: {
            water_select1: "Water",
            water_select2: "change"
        }
    },
    {
        el: "earth",
        el_text: "earth_text",
        el_select1: "earth_select1",
        el_input: "earth_input",
        el_check: "earth_check",
        elDone: "earthDone",
        book: "book2",
        answers: {
            earth_select1: "Earth",
            earth_select2: "substance"
        }
    },
    {
        el: "fire",
        el_text: "fire_text",
        el_select1: "fire_select1",
        el_input: "fire_input",
        el_check: "fire_check",
        elDone: "fireDone",
        book: "book3",
        answers: {
            fire_select1: "Fire",
            fire_select2: "power"
        }
    },
    {
        el: "air",
        el_text: "air_text",
        el_select1: "air_select1",
        el_input: "air_input",
        el_check: "air_check",
        elDone: "airDone",
        book: "book4",
        answers: {
            air_select1: "Air",
            air_select2: "freedom"
        }
    },
]

function eleQuest(el) {
    const element = elementare.find(item => item.el === el);
    const el_text = document.getElementById(element.el_text);
    const el_select1 = document.getElementById(element.el_select1);
    const el_input = document.getElementById(element.el_input);
    const el_check = document.getElementById(element.el_check);
    const book = document.getElementById(element.book);
    const answers = element.answers;

    el_text.style.display = "block"
    if (el_select1) {
        el_select1.addEventListener("change", function () {
            el_input.value = this.value + " " + groups[this.value];
        })
    }
    el_check.addEventListener("click", function () {
        let allCorrect = true;
        for (const [questionId, correctValue] of Object.entries(answers)) {
            const selectElement = document.getElementById(questionId);
            if (selectElement.value !== correctValue) {
                allCorrect = false;
                break
            }
        }
        const elDone = element.elDone
        if (allCorrect) {
            book.style.display = "block";
            el_text.style.display = "none";
            window[elDone] = true;
            checkCompletion();
        }
        else {
            el_text.style.display = "none";
        }
    })
}

function checkCompletion() {
    const allDone = elementare.every(q => window[q.elDone]);

    if (allDone) {
        cave.style.display = "block"
        cave.addEventListener("click", function () {
            atla_ost.pause()
            document.body.style.backgroundImage = `url("images/tunnel.png")`;
            elementare.forEach(q => {
                document.getElementById(q.book).style.display = "none"
                document.getElementById(q.el).style.display = "none"
            })
            iroh.style.display = "none";
            iroh_text.style.display = "none";
            cave.style.display = "none";
            tunnel_ost.play();
            setTimeout(() => {
                dude.style.opacity = 1;
                dude.classList.add("big");
            }, 700)
            setTimeout(() => {
                document.body.style.backgroundImage = `url("images/tunnel2.png")`;
                dude.classList.add("small");
            }, 3500)
            setTimeout(() => {
                appa.classList.add("float-down");
            }, 3000)
            setTimeout(() => {
                dude.style.display = "none"
                fireworks();
            }, 10000)
            setTimeout(() => {
                countdown.style.display = "block";
            }, 12000)
        })
    }
}

function fireworks() {
    if (typeof confetti !== 'function') {
        return;
    }
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        const particleCount = 40 * (timeLeft / duration);
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
};

function countdownMeet() {
    var endDate = new Date("October 24, 2026 17:00:00").getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = endDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "I SEE U";
        }
    }, 1000);
};

window.addEventListener('load', countdownMeet);