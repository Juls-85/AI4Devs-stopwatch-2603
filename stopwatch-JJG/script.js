// --- Variables Globales ---
let swInterval, cdInterval;
let swTime = 0; // en ms
let cdTime = 0; // en ms
let isSwRunning = false;
let isCdRunning = false;
let cdInput = ""; // Almacena los números pulsados

// --- Navegación ---
function navTo(screen) {
    // Detener todo al cambiar de pantalla si se desea, o mantenerlo en segundo plano.
    // Aquí ocultamos todas y mostramos la elegida.
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screen}`).classList.add('active');
}

// --- Lógica Cronómetro (Stopwatch) ---
function toggleStopwatch() {
    const btn = document.getElementById('sw-btn-start');
    if (!isSwRunning) {
        isSwRunning = true;
        btn.innerText = "Pause";
        btn.style.backgroundColor = "#ccc"; // Color neutro para pause
        const startTime = Date.now() - swTime;
        swInterval = setInterval(() => {
            swTime = Date.now() - startTime;
            updateDisplay('sw', swTime);
        }, 10);
    } else {
        isSwRunning = false;
        btn.innerText = "Continue";
        btn.style.backgroundColor = "#00ff00";
        clearInterval(swInterval);
    }
}

function resetStopwatch() {
    clearInterval(swInterval);
    isSwRunning = false;
    swTime = 0;
    document.getElementById('sw-btn-start').innerText = "Start";
    document.getElementById('sw-btn-start').style.backgroundColor = "#00ff00";
    updateDisplay('sw', 0);
}

// --- Lógica Cuenta Atrás (Countdown) ---
function pressNum(num) {
    if (cdInput.length < 6) {
        cdInput += num;
        updateCountdownPreview();
    }
}

function clearNumpad() {
    cdInput = "";
    updateCountdownPreview();
}

function updateCountdownPreview() {
    // Formatea la entrada como HHMMSS
    let fullCode = cdInput.padStart(6, '0');
    let h = fullCode.substring(0, 2);
    let m = fullCode.substring(2, 4);
    let s = fullCode.substring(4, 6);
    document.getElementById('cd-time').innerText = `${h}:${m}:${s}`;
}

function setCountdown() {
    if (cdInput === "") {
        cdTime = 10000; // 10 segundos por defecto
    } else {
        let fullCode = cdInput.padStart(6, '0');
        let h = parseInt(fullCode.substring(0, 2));
        let m = parseInt(fullCode.substring(2, 4));
        let s = parseInt(fullCode.substring(4, 6));
        cdTime = (h * 3600 + m * 60 + s) * 1000;
    }
    
    // Cambiar interfaz de teclado a botones de control
    document.getElementById('cd-setup-controls').style.display = 'none';
    document.getElementById('cd-running-controls').style.display = 'flex';
    updateDisplay('cd', cdTime);
}

function toggleCountdown() {
    const btn = document.getElementById('cd-btn-start');
    if (!isCdRunning) {
        if (cdTime <= 0) return;
        isCdRunning = true;
        btn.innerText = "Pause";
        btn.style.backgroundColor = "#ccc";
        
        let endTime = Date.now() + cdTime;
        cdInterval = setInterval(() => {
            cdTime = endTime - Date.now();
            if (cdTime <= 0) {
                cdTime = 0;
                resetCountdown();
                alert("¡Tiempo finalizado!");
            }
            updateDisplay('cd', cdTime);
        }, 10);
    } else {
        isCdRunning = false;
        btn.innerText = "Continue";
        btn.style.backgroundColor = "#00ff00";
        clearInterval(cdInterval);
    }
}

function resetCountdown() {
    clearInterval(cdInterval);
    isCdRunning = false;
    cdTime = 0;
    cdInput = "";
    document.getElementById('cd-btn-start').innerText = "Start";
    document.getElementById('cd-btn-start').style.backgroundColor = "#00ff00";
    document.getElementById('cd-setup-controls').style.display = 'block';
    document.getElementById('cd-running-controls').style.display = 'none';
    updateCountdownPreview();
}

// --- Helpers de Formateo ---
function updateDisplay(prefix, ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor(ms % 1000);

    document.getElementById(`${prefix}-time`).innerText = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById(`${prefix}-ms`).innerText = String(milliseconds).padStart(3, '0');
}
