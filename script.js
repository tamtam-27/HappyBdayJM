

function changeBG(event) {
    const id = event.target.id;
    document.body.style.backgroundImage = `url('images/${id}.jpg')`;
}
document.querySelectorAll(".book-buttons").forEach(btn => {
    btn.addEventListener("click", changeBG)
});


document.querySelectorAll(".clickable").forEach(item => {
    item.addEventListener("click", function () {
        const result = document.getElementById("result");
        if (this.dataset.correct === "Kung Fu Panda 4") {
            result.textContent = "Nope, it has been too long for that one.";
            result.style.color = "red";
        }
        else if (this.dataset.correct === "Spider-Man: Brand New Day") {
            result.textContent = "Yes! But I was actually looking for the last one that we have seen at home..."
            result.style.color = "orange"
            document.getElementById("iroh_shadow").style.display = "block"
        }
        else if (this.dataset.correct === "Avatar Aang: Der Herr der Elemente") {
            result.textContent = "Exactly that one."
            result.style.color = "green"
            document.getElementById("iroh").style.display = "block"
            setTimeout(() => {
                document.getElementById("iroh_text").style.display = "block"
                document.getElementById("question1").style.display = "none"
                document.body.style.backgroundImage = `url('images/map.jpg')`;
                document.getElementById("atla_ost").play();
            }, 2000)
            setTimeout(() => {
                document.getElementById("azula").style.display = "block"
                document.getElementById("canvas").style.display = "block"
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


//////////
/// quicktime event by ChatGPT ///

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [];
let currentSegment = 0;
let finished = false;

const player = {
    x: 0,
    y: 0,
    radius: 16,
    dragging: false
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPath();
    draw();
}

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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
    drawPoints();
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
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i <= currentSegment; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    if (currentSegment < points.length - 1) {
        ctx.lineTo(player.x, player.y);
    }
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}

function drawPoints() {
    points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    });
}

const playerImage = new Image();
playerImage.src = "images/lightning.png";
function drawPlayer() {
    if (playerImage.complete && playerImage.naturalImage !== 0) {
        ctx.drawImage(
            playerImage,
            player.x - player.radius,
            player.y - player.radius,
            player.radius * 2,
            player.radius * 2
        );
    } else {
        // Fallback: draw the circle while image loads
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#3498db";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function distanceToSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) {
        return Math.hypot(
            point.x - start.x,
            point.y - start.y
        );
    }
    let t =
        ((point.x - start.x) * dx +
            (point.y - start.y) * dy) /
        lengthSquared;

    t = Math.max(0, Math.min(1, t));
    const closestX = start.x + t * dx;
    const closestY = start.y + t * dy;
    return Math.hypot(
        point.x - closestX,
        point.y - closestY
    );
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
    const start = points[currentSegment];
    const end = points[currentSegment + 1];
    if (distanceToSegment(pointer, start, end) > 40) {
        return;
    }
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    let t =
        ((pointer.x - start.x) * dx +
            (pointer.y - start.y) * dy) /
        lengthSquared;
    t = Math.max(0, Math.min(1, t));
    player.x = start.x + t * dx;
    player.y = start.y + t * dy;
    if (t >= 0.99) {
        player.x = end.x;
        player.y = end.y;
        currentSegment++;
        if (currentSegment >= points.length - 1) {
            finish();
        }
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
    document.getElementById("azula").style.display = "none"

}

playerImage.onload = () => {
    resize()
}
if (playerImage.complete && playerImage.naturalWidth !== 0) {
    resize();
}

window.addEventListener("resize", resize);

//////////

let waterDone = false;
let earthDone = false;
let fireDone = false;
let airDone = false;

const book1 = document.getElementById("book1");
const book2 = document.getElementById("book2");
const book3 = document.getElementById("book3");
const book4 = document.getElementById("book4");
function q_water() {
    const water_text = document.getElementById("water_text")
    water_text.style.display = "block"
    const water_answers = {
        water_select1: "water", water_select2: "change", water_select3: "water tribe",
    }
    const water_checker = document.getElementById("water-check")
    water_checker.addEventListener("click", function () {
        let allCorrect = true;
        for (const [questionId, correctValue] of Object.entries(water_answers)) {
            const selectElement = document.getElementById(questionId);
            const userAnswer = selectElement.value;
            if (userAnswer !== correctValue) {
                allCorrect = false;
            }
        }
        if (allCorrect) {
            book1.style.display = "block";
            water_text.style.display = "none";
            waterDone = true;
            checkCompletion();
        }
        else {
            water_text.style.display = "none";
        }
    })
}

function q_earth() {
    const earth_text = document.getElementById("earth_text")
    earth_text.style.display = "block"
    const earth_answers = {
        earth_select1: "earth", earth_select2: "substance", earth_select3: "earth kingdom",
    }
    const earth_checker = document.getElementById("earth-check")
    earth_checker.addEventListener("click", function () {
        let allCorrect = true;
        for (const [questionId, correctValue] of Object.entries(earth_answers)) {
            const selectElement = document.getElementById(questionId);
            const userAnswer = selectElement.value;
            if (userAnswer !== correctValue) {
                allCorrect = false;
            }
        }
        if (allCorrect) {
            book2.style.display = "block"
            earth_text.style.display = "none";
            earthDone = true;
            checkCompletion();
        }
        else {
            earth_text.style.display = "none";
        }
    })
}

function q_fire() {
    const fire_text = document.getElementById("fire_text")
    fire_text.style.display = "block"
    const fire_answers = {
        fire_select1: "fire", fire_select2: "power", fire_select3: "fire nation",
    }
    const fire_checker = document.getElementById("fire-check")
    fire_checker.addEventListener("click", function () {
        let allCorrect = true;
        for (const [questionId, correctValue] of Object.entries(fire_answers)) {
            const selectElement = document.getElementById(questionId);
            const userAnswer = selectElement.value;
            if (userAnswer !== correctValue) {
                allCorrect = false;
            }
        }
        if (allCorrect) {
            book3.style.display = "block"
            fire_text.style.display = "none";
            fireDone = true;
            checkCompletion();
        }
        else {
            fire_text.style.display = "none";
        }
    })
}

function q_air() {
    const air_text = document.getElementById("air_text")
    air_text.style.display = "block"
    const air_answers = {
        air_select1: "air", air_select2: "freedom", air_select3: "air nomads",
    }
    const air_checker = document.getElementById("air-check")
    air_checker.addEventListener("click", function () {
        let allCorrect = true;
        for (const [questionId, correctValue] of Object.entries(air_answers)) {
            const selectElement = document.getElementById(questionId);
            const userAnswer = selectElement.value;
            if (userAnswer !== correctValue) {
                allCorrect = false;
            }
        }
        if (allCorrect) {
            book4.style.display = "block"
            air_text.style.display = "none";
            airDone = true;
            checkCompletion();
        }
        else {
            air_text.style.display = "none";
        }
    })
}

function checkCompletion() {
    if (waterDone && earthDone && fireDone && airDone) {
        const cave = document.getElementById("cave")
        cave.style.display = "block"
        cave.addEventListener("click", function () {
            console.log("secret tunnel")
        })
    }
}

function fireworks() {
    if (typeof confetti !== 'function') {
        return;
    }

    const duration = 4 * 1000;
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
        const particleCount = 50 * (timeLeft / duration);
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
    var endDate = new Date("October 25, 2026 17:00:00").getTime();
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

window.addEventListener('load', fireworks);
window.addEventListener('load', countdownMeet);