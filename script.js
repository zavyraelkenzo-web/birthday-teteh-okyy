/* =========================================================
   BIRTHDAY TETEH OKY — FINAL SCRIPT
   ========================================================= */

"use strict";

const $ = (id) => document.getElementById(id);

const screens = [
    "loading",
    "opening",
    "greeting",
    "game",
    "star-motion",
    "letter",
    "letter-parts",
    "prank",
    "prayer",
    "final"
];

let currentScreen = "loading";
let letterPart = 0;

let gameScore = 0;
let gameTime = 15;
let gameRunning = false;
let gameTimer = null;
let starTimeout = null;

let audioReady = false;
let sfxContext = null;
let sfxMaster = null;


/* =========================================================
   SCREEN ENGINE
   ========================================================= */

function showScreen(id){

    screens.forEach(screen => {

        const el = $(screen);

        if(!el) return;

        el.classList.toggle("active", screen === id);

    });

    currentScreen = id;

    if(id === "opening"){
        createSparkles(18);
    }

    if(id === "greeting"){
        createSparkles(12);
    }

    if(id === "star-motion"){
        createSparkles(40);
    }

    if(id === "prayer"){
        createSparkles(24);
    }

    if(id === "final"){
        createSparkles(60);
    }
}


/* =========================================================
   BACKSOUND ASLI
   ========================================================= */

const bgm = $("birthday-music");

if(bgm){

    bgm.loop = true;

    /*
       Volume backsound.
       Bisa dinaikkan ke .65 kalau masih terasa kecil.
    */
    bgm.volume = 0.58;

}

function startBackgroundMusic(){

    if(!bgm) return;

    bgm.volume = 0.58;

    const promise = bgm.play();

    if(promise){

        promise
            .then(() => {
                audioReady = true;
            })
            .catch(() => {
                /*
                   Browser bisa menolak autoplay.
                   Akan dicoba lagi pada interaksi berikutnya.
                */
            });

    }

}


/*
   Musik TIDAK dihentikan ketika pindah scene.
   Ini sengaja supaya musik terasa seperti satu perjalanan.
*/
function keepMusicAlive(){

    if(!bgm) return;

    if(bgm.paused){
        bgm.play().catch(() => {});
    }

}


/* =========================================================
   SFX WEB AUDIO
   ========================================================= */

function initSFX(){

    if(sfxContext) return;

    const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;

    if(!AudioCtx) return;

    sfxContext = new AudioCtx();

    sfxMaster = sfxContext.createGain();

    /*
       SFX dibuat lebih besar dari versi sebelumnya.
    */
    sfxMaster.gain.value = 0.62;

    sfxMaster.connect(sfxContext.destination);

}


function unlockAudio(){

    initSFX();

    if(
        sfxContext &&
        sfxContext.state === "suspended"
    ){
        sfxContext.resume().catch(() => {});
    }

    startBackgroundMusic();

}


function tone(
    frequency = 440,
    duration = .12,
    volume = .32,
    type = "sine"
){

    if(!sfxContext || !sfxMaster) return;

    const oscillator =
        sfxContext.createOscillator();

    const gain =
        sfxContext.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        sfxContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        sfxContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(volume, .01),
        sfxContext.currentTime + .015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        sfxContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(sfxMaster);

    oscillator.start();

    oscillator.stop(
        sfxContext.currentTime + duration + .03
    );
}


function sfxClick(){
    tone(720,.09,.38,"sine");
    setTimeout(() => tone(980,.08,.25,"sine"),35);
}


function sfxStar(){

    tone(700,.09,.4,"triangle");

    setTimeout(
        () => tone(1050,.12,.36,"triangle"),
        50
    );

    setTimeout(
        () => tone(1350,.16,.28,"sine"),
        100
    );
}


function sfxSuccess(){

    tone(523,.14,.38,"sine");

    setTimeout(
        () => tone(659,.14,.38,"sine"),
        100
    );

    setTimeout(
        () => tone(784,.2,.42,"sine"),
        200
    );

}


function sfxLetter(){

    tone(420,.12,.28,"sine");

    setTimeout(
        () => tone(620,.18,.34,"triangle"),
        100
    );

}


function sfxPrank(){

    tone(160,.12,.38,"square");

    setTimeout(
        () => tone(110,.2,.35,"square"),
        100
    );

}


function sfxReveal(){

    tone(440,.1,.3,"sine");

    setTimeout(
        () => tone(660,.1,.32,"sine"),
        80
    );

    setTimeout(
        () => tone(880,.14,.4,"sine"),
        160
    );

    setTimeout(
        () => tone(1320,.25,.42,"sine"),
        240
    );

}


/* =========================================================
   BACKGROUND MICRO PARTICLES
   ========================================================= */

function createSparkles(amount = 20){

    const container = $("sparkles");

    if(!container) return;

    for(let i = 0; i < amount; i++){

        const sparkle =
            document.createElement("span");

        sparkle.textContent =
            Math.random() > .5 ? "✦" : "·";

        sparkle.style.position = "absolute";

        sparkle.style.left =
            `${Math.random() * 100}%`;

        sparkle.style.top =
            `${Math.random() * 100}%`;

        sparkle.style.color =
            Math.random() > .5
                ? "rgba(255,220,143,.9)"
                : "rgba(190,213,255,.8)";

        sparkle.style.fontSize =
            `${5 + Math.random() * 13}px`;

        sparkle.style.opacity =
            `${.2 + Math.random() * .8}`;

        sparkle.style.pointerEvents = "none";

        sparkle.style.animation =
            `sparkleFloat ${2.5 + Math.random() * 4}s ease-in-out forwards`;

        sparkle.style.animationDelay =
            `${Math.random() * .8}s`;

        container.appendChild(sparkle);

        setTimeout(
            () => sparkle.remove(),
            6500
        );

    }

}


/* Tambahkan animasi sparkle melalui JS */
const sparkleStyle =
document.createElement("style");

sparkleStyle.textContent = `
@keyframes sparkleFloat{
    0%{
        transform:translate3d(0,12px,0) scale(.3) rotate(0deg);
        opacity:0;
    }

    20%{
        opacity:1;
    }

    50%{
        transform:translate3d(8px,-15px,0) scale(1) rotate(90deg);
    }

    100%{
        transform:translate3d(-8px,-45px,0) scale(.2) rotate(180deg);
        opacity:0;
    }
}

.star-burst{
    position:fixed;
    pointer-events:none;
    z-index:100;
    font-size:20px;
    color:#ffe7a8;
    animation:starBurst .65s ease-out forwards;
}

@keyframes starBurst{
    0%{
        transform:translate(-50%,-50%) scale(.3);
        opacity:1;
    }

    100%{
        transform:
            translate(
                calc(-50% + var(--x)),
                calc(-50% + var(--y))
            )
            scale(1.5)
            rotate(180deg);
        opacity:0;
    }
}
`;

document.head.appendChild(sparkleStyle);


/* =========================================================
   CLICK STAR BURST
   ========================================================= */

function starBurst(x,y,amount = 10){

    for(let i = 0; i < amount; i++){

        const el =
            document.createElement("span");

        el.className = "star-burst";

        el.textContent =
            Math.random() > .5 ? "✦" : "•";

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        el.style.setProperty(
            "--x",
            `${(Math.random() - .5) * 180}px`
        );

        el.style.setProperty(
            "--y",
            `${(Math.random() - .5) * 180}px`
        );

        document.body.appendChild(el);

        setTimeout(
            () => el.remove(),
            700
        );

    }

}


/* =========================================================
   LOADING
   ========================================================= */

function runLoading(){

    let progress = 0;

    const interval =
        setInterval(() => {

            progress +=
                Math.floor(
                    Math.random() * 7
                ) + 2;

            if(progress >= 100){

                progress = 100;

                clearInterval(interval);

                $("loading-progress").style.width =
                    "100%";

                $("loading-percent").textContent =
                    "100%";

                setTimeout(() => {

                    showScreen("opening");

                    createSparkles(25);

                },700);

                return;
            }

            $("loading-progress").style.width =
                `${progress}%`;

            $("loading-percent").textContent =
                `${progress}%`;

        },90);

}


/* =========================================================
   OPENING
   ========================================================= */

$("start-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxClick();

        starBurst(
            window.innerWidth / 2,
            window.innerHeight / 2,
            18
        );

        setTimeout(
            () => showScreen("greeting"),
            650
        );

    }
);


/* =========================================================
   GREETING
   ========================================================= */

$("game-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxClick();

        showScreen("game");

    }
);


/* =========================================================
   GAME
   ========================================================= */

function resetGame(){

    gameScore = 0;
    gameTime = 15;
    gameRunning = false;

    $("score").textContent = "0";
    $("timer").textContent = "15";

    $("game-start").style.display = "grid";

    $("game-result").classList.remove("show");

    $("star-target").classList.remove("show");

    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }

    if(starTimeout){
        clearTimeout(starTimeout);
        starTimeout = null;
    }

}


function randomStarPosition(){

    const arena =
        $("game-arena");

    const star =
        $("star-target");

    if(!arena || !star) return;

    const rect =
        arena.getBoundingClientRect();

    const padding = 45;

    const x =
        padding +
        Math.random() *
        Math.max(10,rect.width - padding * 2);

    const y =
        padding +
        Math.random() *
        Math.max(10,rect.height - padding * 2);

    star.style.left =
        `${x}px`;

    star.style.top =
        `${y}px`;

}


function spawnStar(){

    if(!gameRunning) return;

    randomStarPosition();

    const star = $("star-target");

    star.classList.add("show");

    // Bintang dibuat lebih mudah ditangkap:
    // durasi tampil 3.8 - 5.5 detik
    starTimeout =
        setTimeout(
            () => {

                if(!gameRunning) return;

                star.classList.remove("show");

                setTimeout(
                    spawnStar,
                    350
                );

            },
            3800 + Math.random() * 1700
        );

}


function finishGame(){

    gameRunning = false;

    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }

    if(starTimeout){
        clearTimeout(starTimeout);
        starTimeout = null;
    }

    $("star-target").classList.remove("show");

    $("result-title").textContent =
        gameScore >= 10
            ? "Wihh jago juga! ⭐"
            : "Bintangnya berhasil ditangkap! ✨";

    $("result-text").textContent =
        `Teteh berhasil menangkap ${gameScore} bintang. Semoga sebanyak itu juga hal-hal baik datang ke kehidupan Teteh. 🤍`;

    $("game-result").classList.add("show");

    sfxSuccess();

    createSparkles(35);

}


$("begin-game").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxClick();

        resetGame();

        $("game-start").style.display = "none";

        gameRunning = true;

        gameTime = 15;

        $("timer").textContent =
            gameTime;

        spawnStar();

        gameTimer =
            setInterval(() => {

                gameTime--;

                $("timer").textContent =
                    gameTime;

                if(gameTime <= 0){

                    clearInterval(gameTimer);

                    gameTimer = null;

                    finishGame();

                }

            },1000);

    }
);


$("star-target").addEventListener(
    "click",
    (event) => {

        if(!gameRunning) return;

        event.stopPropagation();

        gameScore++;

        $("score").textContent =
            gameScore;

        sfxStar();

        starBurst(
            event.clientX,
            event.clientY,
            14
        );

        $("star-target").classList.remove("show");

        if(gameScore % 5 === 0){

            createSparkles(12);

        }

        setTimeout(
            spawnStar,
            180
        );

    }
);


/* =========================================================
   AFTER GAME → BINTANG TERBANG
   ========================================================= */

$("game-finish-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxReveal();

        showScreen("star-motion");

        createSparkles(45);

        startMotion400FX();

        setTimeout(
            () => {

                showScreen("letter");

                createSparkles(20);

            },
            4100
        );

    }
);


/* =========================================================
   LETTER
   ========================================================= */

$("envelope-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        if(
            $("envelope-button")
                .classList.contains("opened")
        ){
            return;
        }

        $("envelope-button")
            .classList.add("opened");

        sfxLetter();

        createSparkles(28);

        /* =====================================================
           LETTER CINEMATIC FX
           ===================================================== */

        const envelope =
            $("envelope-button");

        envelope.animate(
            [
                {
                    transform:
                        "translateY(0) scale(1) rotate(0deg)",
                    filter:
                        "brightness(1)"
                },
                {
                    transform:
                        "translateY(-10px) scale(1.04) rotate(-1deg)",
                    filter:
                        "brightness(1.35)"
                },
                {
                    transform:
                        "translateY(4px) scale(.98) rotate(1deg)",
                    filter:
                        "brightness(1.15)"
                },
                {
                    transform:
                        "translateY(0) scale(1) rotate(0deg)",
                    filter:
                        "brightness(1)"
                }
            ],
            {
                duration:900,
                easing:"cubic-bezier(.2,.8,.2,1)"
            }
        );

        /* ledakan sparkle bertahap */

        let letterFxCount = 0;

        const letterFx =
            setInterval(
                () => {

                    createSparkles(
                        8
                    );

                    starBurst(
                        window.innerWidth / 2 +
                        (Math.random() - .5) * 180,

                        window.innerHeight * .45 +
                        (Math.random() - .5) * 100,

                        4
                    );

                    letterFxCount++;

                    if(letterFxCount >= 7){

                        clearInterval(
                            letterFx
                        );

                    }

                },
                160
            );

        setTimeout(
            () => {

                prepareLetter();

                showScreen(
                    "letter-parts"
                );

                /* kartu surat masuk */

                const card =
                    document.querySelector(
                        ".letter-card"
                    );

                if(card){

                    card.animate(
                        [
                            {
                                opacity:0,
                                transform:
                                    "translateY(45px) scale(.92) rotateX(12deg)"
                            },
                            {
                                opacity:1,
                                transform:
                                    "translateY(-8px) scale(1.02) rotateX(0)"
                            },
                            {
                                opacity:1,
                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],
                        {
                            duration:1100,
                            easing:
                                "cubic-bezier(.16,.72,.2,1)",
                            fill:"both"
                        }
                    );

                }

            },
            1500
        );

    }
);


/* =========================================================
   LETTER CONTENT
   ========================================================= */

const letterData = [

    {
        label:"✦ PART 1 ✦",
        title:"Untuk Teteh Oky 🤍",
        text:
        "Selamat ulang tahun, Teteh Oky. Semoga hari ini menjadi salah satu hari yang penuh senyum, cerita baik, dan rasa syukur. Semoga Teteh selalu diberikan kesehatan dan kebahagiaan."
    },

    {
        label:"✦ PART 2 ✦",
        title:"Untuk perjalanan Teteh ✨",
        text:
        "Semoga setiap langkah ke depannya dimudahkan. Rezeki semakin lancar dan berkah, pekerjaan serta urusan sehari-hari diberi kelancaran, dan apa yang sedang diperjuangkan perlahan menemukan hasil terbaik."
    },

    {
        label:"✦ PART 3 ✦",
        title:"Untuk Teteh & keluarga 🤍",
        text:
        "Semoga Teteh dan keluarga selalu diberikan keharmonisan, kesehatan, ketenangan, serta kebahagiaan. Semoga rumah selalu dipenuhi kasih sayang, tawa, dan keberkahan. Aamiin ya Allah."
    }

];


function prepareLetter(){

    letterPart = 0;

    updateLetter();

}


function updateLetter(){

    const data =
        letterData[letterPart];

    $("letter-part-label").textContent =
        data.label;

    $("letter-part-title").textContent =
        data.title;

    $("letter-part-text").textContent =
        data.text;

    document
        .querySelectorAll(".letter-dots i")
        .forEach(
            (dot,index) => {

                dot.classList.toggle(
                    "active",
                    index === letterPart
                );

            }
        );

    $("next-letter").innerHTML =
        letterPart === letterData.length - 1
            ? `Lanjut <span>→</span>`
            : `Part Berikutnya <span>→</span>`;

}


$("next-letter").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxClick();

        if(
            letterPart <
            letterData.length - 1
        ){

            letterPart++;

            const card =
                document.querySelector(
                    ".letter-card"
                );

            card.style.animation =
                "none";

            void card.offsetWidth;

            card.style.animation =
                "fadeUp .6s ease both";

            updateLetter();

            createSparkles(15);

            return;
        }

        showScreen("prank");

        runPrank();

        prankCinematicFX();

    }
);


/* =========================================================
   PRANK
   ========================================================= */

function runPrank(){

    $("prank-loading").style.display =
        "block";

    $("prank-result").classList.remove(
        "show"
    );

    $("fake-progress-bar").style.width =
        "0%";

    $("fake-percent").textContent =
        "0%";

    const statusMessages = [

        "Menghubungkan ke server...",
        "Mencari hadiah...",
        "Memeriksa hadiah...",
        "Hampir ketemu...",
        "99%...",
        "Sebentar lagi..."

    ];

    let progress = 0;

    let messageIndex = 0;

    sfxPrank();

    const interval =
        setInterval(() => {

            progress +=
                Math.floor(
                    Math.random() * 8
                ) + 4;

            if(progress >= 100){

                progress = 100;

                clearInterval(interval);

                $("fake-progress-bar")
                    .style.width = "100%";

                $("fake-percent")
                    .textContent = "100%";

                $("prank-status")
                    .textContent =
                    "Berhasil!";

                setTimeout(
                    () => {

                        $("prank-loading")
                            .style.display =
                            "none";

                        $("prank-result")
                            .classList
                            .add("show");

                        sfxReveal();

                        createSparkles(40);

                    },
                    900
                );

                return;
            }

            $("fake-progress-bar")
                .style.width =
                `${progress}%`;

            $("fake-percent")
                .textContent =
                `${progress}%`;

            if(
                progress >
                (messageIndex + 1) * 16
            ){

                messageIndex =
                    Math.min(
                        messageIndex + 1,
                        statusMessages.length - 1
                    );

                $("prank-status")
                    .textContent =
                    statusMessages[messageIndex];

            }

        },260);

}


/* =========================================================
   FINAL CINEMATIC FX
   ========================================================= */

function cinematicAmbientFX(count = 80, duration = 3500){

    const items = [];

    for(let i = 0; i < count; i++){

        const el =
            document.createElement("span");

        el.textContent =
            i % 3 === 0 ? "✦" :
            i % 3 === 1 ? "·" : "✧";

        Object.assign(
            el.style,
            {
                position:"fixed",
                left:(Math.random()*100)+"%",
                top:(70+Math.random()*35)+"%",
                zIndex:"9996",
                pointerEvents:"none",
                fontSize:(6+Math.random()*13)+"px",
                color:
                    i % 2
                    ? "rgba(255,225,160,.8)"
                    : "rgba(220,235,255,.8)",
                textShadow:
                    "0 0 12px rgba(255,230,160,.8)"
            }
        );

        document.body.appendChild(el);

        items.push(el);

        el.animate(
            [
                {
                    transform:
                        "translateY(0) scale(.3) rotate(0deg)",
                    opacity:0
                },
                {
                    transform:
                        "translateY(-25vh) scale(1) rotate(90deg)",
                    opacity:1,
                    offset:.3
                },
                {
                    transform:
                        "translateY(-70vh) scale(.5) rotate(220deg)",
                    opacity:.8,
                    offset:.75
                },
                {
                    transform:
                        "translateY(-100vh) scale(.1) rotate(360deg)",
                    opacity:0
                }
            ],
            {
                duration:
                    duration +
                    Math.random()*1200,
                easing:
                    "cubic-bezier(.2,.7,.2,1)",
                fill:"forwards"
            }
        );

    }

    setTimeout(
        () => {
            items.forEach(
                el => el.remove()
            );
        },
        duration + 1800
    );

}


/* =========================================================
   PRANK FX
   ========================================================= */

function prankCinematicFX(){

    cinematicAmbientFX(
        70,
        3200
    );

    let pulse = 0;

    const timer =
        setInterval(
            () => {

                createSparkles(12);

                pulse++;

                if(pulse >= 8){
                    clearInterval(timer);
                }

            },
            280
        );

}


/* =========================================================
   PRAYER FX
   ========================================================= */

function prayerCinematicFX(){

    cinematicAmbientFX(
        100,
        5200
    );

    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight * .38;

    /*
       Cahaya doa dari atas
    */

    const light =
        document.createElement("div");

    Object.assign(
        light.style,
        {
            position:"fixed",
            left:centerX+"px",
            top:"-120px",
            width:"8px",
            height:"8px",
            borderRadius:"50%",
            background:
                "rgba(255,238,190,1)",
            boxShadow:
                "0 0 35px 18px rgba(255,225,150,.35)",
            transform:
                "translate(-50%,-50%)",
            zIndex:"9995",
            pointerEvents:"none"
        }
    );

    document.body.appendChild(light);

    light.animate(
        [
            {
                top:"-120px",
                opacity:0,
                transform:
                    "translate(-50%,-50%) scale(.3)"
            },
            {
                top:"25%",
                opacity:1,
                transform:
                    "translate(-50%,-50%) scale(1.8)",
                offset:.35
            },
            {
                top:"42%",
                opacity:.85,
                transform:
                    "translate(-50%,-50%) scale(1)"
            },
            {
                top:"55%",
                opacity:0,
                transform:
                    "translate(-50%,-50%) scale(.4)"
            }
        ],
        {
            duration:4200,
            easing:"ease-out",
            fill:"forwards"
        }
    );

    setTimeout(
        () => light.remove(),
        4500
    );

    let prayerPulse = 0;

    const timer =
        setInterval(
            () => {

                starBurst(
                    centerX +
                    (Math.random()-.5)*160,

                    centerY +
                    (Math.random()-.5)*100,

                    5
                );

                createSparkles(10);

                prayerPulse++;

                if(prayerPulse >= 10){
                    clearInterval(timer);
                }

            },
            380
        );

}


/* =========================================================
   FINAL FX
   ========================================================= */

function finalCinematicFX(){

    cinematicAmbientFX(
        120,
        6000
    );

    setTimeout(
        () => {

            starBurst(
                window.innerWidth/2,
                window.innerHeight*.34,
                35
            );

            createSparkles(45);

        },
        400
    );

    setTimeout(
        () => {

            starBurst(
                window.innerWidth*.25,
                window.innerHeight*.3,
                18
            );

        },
        1100
    );

    setTimeout(
        () => {

            starBurst(
                window.innerWidth*.75,
                window.innerHeight*.3,
                18
            );

        },
        1700
    );

}

/* =========================================================
   PRAYER
   ========================================================= */

$("prayer-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxReveal();

        showScreen("prayer");

        createSparkles(35);

        prayerCinematicFX();

    }
);


/* =========================================================
   FINAL
   ========================================================= */

$("final-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxSuccess();

        showScreen("final");

        createSparkles(70);

        finalCinematicFX();

        starBurst(
            window.innerWidth / 2,
            window.innerHeight * .35,
            30
        );

    }
);


/* =========================================================
   REPLAY
   ========================================================= */

$("replay-button").addEventListener(
    "click",
    () => {

        unlockAudio();

        sfxClick();

        /*
           PENTING:
           Backsound TIDAK dihentikan.
           Musik tetap berjalan dari awal sampai replay.
        */

        resetGame();

        letterPart = 0;

        $("envelope-button")
            .classList.remove("opened");

        $("prank-loading")
            .style.display = "block";

        $("prank-result")
            .classList.remove("show");

        $("fake-progress-bar")
            .style.width = "0%";

        $("fake-percent")
            .textContent = "0%";

        $("loading-progress")
            .style.width = "0%";

        $("loading-percent")
            .textContent = "0%";

        showScreen("opening");

        createSparkles(25);

        keepMusicAlive();

    }
);


/* =========================================================
   GLOBAL INTERACTION
   ========================================================= */

document.addEventListener(
    "pointerdown",
    () => {

        unlockAudio();

    },
    {
        passive:true,
        once:false
    }
);


/* =========================================================
   KEEP MUSIC ALIVE
   ========================================================= */

setInterval(
    () => {

        if(
            currentScreen !== "loading"
        ){
            keepMusicAlive();
        }

    },
    3000
);


/* =========================================================
   INITIALIZE
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        showScreen("loading");

        runLoading();

        createSparkles(10);

    }
);


/* =========================================================
   PREVENT ACCIDENTAL PAGE SCROLL
   ========================================================= */

document.addEventListener(
    "touchmove",
    (event) => {

        if(
            event.target.closest(
                ".message-card,.game-card,.letter-card"
            )
        ){
            return;
        }

        event.preventDefault();

    },
    {
        passive:false
    }
);


/* ============================================================
   400 MOTION MICRO EFFECTS
   400 PARTIKEL — RINGAN KARENA MENGGUNAKAN 1 CANVAS
   ============================================================ */

let motion400Frame = null;
let motion400Canvas = null;
let motion400Ctx = null;

function startMotion400FX(){

    if(motion400Frame){
        cancelAnimationFrame(motion400Frame);
        motion400Frame = null;
    }

    if(motion400Canvas){
        motion400Canvas.remove();
    }

    motion400Canvas =
        document.createElement("canvas");

    motion400Canvas.id =
        "motion-400-fx";

    Object.assign(
        motion400Canvas.style,
        {
            position:"fixed",
            inset:"0",
            width:"100%",
            height:"100%",
            zIndex:"9997",
            pointerEvents:"none"
        }
    );

    document.body.appendChild(
        motion400Canvas
    );

    motion400Ctx =
        motion400Canvas.getContext("2d");

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    const resize = () => {

        motion400Canvas.width =
            window.innerWidth * dpr;

        motion400Canvas.height =
            window.innerHeight * dpr;

        motion400Ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    };

    resize();

    window.addEventListener(
        "resize",
        resize,
        {passive:true}
    );

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const particles = [];

    /*
       TOTAL = 400

       160 tiny stars
        80 glowing dust
        60 sparkles
        50 light streaks
        30 soft petals
        20 shooting particles
    */

    for(let i = 0; i < 400; i++){

        let type;

        if(i < 160){
            type = "star";
        }
        else if(i < 240){
            type = "dust";
        }
        else if(i < 300){
            type = "sparkle";
        }
        else if(i < 350){
            type = "streak";
        }
        else if(i < 380){
            type = "petal";
        }
        else{
            type = "shoot";
        }

        particles.push({

            type,

            x:
                Math.random() * W(),

            y:
                H() +
                Math.random() * H() * .35,

            size:
                type === "star"
                    ? Math.random() * 2.2 + .5
                    : Math.random() * 3 + 1,

            speed:
                type === "star"
                    ? Math.random() * 1.2 + .35
                    : type === "dust"
                        ? Math.random() * 1.5 + .5
                        : type === "streak"
                            ? Math.random() * 3 + 1.5
                            : Math.random() * 2 + .5,

            drift:
                (Math.random() - .5) * 1.2,

            rotation:
                Math.random() * Math.PI * 2,

            rotationSpeed:
                (Math.random() - .5) * .08,

            life:
                Math.random(),

            alpha:
                Math.random() * .8 + .2,

            phase:
                Math.random() * Math.PI * 2

        });

    }

    const start =
        performance.now();

    const duration = 4600;

    function render(now){

        const elapsed =
            now - start;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        motion400Ctx.clearRect(
            0,
            0,
            W(),
            H()
        );

        particles.forEach(p => {

            p.y -= p.speed;

            p.x +=
                p.drift +
                Math.sin(
                    now * .0015 +
                    p.phase
                ) * .25;

            p.rotation +=
                p.rotationSpeed;

            if(
                p.y < -40
            ){
                p.y =
                    H() +
                    Math.random() * 100;

                p.x =
                    Math.random() * W();
            }

            /*
               Fade in → peak → fade out
            */

            let fade = 1;

            if(progress < .12){
                fade =
                    progress / .12;
            }

            if(progress > .78){
                fade =
                    1 -
                    ((progress - .78) / .22);
            }

            fade =
                Math.max(
                    0,
                    Math.min(1,fade)
                );

            const a =
                p.alpha * fade;

            motion400Ctx.save();

            motion400Ctx.translate(
                p.x,
                p.y
            );

            motion400Ctx.rotate(
                p.rotation
            );

            /*
               ⭐ STAR
            */

            if(p.type === "star"){

                motion400Ctx.globalAlpha =
                    a *
                    (
                        .55 +
                        Math.sin(
                            now * .004 +
                            p.phase
                        ) * .45
                    );

                motion400Ctx.fillStyle =
                    "rgba(255,239,180,1)";

                motion400Ctx.shadowBlur =
                    10;

                motion400Ctx.shadowColor =
                    "rgba(255,225,130,.9)";

                motion400Ctx.beginPath();

                motion400Ctx.arc(
                    0,
                    0,
                    p.size,
                    0,
                    Math.PI * 2
                );

                motion400Ctx.fill();

            }

            /*
               ✨ DUST
            */

            else if(p.type === "dust"){

                motion400Ctx.globalAlpha =
                    a * .55;

                motion400Ctx.fillStyle =
                    "rgba(190,215,255,1)";

                motion400Ctx.beginPath();

                motion400Ctx.arc(
                    0,
                    0,
                    p.size * .65,
                    0,
                    Math.PI * 2
                );

                motion400Ctx.fill();

            }

            /*
               ✦ SPARKLE
            */

            else if(p.type === "sparkle"){

                const pulse =
                    .5 +
                    Math.sin(
                        now * .006 +
                        p.phase
                    ) * .5;

                motion400Ctx.globalAlpha =
                    a * pulse;

                motion400Ctx.strokeStyle =
                    "rgba(255,240,190,1)";

                motion400Ctx.lineWidth =
                    1.2;

                const s =
                    p.size * 2.5;

                motion400Ctx.beginPath();

                motion400Ctx.moveTo(
                    -s,
                    0
                );

                motion400Ctx.lineTo(
                    s,
                    0
                );

                motion400Ctx.moveTo(
                    0,
                    -s
                );

                motion400Ctx.lineTo(
                    0,
                    s
                );

                motion400Ctx.stroke();

            }

            /*
               💫 LIGHT STREAK
            */

            else if(p.type === "streak"){

                motion400Ctx.globalAlpha =
                    a * .45;

                motion400Ctx.strokeStyle =
                    "rgba(220,235,255,1)";

                motion400Ctx.lineWidth =
                    p.size * .55;

                motion400Ctx.beginPath();

                motion400Ctx.moveTo(
                    0,
                    0
                );

                motion400Ctx.lineTo(
                    p.drift * -10,
                    p.speed * 8
                );

                motion400Ctx.stroke();

            }

            /*
               🌸 PETAL-LIKE PARTICLE
            */

            else if(p.type === "petal"){

                motion400Ctx.globalAlpha =
                    a * .45;

                motion400Ctx.fillStyle =
                    "rgba(255,205,220,1)";

                motion400Ctx.beginPath();

                motion400Ctx.ellipse(
                    0,
                    0,
                    p.size * 1.2,
                    p.size * .65,
                    0,
                    0,
                    Math.PI * 2
                );

                motion400Ctx.fill();

            }

            /*
               🌠 SHOOT PARTICLE
            */

            else if(p.type === "shoot"){

                motion400Ctx.globalAlpha =
                    a * .8;

                motion400Ctx.strokeStyle =
                    "rgba(255,245,205,1)";

                motion400Ctx.lineWidth =
                    1.5;

                motion400Ctx.beginPath();

                motion400Ctx.moveTo(
                    0,
                    0
                );

                motion400Ctx.lineTo(
                    -35,
                    22
                );

                motion400Ctx.stroke();

            }

            motion400Ctx.restore();

        });

        if(elapsed < duration){

            motion400Frame =
                requestAnimationFrame(
                    render
                );

        }
        else{

            motion400Ctx.clearRect(
                0,
                0,
                W(),
                H()
            );

            if(motion400Canvas){
                motion400Canvas.remove();
            }

            motion400Canvas = null;
            motion400Ctx = null;
            motion400Frame = null;

        }

    }

    motion400Frame =
        requestAnimationFrame(
            render
        );

}

/* ============================================================
   CINEMATIC STAR ASCENSION
   BINTANG JATUH TERBALIK — DARI BAWAH NAIK KE LANGIT
============================================================ */

function cinematicStarAscension() {

    const oldStar = document.querySelector("#cinematic-star");
    const oldTrail = document.querySelector("#cinematic-star-trail");

    if (oldStar) oldStar.remove();
    if (oldTrail) oldTrail.remove();

    const star = document.createElement("div");

    star.id = "cinematic-star";

    Object.assign(star.style, {
        position: "fixed",
        left: "50%",
        top: "76%",
        transform: "translate(-50%, -50%) scale(1)",
        fontSize: "42px",
        zIndex: "9999",
        pointerEvents: "none",
        filter: "drop-shadow(0 0 12px rgba(255,235,170,.95))",
        textShadow: "0 0 18px rgba(255,220,130,.95)"
    });

    star.textContent = "⭐";

    document.body.appendChild(star);

    /* ========================================================
       TRAIL BINTANG
    ======================================================== */

    const trail = document.createElement("div");

    trail.id = "cinematic-star-trail";

    Object.assign(trail.style, {
        position: "fixed",
        left: "50%",
        top: "76%",
        width: "4px",
        height: "0px",
        transform: "translateX(-50%)",
        transformOrigin: "bottom center",
        background:
            "linear-gradient(to top, transparent, rgba(255,230,150,.95), rgba(255,245,190,.35), transparent)",
        boxShadow:
            "0 0 12px rgba(255,220,130,.85), 0 0 28px rgba(255,220,130,.45)",
        borderRadius: "999px",
        zIndex: "9998",
        pointerEvents: "none",
        opacity: "0"
    });

    document.body.appendChild(trail);

    /* ========================================================
       POSISI PERJALANAN
       BAWAH → TENGAH → LANGIT
    ======================================================== */

    star.animate(
        [
            {
                top: "76%",
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1
            },
            {
                top: "67%",
                transform: "translate(-50%, -50%) scale(1.08)",
                opacity: 1,
                offset: .18
            },
            {
                top: "54%",
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1,
                offset: .42
            },
            {
                top: "38%",
                transform: "translate(-50%, -50%) scale(.78)",
                opacity: .95,
                offset: .68
            },
            {
                top: "21%",
                transform: "translate(-50%, -50%) scale(.48)",
                opacity: .8,
                offset: .88
            },
            {
                top: "13%",
                transform: "translate(-50%, -50%) scale(.08)",
                opacity: 0
            }
        ],
        {
            duration: 4200,
            easing: "cubic-bezier(.22,.72,.2,1)",
            fill: "forwards"
        }
    );

    /* ========================================================
       TRAIL MENGIKUTI BINTANG
    ======================================================== */

    trail.animate(
        [
            {
                height: "0px",
                opacity: 0
            },
            {
                height: "90px",
                opacity: .55,
                offset: .18
            },
            {
                height: "190px",
                opacity: .85,
                offset: .42
            },
            {
                height: "300px",
                opacity: .7,
                offset: .68
            },
            {
                height: "390px",
                opacity: .35,
                offset: .88
            },
            {
                height: "450px",
                opacity: 0
            }
        ],
        {
            duration: 4200,
            easing: "cubic-bezier(.22,.72,.2,1)",
            fill: "forwards"
        }
    );

    /* ========================================================
       SPARKLE SEPANJANG PERJALANAN
    ======================================================== */

    const sparkleTimer = setInterval(() => {

        if (!document.body.contains(star)) {
            clearInterval(sparkleTimer);
            return;
        }

        const rect = star.getBoundingClientRect();

        burst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            4
        );

    }, 140);

    /* ========================================================
       FLASH KECIL SAAT SAMPAI DI LANGIT
    ======================================================== */

    setTimeout(() => {

        if (!document.body.contains(star)) return;

        const rect = star.getBoundingClientRect();

        burst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            18
        );

        star.style.filter =
            "drop-shadow(0 0 25px rgba(255,240,170,1))";

    }, 3600);

    /* ========================================================
       CLEANUP
    ======================================================== */

    setTimeout(() => {

        clearInterval(sparkleTimer);

        if (document.body.contains(star)) {
            star.remove();
        }

        if (document.body.contains(trail)) {
            trail.remove();
        }

    }, 4500);
}








/* =========================================================
   MEGA MOTION UPGRADE
   1000 LIGHT PARTICLES + 20 CINEMATIC ANIMATIONS
========================================================= */

(function(){

    let megaCanvas = document.getElementById("mega-motion-canvas");

    if(!megaCanvas){

        megaCanvas = document.createElement("canvas");

        megaCanvas.id = "mega-motion-canvas";

        Object.assign(
            megaCanvas.style,
            {
                position:"fixed",
                inset:"0",
                width:"100%",
                height:"100%",
                pointerEvents:"none",
                zIndex:"4"
            }
        );

        document.body.appendChild(megaCanvas);
    }

    const ctx = megaCanvas.getContext("2d");

    let W = 0;
    let H = 0;
    let DPR = 1;

    const TAU = Math.PI * 2;

    function resizeMega(){

        DPR = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        W = window.innerWidth;
        H = window.innerHeight;

        megaCanvas.width = W * DPR;
        megaCanvas.height = H * DPR;

        ctx.setTransform(
            DPR,
            0,
            0,
            DPR,
            0,
            0
        );
    }

    resizeMega();

    window.addEventListener(
        "resize",
        resizeMega,
        {passive:true}
    );


    /* =====================================================
       1000 LIGHT PARTICLES
    ===================================================== */

    const particles = [];

    for(let i = 0; i < 1000; i++){

        const type =

            i < 300 ? "star" :
            i < 500 ? "dust" :
            i < 650 ? "sparkle" :
            i < 760 ? "streak" :
            i < 850 ? "petal" :
            "meteor";

        particles.push({

            type,

            x:Math.random(),
            y:Math.random(),

            vx:(Math.random()-.5) * .00035,
            vy:(Math.random()-.5) * .00045,

            size:
                type === "star" ? Math.random()*1.8+.5 :
                type === "dust" ? Math.random()*1.2+.3 :
                type === "sparkle" ? Math.random()*2+.7 :
                type === "streak" ? Math.random()*1.4+.5 :
                type === "petal" ? Math.random()*2+.8 :
                Math.random()*2.2+.8,

            alpha:Math.random()*.8+.15,

            phase:Math.random()*TAU,

            speed:Math.random()*.8+.2,

            rot:Math.random()*TAU,

            life:Math.random()*1000

        });
    }


    /* =====================================================
       20 CINEMATIC ANIMATION SYSTEMS
    ===================================================== */

    let time = 0;

    function glowCircle(x,y,r,a){

        const g = ctx.createRadialGradient(
            x,y,0,
            x,y,r
        );

        g.addColorStop(
            0,
            "rgba(255,220,150," + a + ")"
        );

        g.addColorStop(
            .35,
            "rgba(150,180,255," + (a*.45) + ")"
        );

        g.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            r,
            0,
            TAU
        );

        ctx.fill();
    }


    function drawAurora(){

        for(let i=0;i<3;i++){

            ctx.beginPath();

            for(
                let x=0;
                x<=W;
                x+=18
            ){

                const y =
                    H*.18 +
                    i*35 +
                    Math.sin(
                        x*.006 +
                        time*.00035 +
                        i
                    )*35;

                if(x===0)
                    ctx.moveTo(x,y);
                else
                    ctx.lineTo(x,y);
            }

            ctx.strokeStyle =
                "rgba(120,160,255," +
                (.035 + i*.012) +
                ")";

            ctx.lineWidth = 22;

            ctx.stroke();
        }
    }


    function drawOrbit(){

        const cx = W*.5;
        const cy = H*.36;

        ctx.save();

        ctx.translate(cx,cy);

        for(let i=0;i<3;i++){

            ctx.rotate(
                time*.00012*(i+1)
            );

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                110+i*38,
                28+i*12,
                0,
                0,
                TAU
            );

            ctx.strokeStyle =
                "rgba(255,215,150,.11)";

            ctx.lineWidth = 1;

            ctx.stroke();
        }

        ctx.restore();
    }


    function drawConstellation(){

        const nodes = [];

        for(let i=0;i<14;i++){

            nodes.push({

                x:
                    W*.15 +
                    Math.random()*W*.7,

                y:
                    H*.12 +
                    Math.random()*H*.45
            });
        }

        for(let i=0;i<nodes.length;i++){

            for(
                let j=i+1;
                j<nodes.length;
                j++
            ){

                const dx =
                    nodes[i].x -
                    nodes[j].x;

                const dy =
                    nodes[i].y -
                    nodes[j].y;

                const d =
                    Math.sqrt(
                        dx*dx+dy*dy
                    );

                if(d < 150){

                    ctx.strokeStyle =
                        "rgba(180,200,255," +
                        ((1-d/150)*.12) +
                        ")";

                    ctx.beginPath();

                    ctx.moveTo(
                        nodes[i].x,
                        nodes[i].y
                    );

                    ctx.lineTo(
                        nodes[j].x,
                        nodes[j].y
                    );

                    ctx.stroke();
                }
            }
        }

        nodes.forEach(n=>{

            glowCircle(
                n.x,
                n.y,
                8,
                .09
            );

            ctx.fillStyle =
                "rgba(255,235,190,.7)";

            ctx.beginPath();

            ctx.arc(
                n.x,
                n.y,
                1.4,
                0,
                TAU
            );

            ctx.fill();

        });
    }


    function drawWave(){

        const cy = H*.72;

        for(let k=0;k<3;k++){

            const radius =
                ((time*.035 + k*170)%700);

            ctx.beginPath();

            ctx.arc(
                W*.5,
                cy,
                radius,
                0,
                TAU
            );

            ctx.strokeStyle =
                "rgba(255,215,150," +
                Math.max(
                    0,
                    .13-radius/600
                ) +
                ")";

            ctx.lineWidth = 2;

            ctx.stroke();
        }
    }


    function drawSpiral(){

        const cx = W*.5;
        const cy = H*.42;

        ctx.save();

        ctx.translate(cx,cy);

        for(let i=0;i<80;i++){

            const a =
                i*.32 +
                time*.0012;

            const r =
                i*1.7;

            const x =
                Math.cos(a)*r;

            const y =
                Math.sin(a)*r;

            ctx.fillStyle =
                "rgba(255,220,170," +
                (.16-i*.0015) +
                ")";

            ctx.fillRect(
                x,
                y,
                1.5,
                1.5
            );
        }

        ctx.restore();
    }


    function drawPulse(){

        const pulse =
            (Math.sin(time*.003)+1)/2;

        glowCircle(
            W*.5,
            H*.38,
            100 + pulse*80,
            .035
        );
    }


    function drawComet(){

        const p =
            (time*.00018)%1;

        const x =
            W*(1-p);

        const y =
            H*(.12+p*.42);

        ctx.save();

        ctx.strokeStyle =
            "rgba(255,230,180,.55)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x+110,
            y-50
        );

        ctx.stroke();

        glowCircle(
            x,
            y,
            20,
            .18
        );

        ctx.restore();
    }


    function drawMeteorShower(){

        for(let i=0;i<4;i++){

            const p =
                ((time*.00032)+i*.27)%1;

            const x =
                W*(.15+i*.21)+
                p*180;

            const y =
                H*(.05+p*.45);

            ctx.strokeStyle =
                "rgba(255,240,210,.35)";

            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x-55,
                y-30
            );

            ctx.stroke();
        }
    }


    function drawFireflies(){

        for(let i=0;i<35;i++){

            const x =
                W*(.15+
                .7*
                ((i*37)%100)/100);

            const y =
                H*(.35+
                .45*
                ((i*61)%100)/100);

            const pulse =
                (Math.sin(
                    time*.002+i
                )+1)/2;

            ctx.fillStyle =
                "rgba(255,220,130,"+
                (.12+pulse*.3)+
                ")";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1+pulse*1.5,
                0,
                TAU
            );

            ctx.fill();
        }
    }


    function drawRings(){

        const cx=W*.5;
        const cy=H*.52;

        for(let i=0;i<4;i++){

            const r =
                40+
                ((time*.04+i*90)%330);

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                r,
                0,
                TAU
            );

            ctx.strokeStyle =
                "rgba(255,210,160,"+
                Math.max(
                    0,
                    .08-r/420
                )+
                ")";

            ctx.stroke();
        }
    }


    function drawLightBeam(){

        const g =
            ctx.createLinearGradient(
                0,
                0,
                0,
                H
            );

        g.addColorStop(
            0,
            "rgba(255,230,170,.035)"
        );

        g.addColorStop(
            .5,
            "rgba(150,180,255,.018)"
        );

        g.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle=g;

        ctx.fillRect(
            W*.35,
            0,
            W*.3,
            H
        );
    }


    function drawStarBurst(){

        const cx=W*.5;
        const cy=H*.35;

        const pulse =
            (Math.sin(time*.004)+1)/2;

        for(let i=0;i<24;i++){

            const a =
                i/24*TAU;

            const r =
                40+
                pulse*55;

            ctx.strokeStyle =
                "rgba(255,225,170,.12)";

            ctx.beginPath();

            ctx.moveTo(
                cx+
                Math.cos(a)*r,
                cy+
                Math.sin(a)*r
            );

            ctx.lineTo(
                cx+
                Math.cos(a)*(r+15),
                cy+
                Math.sin(a)*(r+15)
            );

            ctx.stroke();
        }
    }


    function drawPetalStorm(){

        for(let i=0;i<22;i++){

            const x =
                W*
                ((i*47+time*.002)%100)/100;

            const y =
                ((time*.045+i*70)%H);

            ctx.save();

            ctx.translate(x,y);

            ctx.rotate(
                time*.001+i
            );

            ctx.fillStyle =
                "rgba(255,190,210,.18)";

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                3,
                7,
                0,
                0,
                TAU
            );

            ctx.fill();

            ctx.restore();
        }
    }


    function drawDustCloud(){

        for(let i=0;i<90;i++){

            const x =
                W*.5+
                Math.sin(
                    i*.7+
                    time*.0007
                )*W*.4;

            const y =
                H*.45+
                Math.cos(
                    i*.41+
                    time*.0005
                )*H*.28;

            ctx.fillStyle =
                "rgba(180,200,255,.025)";

            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }
    }


    function drawHalo(){

        const pulse =
            (Math.sin(time*.002)+1)/2;

        glowCircle(
            W*.5,
            H*.35,
            170+80*pulse,
            .025
        );

        glowCircle(
            W*.5,
            H*.35,
            80+30*pulse,
            .045
        );
    }


    function drawMoonGlow(){

        const x=W*.82;
        const y=H*.16;

        glowCircle(
            x,
            y,
            80,
            .035
        );

        ctx.strokeStyle =
            "rgba(255,235,190,.1)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            34+
            Math.sin(time*.001)*2,
            0,
            TAU
        );

        ctx.stroke();
    }


    function drawFloatingLights(){

        for(let i=0;i<18;i++){

            const x =
                W*.1+
                ((i*73+
                time*.025)%80)/
                100*W*.8;

            const y =
                H*.65+
                Math.sin(
                    time*.001+i
                )*H*.12;

            const a =
                .05+
                (Math.sin(
                    time*.003+i
                )+1)*.08;

            glowCircle(
                x,
                y,
                10,
                a
            );
        }
    }


    /* =====================================================
       MAIN LOOP
    ===================================================== */

    function animateMega(){

        time += 16;

        ctx.clearRect(
            0,
            0,
            W,
            H
        );

        /* 20 cinematic systems */

        drawAurora();
        drawOrbit();
        drawConstellation();
        drawWave();
        drawSpiral();
        drawPulse();
        drawComet();
        drawMeteorShower();
        drawFireflies();
        drawRings();
        drawLightBeam();
        drawStarBurst();
        drawPetalStorm();
        drawDustCloud();
        drawHalo();
        drawMoonGlow();
        drawFloatingLights();

        /* 1000 particles */

        for(const p of particles){

            p.x += p.vx*p.speed;
            p.y += p.vy*p.speed;

            p.phase += .015;

            if(p.x<0) p.x=1;
            if(p.x>1) p.x=0;
            if(p.y<0) p.y=1;
            if(p.y>1) p.y=0;

            const x=p.x*W;
            const y=p.y*H;

            const pulse =
                .45+
                .55*
                Math.sin(
                    p.phase
                );

            if(p.type==="star"){

                ctx.fillStyle =
                    "rgba(255,235,190,"+
                    p.alpha*pulse+
                    ")";

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    p.size,
                    0,
                    TAU
                );

                ctx.fill();

            }

            else if(p.type==="dust"){

                ctx.fillStyle =
                    "rgba(180,200,255,"+
                    p.alpha*.25+
                    ")";

                ctx.fillRect(
                    x,
                    y,
                    p.size,
                    p.size
                );

            }

            else if(p.type==="sparkle"){

                ctx.strokeStyle =
                    "rgba(255,230,180,"+
                    p.alpha*pulse+
                    ")";

                ctx.lineWidth=1;

                ctx.beginPath();

                ctx.moveTo(
                    x-p.size*2,
                    y
                );

                ctx.lineTo(
                    x+p.size*2,
                    y
                );

                ctx.moveTo(
                    x,
                    y-p.size*2
                );

                ctx.lineTo(
                    x,
                    y+p.size*2
                );

                ctx.stroke();

            }

            else if(p.type==="streak"){

                ctx.strokeStyle =
                    "rgba(180,205,255,"+
                    p.alpha*.35+
                    ")";

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x-p.vx*90000,
                    y-p.vy*90000
                );

                ctx.stroke();

            }

            else if(p.type==="petal"){

                ctx.save();

                ctx.translate(
                    x,
                    y
                );

                ctx.rotate(
                    p.rot+
                    time*.0005
                );

                ctx.fillStyle =
                    "rgba(255,180,205,"+
                    p.alpha*.18+
                    ")";

                ctx.beginPath();

                ctx.ellipse(
                    0,
                    0,
                    p.size,
                    p.size*2,
                    0,
                    0,
                    TAU
                );

                ctx.fill();

                ctx.restore();

            }

            else {

                ctx.strokeStyle =
                    "rgba(255,240,210,"+
                    p.alpha*.45+
                    ")";

                ctx.lineWidth=1;

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x-p.vx*120000,
                    y-p.vy*120000
                );

                ctx.stroke();
            }
        }

        requestAnimationFrame(
            animateMega
        );
    }

    animateMega();


    /* =====================================================
       GAME — SLOWER STAR
    ===================================================== */

    window.spawnStar = function(){

        if(!gameRunning)
            return;

        randomStarPosition();

        const target =
            document.getElementById(
                "star-target"
            );

        if(!target)
            return;

        target.classList.remove(
            "show"
        );

        void target.offsetWidth;

        target.classList.add(
            "show"
        );

        if(window.__megaStarTimeout)
            clearTimeout(
                window.__megaStarTimeout
            );

        window.__megaStarTimeout =
            setTimeout(
                () => {

                    if(!gameRunning)
                        return;

                    target.classList.remove(
                        "show"
                    );

                    setTimeout(
                        () => {

                            if(gameRunning)
                                spawnStar();

                        },
                        650
                    );

                },
                5200+
                Math.random()*2200
            );
    };


    /* =====================================================
       OVERRIDE OLD 400 FX
       Existing code can still call startMotion400FX()
       but now it launches the upgraded system.
    ===================================================== */

    window.startMotion400FX = function(){

        megaCanvas.style.opacity="1";

        for(let i=0;i<12;i++){

            setTimeout(
                () => {

                    const x =
                        W*.15+
                        Math.random()*W*.7;

                    const y =
                        H*.15+
                        Math.random()*H*.5;

                    glowCircle(
                        x,
                        y,
                        80+
                        Math.random()*100,
                        .08
                    );

                },
                i*180
            );
        }
    };

})();


/* FINAL SAFE FEATURES */
(() => {
  console.log("🎂 FINAL SAFE FEATURES");

  /* =====================================================
     CSS
     ===================================================== */

  const finalStyle = document.createElement("style");

  finalStyle.id = "final-safe-features-style";

  finalStyle.textContent = `
    #final-music-control {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 9999;

      width: 46px;
      height: 46px;

      border-radius: 50%;
      border: 1px solid rgba(255,255,255,.25);

      background: rgba(10,15,35,.65);
      color: white;

      backdrop-filter: blur(12px);

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 18px;

      cursor: pointer;

      box-shadow:
        0 0 18px rgba(255,215,140,.16);

      transition:
        transform .35s ease,
        opacity .35s ease,
        box-shadow .35s ease;
    }

    #final-music-control:hover {
      transform: scale(1.08);

      box-shadow:
        0 0 28px rgba(255,215,140,.28);
    }

    #final-music-control.off {
      opacity: .55;
    }


    #final-send-whatsapp {
      margin-top: 14px;

      min-height: 46px;
      padding: 0 22px;

      border-radius: 999px;

      border: 1px solid rgba(255,255,255,.22);

      background:
        linear-gradient(
          135deg,
          rgba(255,210,130,.18),
          rgba(130,170,255,.18)
        );

      color: white;

      font-size: 14px;
      font-weight: 600;

      cursor: pointer;

      backdrop-filter: blur(10px);

      transition:
        transform .35s ease,
        box-shadow .35s ease;
    }

    #final-send-whatsapp:hover {
      transform:
        translateY(-3px)
        scale(1.025);

      box-shadow:
        0 8px 30px rgba(255,210,130,.20);
    }


    #final-audio-notice {
      position: fixed;

      left: 50%;
      bottom: 76px;

      transform:
        translate(-50%, 20px);

      z-index: 9998;

      padding: 10px 17px;

      border-radius: 999px;

      background: rgba(10,15,35,.80);

      backdrop-filter: blur(12px);

      color: white;

      font-size: 12px;

      opacity: 0;

      pointer-events: none;

      transition:
        opacity .45s ease,
        transform .45s ease;
    }

    #final-audio-notice.show {
      opacity: 1;

      transform:
        translate(-50%, 0);
    }


    #final-easter-glow {
      position: fixed;

      width: 120px;
      height: 120px;

      left: 50%;
      top: 50%;

      transform:
        translate(-50%, -50%)
        scale(.35);

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          rgba(255,225,150,.58),
          rgba(255,190,90,.20) 38%,
          transparent 72%
        );

      opacity: 0;

      pointer-events: none;

      z-index: 9997;

      transition:
        opacity .7s ease,
        transform 1s cubic-bezier(.2,.8,.2,1);
    }

    #final-easter-glow.show {
      opacity: 1;

      transform:
        translate(-50%, -50%)
        scale(2.2);
    }


    #final-cinematic-light {
      position: fixed;

      inset: 0;

      z-index: 9990;

      pointer-events: none;

      opacity: 0;

      background:
        radial-gradient(
          circle at 50% 42%,
          rgba(255,225,160,.16),
          transparent 30%
        );

      transition:
        opacity 2.5s ease;
    }

    #final-cinematic-light.show {
      opacity: 1;
    }

    #final-cinematic-light.fade {
      opacity: 0;
    }


    @keyframes finalBreathingSafe {

      0%,100% {
        filter:
          drop-shadow(
            0 0 8px
            rgba(255,220,150,.05)
          );

        transform: scale(1);
      }

      50% {
        filter:
          drop-shadow(
            0 0 22px
            rgba(255,220,150,.22)
          );

        transform: scale(1.012);
      }

    }

    #final.active h1,
    #final.active h2 {
      animation:
        finalBreathingSafe
        5s
        ease-in-out
        infinite;
    }


    @media(max-width:600px){

      #final-music-control {
        right: 12px;
        bottom: 12px;
      }

      #final-audio-notice {
        bottom: 68px;

        max-width:
          calc(100vw - 30px);

        text-align: center;
      }

      #final-send-whatsapp {
        width:
          min(90vw, 320px);
      }

    }
  `;

  document.head.appendChild(finalStyle);


  /* =====================================================
     AMBIL AUDIO YANG SUDAH ADA
     ===================================================== */

  const finalAudio =
    document.getElementById("birthday-music");


  /* =====================================================
     MUSIC BUTTON
     ===================================================== */

  function createFinalMusicButton(){

    if(!finalAudio) return;

    if(
      document.getElementById(
        "final-music-control"
      )
    ) return;

    const button =
      document.createElement("button");

    button.id =
      "final-music-control";

    button.type = "button";

    button.textContent =
      finalAudio.paused
        ? "🔇"
        : "🔊";

    button.title =
      "Musik ON / OFF";

    button.addEventListener(
      "click",
      () => {

        if(finalAudio.paused){

          finalAudio.volume = .58;

          finalAudio.play()
            .then(() => {

              button.textContent = "🔊";

              button.classList.remove(
                "off"
              );

            })
            .catch(() => {

              showFinalAudioNotice();

            });

        } else {

          finalAudio.pause();

          button.textContent = "🔇";

          button.classList.add("off");

        }

      }
    );

    document.body.appendChild(button);
  }


  /* =====================================================
     AUDIO FALLBACK
     ===================================================== */

  function showFinalAudioNotice(){

    let notice =
      document.getElementById(
        "final-audio-notice"
      );

    if(!notice){

      notice =
        document.createElement("div");

      notice.id =
        "final-audio-notice";

      notice.textContent =
        "🔊 Tap layar sekali untuk menyalakan musik";

      document.body.appendChild(notice);
    }

    notice.classList.add("show");

    clearTimeout(
      window.__finalAudioNoticeTimer
    );

    window.__finalAudioNoticeTimer =
      setTimeout(() => {

        notice.classList.remove(
          "show"
        );

      }, 3500);
  }


  /* =====================================================
     WHATSAPP BUTTON
     ===================================================== */

  function createWhatsAppButton(){

    const finalScreen =
      document.getElementById("final");

    if(!finalScreen) return;

    if(
      document.getElementById(
        "final-send-whatsapp"
      )
    ) return;

    const button =
      document.createElement("button");

    button.id =
      "final-send-whatsapp";

    button.type = "button";

    button.textContent =
      "💌 Kirim Ucapan ke Teteh";

    button.addEventListener(
      "click",
      () => {

        const message =
`Selamat ulang tahun, Teteh Oky! 🎂🤍

Semoga Teteh selalu sehat, bahagia, dimudahkan dalam setiap urusan, dilancarkan rezekinya, dan selalu diberi keberkahan bersama keluarga. ✨

Semoga kejutan kecil ini bisa bikin Teteh senyum hari ini. 🌙💫`;

        const whatsapp =
          "https://wa.me/?text=" +
          encodeURIComponent(message);

        window.open(
          whatsapp,
          "_blank"
        );
      }
    );


    /*
      Cari tombol terakhir di final.
      Kalau ketemu, taruh setelahnya.
      Kalau tidak, append ke screen.
    */

    const buttons =
      finalScreen.querySelectorAll(
        "button"
      );

    if(buttons.length){

      buttons[
        buttons.length - 1
      ].insertAdjacentElement(
        "afterend",
        button
      );

    } else {

      finalScreen.appendChild(
        button
      );

    }
  }


  /* =====================================================
     LANTERN EASTER EGG
     ===================================================== */

  function createLanternEgg(){

    const lanterns =
      document.querySelectorAll(
        "#lanterns .lantern"
      );

    if(!lanterns.length) return;

    lanterns.forEach(
      lantern => {

        let clicks = 0;

        let timer = null;

        lantern.addEventListener(
          "click",
          () => {

            clicks++;

            clearTimeout(timer);

            timer =
              setTimeout(
                () => {
                  clicks = 0;
                },
                1500
              );

            if(clicks < 3) return;

            clicks = 0;

            showLanternSecret();

          }
        );

      }
    );
  }


  function showLanternSecret(){

    let glow =
      document.getElementById(
        "final-easter-glow"
      );

    if(!glow){

      glow =
        document.createElement("div");

      glow.id =
        "final-easter-glow";

      document.body.appendChild(glow);
    }

    glow.classList.remove("show");

    void glow.offsetWidth;

    glow.classList.add("show");


    const message =
      document.createElement("div");

    message.textContent =
      "✨ Teteh menemukan pesan rahasia 🤍";

    Object.assign(
      message.style,
      {
        position:"fixed",
        left:"50%",
        top:"50%",
        transform:
          "translate(-50%,-50%) scale(.85)",
        zIndex:"9999",
        padding:"13px 20px",
        borderRadius:"999px",
        background:
          "rgba(10,15,35,.84)",
        backdropFilter:
          "blur(14px)",
        color:"white",
        fontSize:"13px",
        textAlign:"center",
        opacity:"0",
        pointerEvents:"none",
        transition:
          "opacity .5s ease, transform .7s ease",
        boxShadow:
          "0 0 35px rgba(255,215,130,.22)"
      }
    );

    document.body.appendChild(
      message
    );

    requestAnimationFrame(
      () => {

        message.style.opacity = "1";

        message.style.transform =
          "translate(-50%,-50%) scale(1)";

      }
    );

    setTimeout(
      () => {

        message.style.opacity = "0";

        message.style.transform =
          "translate(-50%,-50%) scale(.9)";

        setTimeout(
          () => message.remove(),
          700
        );

      },
      2200
    );

    setTimeout(
      () => {

        glow.classList.remove(
          "show"
        );

      },
      1800
    );

  }


  /* =====================================================
     FINAL CINEMATIC
     ===================================================== */

  function createFinalLight(){

    if(
      document.getElementById(
        "final-cinematic-light"
      )
    ) return;

    const light =
      document.createElement("div");

    light.id =
      "final-cinematic-light";

    document.body.appendChild(
      light
    );
  }


  function checkFinalScene(){

    const finalScreen =
      document.getElementById("final");

    if(!finalScreen) return;

    const active =
      finalScreen.classList.contains(
        "active"
      );

    if(
      active &&
      !window.__finalScenePlayed
    ){

      window.__finalScenePlayed = true;

      const light =
        document.getElementById(
          "final-cinematic-light"
        );

      if(light){

        light.classList.remove(
          "show",
          "fade"
        );

        void light.offsetWidth;

        light.classList.add(
          "show"
        );

        setTimeout(
          () => {

            light.classList.add(
              "fade"
            );

          },
          3500
        );

      }

      /*
        Gunakan FX yang SUDAH ADA.
        Tidak membuat sistem particle baru.
      */

      try{

        if(
          typeof window.createSparkles ===
          "function"
        ){

          window.createSparkles(
            18
          );

        }

        if(
          typeof window.starBurst ===
          "function"
        ){

          window.starBurst(
            window.innerWidth / 2,
            window.innerHeight * .35,
            18
          );

        }

      }catch{}

    }

    if(!active){

      window.__finalScenePlayed =
        false;

    }

  }


  /* =====================================================
     INIT
     ===================================================== */

  createFinalMusicButton();

  createWhatsAppButton();

  createLanternEgg();

  createFinalLight();


  /*
    Kalau audio belum bisa autoplay,
    tap pertama akan mencoba play.
  */

  if(finalAudio){

    document.addEventListener(
      "pointerdown",
      () => {

        if(
          finalAudio.paused
        ){

          finalAudio.volume = .58;

          finalAudio.play()
            .catch(
              () => showFinalAudioNotice()
            );

        }

      },
      {
        passive:true
      }
    );

  }


  setInterval(
    checkFinalScene,
    500
  );


  console.log(
    "💌 WhatsApp button READY"
  );

  console.log(
    "🎵 Music control READY"
  );

  console.log(
    "🏮 Lantern Easter egg READY"
  );

  console.log(
    "🌙 Final cinematic READY"
  );

  console.log(
    "🎂 FINAL SAFE FEATURES READY"
  );

})();


/* FINAL POLISH 9-10 */
(function(){

    // =========================================================
    // #9 CURSOR / TOUCH STAR TRAIL
    // =========================================================

    const trailCanvas = document.createElement("canvas");
    trailCanvas.id = "final-touch-trail";

    Object.assign(trailCanvas.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "999",
        opacity: "0.42"
    });

    document.body.appendChild(trailCanvas);

    const trailCtx = trailCanvas.getContext("2d");
    let trailW = 0;
    let trailH = 0;
    let trailParticles = [];
    let lastTrailTime = 0;

    function resizeFinalTrail(){
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        trailW = window.innerWidth;
        trailH = window.innerHeight;

        trailCanvas.width = trailW * dpr;
        trailCanvas.height = trailH * dpr;

        trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeFinalTrail();

    window.addEventListener("resize", resizeFinalTrail);

    function createFinalTrail(x, y){

        const now = performance.now();

        if(now - lastTrailTime < 45) return;

        lastTrailTime = now;

        trailParticles.push({
            x: x + (Math.random() - 0.5) * 7,
            y: y + (Math.random() - 0.5) * 7,
            vx: (Math.random() - 0.5) * 0.35,
            vy: -0.15 - Math.random() * 0.25,
            size: 0.8 + Math.random() * 1.8,
            life: 1
        });

        if(trailParticles.length > 65){
            trailParticles.splice(0, trailParticles.length - 65);
        }
    }

    window.addEventListener("pointermove", function(e){
        createFinalTrail(e.clientX, e.clientY);
    }, {passive:true});

    window.addEventListener("touchmove", function(e){

        if(!e.touches || !e.touches[0]) return;

        createFinalTrail(
            e.touches[0].clientX,
            e.touches[0].clientY
        );

    }, {passive:true});

    function animateFinalTrail(){

        trailCtx.clearRect(0, 0, trailW, trailH);

        for(let i = trailParticles.length - 1; i >= 0; i--){

            const p = trailParticles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.035;

            if(p.life <= 0){
                trailParticles.splice(i, 1);
                continue;
            }

            trailCtx.globalAlpha = p.life * 0.7;

            trailCtx.beginPath();
            trailCtx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            trailCtx.fillStyle = "rgba(255,220,150,0.9)";
            trailCtx.fill();
        }

        trailCtx.globalAlpha = 1;

        requestAnimationFrame(animateFinalTrail);
    }

    animateFinalTrail();


    // =========================================================
    // #10 PRELOAD ASSET
    // =========================================================

    const finalMusic =
        document.getElementById("birthday-music");

    if(finalMusic){

        finalMusic.preload = "auto";

        try{
            finalMusic.load();
        }catch(error){
            console.warn(
                "Preload backsound gagal:",
                error
            );
        }
    }

    document.querySelectorAll("img").forEach(function(img){

        if(!img.src) return;

        const preloadImage = new Image();

        preloadImage.src = img.src;
    });


    // =========================================================
    // MOBILE POLISH
    // =========================================================

    const finalPolishStyle =
        document.createElement("style");

    finalPolishStyle.textContent = `
        #final-touch-trail{
            mix-blend-mode:screen;
        }

        @media(max-width:600px){

            #final-touch-trail{
                opacity:.28;
            }

            button{
                touch-action:manipulation;
            }
        }

        @media(prefers-reduced-motion:reduce){

            #final-touch-trail{
                display:none!important;
            }
        }
    `;

    document.head.appendChild(finalPolishStyle);

    console.log(
        "FINAL POLISH #9-#10 AKTIF"
    );

})();


/* BACKGROUND FINAL CLEAN */
(function(){

    const mega = document.getElementById("mega-motion-canvas");
    const fx = document.getElementById("fx");
    const particles = document.getElementById("particles");
    const sparkles = document.getElementById("sparkles");
    const stars = document.getElementById("stars");
    const shooting = document.getElementById("shooting-stars");
    const clouds = document.getElementById("clouds");

    /*
     * Background normal:
     * awan + bintang tetap terlihat,
     * particle hanya aksen.
     */

    function cleanBackground(){

        if(clouds){
            clouds.style.opacity = "0.82";
        }

        if(stars){
            stars.style.opacity = "0.55";
        }

        if(shooting){
            shooting.style.opacity = "0.45";
        }

        if(particles){
            particles.style.opacity = "0.14";
        }

        if(sparkles){
            sparkles.style.opacity = "0.22";
        }

        if(fx){
            fx.style.opacity = "0.28";
        }

        if(mega){
            mega.style.opacity = "0.16";
        }
    }

    function cinematicBackground(){

        if(clouds){
            clouds.style.opacity = "0.72";
        }

        if(stars){
            stars.style.opacity = "0.48";
        }

        if(shooting){
            shooting.style.opacity = "0.38";
        }

        if(particles){
            particles.style.opacity = "0.10";
        }

        if(sparkles){
            sparkles.style.opacity = "0.18";
        }

        if(fx){
            fx.style.opacity = "0.24";
        }

        if(mega){
            mega.style.opacity = "0.55";
        }
    }

    function updateBackground(){

        const active =
            document.querySelector(".screen.active");

        if(!active){
            cleanBackground();
            return;
        }

        const id = active.id;

        if(
            id === "star-motion" ||
            id === "prank" ||
            id === "prayer" ||
            id === "final"
        ){
            cinematicBackground();
        }else{
            cleanBackground();
        }
    }

    /*
     * Jangan menghapus animateMega().
     * Kita cukup mengatur visual output-nya berdasarkan scene.
     */

    cleanBackground();

    setInterval(updateBackground, 500);

    window.addEventListener("resize", updateBackground);

    console.log("BACKGROUND FINAL CLEAN AKTIF");

})();


/* PRAYER CALM CINEMATIC */
(function(){

    const style = document.createElement("style");

    style.textContent = `
        /* ================================
           PRAYER — CALM CINEMATIC
           ================================ */

        #prayer{
            background:
                radial-gradient(
                    circle at 50% 22%,
                    rgba(255,218,150,.12),
                    transparent 30%
                ),
                radial-gradient(
                    circle at 50% 80%,
                    rgba(92,115,190,.08),
                    transparent 45%
                );
        }

        #prayer::before{
            content:"";
            position:absolute;
            left:50%;
            top:-18%;
            width:220px;
            height:75%;
            transform:translateX(-50%);
            background:
                linear-gradient(
                    to bottom,
                    rgba(255,235,180,.20),
                    rgba(255,235,180,.06),
                    transparent
                );
            filter:blur(18px);
            opacity:.65;
            pointer-events:none;
            animation:prayerLightBreath 7s ease-in-out infinite;
        }

        #prayer::after{
            content:"";
            position:absolute;
            left:50%;
            top:28%;
            width:210px;
            height:210px;
            transform:translate(-50%,-50%);
            border-radius:50%;
            background:
                radial-gradient(
                    circle,
                    rgba(255,221,153,.16),
                    rgba(255,221,153,.05) 35%,
                    transparent 70%
                );
            filter:blur(10px);
            pointer-events:none;
            animation:prayerAura 6s ease-in-out infinite;
        }

        #prayer .screen-content,
        #prayer .content,
        #prayer .prayer-card{
            position:relative;
            z-index:3;
        }

        @keyframes prayerLightBreath{
            0%,100%{
                opacity:.38;
                transform:translateX(-50%) scaleX(.82);
            }
            50%{
                opacity:.72;
                transform:translateX(-50%) scaleX(1.05);
            }
        }

        @keyframes prayerAura{
            0%,100%{
                opacity:.45;
                transform:translate(-50%,-50%) scale(.86);
            }
            50%{
                opacity:.85;
                transform:translate(-50%,-50%) scale(1.08);
            }
        }

        #prayer h1,
        #prayer h2,
        #prayer p{
            animation:
                prayerTextBreath 6s ease-in-out infinite;
        }

        @keyframes prayerTextBreath{
            0%,100%{
                opacity:.88;
            }
            50%{
                opacity:1;
            }
        }

        @media(max-width:600px){
            #prayer::before{
                width:160px;
                opacity:.55;
            }

            #prayer::after{
                width:160px;
                height:160px;
            }
        }
    `;

    document.head.appendChild(style);


    // --------------------------------
    // Background khusus scene DOA
    // --------------------------------

    function prayerBackground(){

        const prayer =
            document.getElementById("prayer");

        if(!prayer) return;

        const active =
            prayer.classList.contains("active");

        const mega =
            document.getElementById("mega-motion-canvas");

        const particles =
            document.getElementById("particles");

        const sparkles =
            document.getElementById("sparkles");

        const shooting =
            document.getElementById("shooting-stars");

        const stars =
            document.getElementById("stars");

        const fx =
            document.getElementById("fx");

        if(active){

            // Jangan matikan semuanya.
            // Cuma dibuat sangat halus.

            if(mega){
                mega.style.opacity = "0.075";
            }

            if(particles){
                particles.style.opacity = "0.035";
            }

            if(sparkles){
                sparkles.style.opacity = "0.08";
            }

            if(shooting){
                shooting.style.opacity = "0.12";
            }

            if(stars){
                stars.style.opacity = "0.34";
            }

            if(fx){
                fx.style.opacity = "0.10";
            }

        }else{

            // Kembalikan kontrol ke background-clean sebelumnya.
            if(mega){
                mega.style.opacity = "";
            }

            if(particles){
                particles.style.opacity = "";
            }

            if(sparkles){
                sparkles.style.opacity = "";
            }

            if(shooting){
                shooting.style.opacity = "";
            }

            if(stars){
                stars.style.opacity = "";
            }

            if(fx){
                fx.style.opacity = "";
            }
        }
    }

    prayerBackground();

    setInterval(prayerBackground, 400);

    console.log("PRAYER CALM CINEMATIC AKTIF");

})();


/* LAMPION EASTER EGG FINAL */
(function(){

    const style = document.createElement("style");

    style.textContent = `
        /* ================================
           LAMPION EASTER EGG
           ================================ */

        #lanterns .lantern{
            cursor:pointer;
            transition:
                transform .7s cubic-bezier(.22,1,.36,1),
                filter .7s ease;
        }

        #lanterns .lantern.lantern-secret{
            filter:
                brightness(1.35)
                drop-shadow(0 0 18px rgba(255,205,110,.95));

            transform:
                translateY(8px)
                scale(1.08);
        }

        #lantern-easter-message{
            position:fixed;
            left:50%;
            top:22%;
            transform:
                translate(-50%,20px)
                scale(.86);

            width:min(390px,86vw);
            padding:22px 24px;

            border:1px solid rgba(255,220,150,.38);
            border-radius:22px;

            background:
                linear-gradient(
                    145deg,
                    rgba(22,24,60,.94),
                    rgba(45,31,68,.92)
                );

            box-shadow:
                0 20px 60px rgba(0,0,0,.42),
                0 0 35px rgba(255,210,120,.14);

            backdrop-filter:blur(14px);

            text-align:center;

            opacity:0;
            pointer-events:none;

            z-index:9999;

            transition:
                opacity .7s ease,
                transform .7s cubic-bezier(.22,1,.36,1);
        }

        #lantern-easter-message.show{
            opacity:1;
            transform:
                translate(-50%,0)
                scale(1);
        }

        #lantern-easter-message .easter-small{
            display:block;
            margin-bottom:8px;

            color:#f7d99a;

            font-size:.72rem;
            letter-spacing:.18em;
            text-transform:uppercase;
        }

        #lantern-easter-message .easter-main{
            display:block;

            color:#fff;

            font-size:
                clamp(1.05rem,3.8vw,1.35rem);

            font-weight:700;
            line-height:1.45;
        }

        #lantern-easter-message .easter-sub{
            display:block;

            margin-top:10px;

            color:rgba(255,255,255,.68);

            font-size:.82rem;
            line-height:1.5;
        }

        #lantern-easter-message .easter-close{
            margin-top:15px;

            color:#f5d58f;

            font-size:.72rem;

            opacity:.7;
        }

        @media(max-width:600px){

            #lantern-easter-message{
                top:18%;
                padding:19px 18px;
                border-radius:18px;
            }
        }
    `;

    document.head.appendChild(style);


    // --------------------------------
    // Buat pesan Easter Egg
    // --------------------------------

    const message = document.createElement("div");

    message.id = "lantern-easter-message";

    message.innerHTML = `
        <span class="easter-small">
            🏮 Secret message
        </span>

        <span class="easter-main">
            Tante... kapan main ke Jawa lagi nih? 👀
        </span>

        <span class="easter-sub">
            Ditunggu lhooo 🤭✨
        </span>

        <span class="easter-close">
            ketuk lampion lagi untuk menutup
        </span>
    `;

    document.body.appendChild(message);


    // --------------------------------
    // Cari semua lampion
    // --------------------------------

    const lanternContainer =
        document.getElementById("lanterns");

    if(!lanternContainer){
        console.warn(
            "Container #lanterns tidak ditemukan."
        );
        return;
    }

    let activeLantern = null;

    function openLanternEgg(lantern){

        if(activeLantern === lantern){

            closeLanternEgg();

            return;
        }

        if(activeLantern){
            activeLantern.classList.remove(
                "lantern-secret"
            );
        }

        activeLantern = lantern;

        lantern.classList.add(
            "lantern-secret"
        );

        message.classList.add("show");

        // Pakai efek yang sudah ada kalau tersedia.
        try{
            if(typeof createSparkles === "function"){
                createSparkles(14);
            }
        }catch(e){}

        try{
            if(typeof starBurst === "function"){
                starBurst(
                    window.innerWidth / 2,
                    window.innerHeight * .22,
                    10
                );
            }
        }catch(e){}
    }

    function closeLanternEgg(){

        if(activeLantern){
            activeLantern.classList.remove(
                "lantern-secret"
            );
        }

        activeLantern = null;

        message.classList.remove("show");
    }


    // --------------------------------
    // Klik lampion
    // --------------------------------

    lanternContainer.addEventListener(
        "click",
        function(e){

            const lantern =
                e.target.closest(".lantern");

            if(!lantern) return;

            openLanternEgg(lantern);
        }
    );


    // --------------------------------
    // Touch mobile
    // --------------------------------

    lanternContainer.addEventListener(
        "touchend",
        function(e){

            const lantern =
                e.target.closest(".lantern");

            if(!lantern) return;

            e.preventDefault();

            openLanternEgg(lantern);
        },
        {passive:false}
    );


    // Klik pesan = tutup
    message.addEventListener(
        "click",
        closeLanternEgg
    );


    // Auto close setelah 8 detik
    let autoCloseTimer;

    const originalOpen = openLanternEgg;

    function timedOpen(lantern){

        originalOpen(lantern);

        clearTimeout(autoCloseTimer);

        autoCloseTimer = setTimeout(
            closeLanternEgg,
            8000
        );
    }

    // Ganti handler dengan versi timer
    lanternContainer.onclick = function(e){

        const lantern =
            e.target.closest(".lantern");

        if(!lantern) return;

        timedOpen(lantern);
    };

    console.log(
        "LAMPION EASTER EGG FINAL AKTIF 🏮"
    );

})();


/* FINAL CLEAN + REAL LANTERN */
(function(){

    // ==========================================
    // 1. MATIKAN MEGA PARTICLE CANVAS
    // ==========================================

    function hideMegaCanvas(){

        const mega =
            document.getElementById("mega-motion-canvas");

        if(mega){
            mega.style.display = "none";
            mega.style.visibility = "hidden";
            mega.style.opacity = "0";
        }
    }

    hideMegaCanvas();

    setInterval(hideMegaCanvas, 300);


    // ==========================================
    // 2. BUAT LAMPION EASTER EGG BENERAN
    // ==========================================

    const container =
        document.getElementById("lanterns");

    if(!container){
        console.warn(
            "Container #lanterns tidak ditemukan."
        );
        return;
    }

    let lantern =
        document.getElementById("real-lantern-easter");

    if(!lantern){

        lantern = document.createElement("div");

        lantern.id =
            "real-lantern-easter";

        lantern.className =
            "lantern";

        lantern.innerHTML = "🏮";

        container.appendChild(lantern);
    }


    // ==========================================
    // 3. STYLE LAMPION
    // ==========================================

    const style =
        document.createElement("style");

    style.textContent = `

        #lanterns{
            position:relative;
            z-index:20;
        }

        #real-lantern-easter{
            position:absolute;

            right:9%;
            top:18%;

            width:58px;
            height:72px;

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:46px;

            cursor:pointer;

            user-select:none;

            filter:
                drop-shadow(
                    0 0 8px
                    rgba(255,190,90,.45)
                );

            transform-origin:top center;

            animation:
                finalLanternFloat
                4.8s
                ease-in-out
                infinite;
        }

        #real-lantern-easter.secret-open{
            filter:
                drop-shadow(
                    0 0 24px
                    rgba(255,210,110,1)
                );

            animation:
                finalLanternOpen
                .9s
                cubic-bezier(.22,1,.36,1)
                both;
        }

        @keyframes finalLanternFloat{

            0%,100%{
                transform:
                    translateY(0)
                    rotate(-2deg);
            }

            50%{
                transform:
                    translateY(7px)
                    rotate(2deg);
            }
        }

        @keyframes finalLanternOpen{

            0%{
                transform:
                    scale(1)
                    translateY(0);
            }

            45%{
                transform:
                    scale(1.18)
                    translateY(8px);
            }

            100%{
                transform:
                    scale(1.06)
                    translateY(4px);
            }
        }

        #real-lantern-hint{
            position:absolute;

            right:6%;
            top:12%;

            padding:
                7px 12px;

            border-radius:999px;

            background:
                rgba(15,18,45,.72);

            border:
                1px solid
                rgba(255,220,150,.25);

            color:
                rgba(255,235,190,.9);

            font-size:.68rem;

            letter-spacing:.04em;

            pointer-events:none;

            animation:
                lanternHint
                3s
                ease-in-out
                infinite;

            z-index:21;
        }

        @keyframes lanternHint{

            0%,100%{
                opacity:.45;
                transform:
                    translateY(0);
            }

            50%{
                opacity:1;
                transform:
                    translateY(-4px);
            }
        }

        #final-lantern-secret{
            position:fixed;

            left:50%;
            top:22%;

            width:min(
                390px,
                86vw
            );

            transform:
                translate(-50%,25px)
                scale(.9);

            padding:
                22px 22px;

            border-radius:22px;

            background:
                linear-gradient(
                    145deg,
                    rgba(18,20,52,.96),
                    rgba(47,31,64,.95)
                );

            border:
                1px solid
                rgba(255,220,150,.35);

            box-shadow:
                0 20px 60px
                rgba(0,0,0,.45),

                0 0 35px
                rgba(255,210,120,.18);

            backdrop-filter:
                blur(14px);

            text-align:center;

            opacity:0;
            pointer-events:none;

            z-index:10000;

            transition:
                opacity .65s ease,
                transform .65s
                cubic-bezier(.22,1,.36,1);
        }

        #final-lantern-secret.show{
            opacity:1;

            transform:
                translate(-50%,0)
                scale(1);
        }

        #final-lantern-secret .secret-title{
            display:block;

            margin-bottom:9px;

            color:
                #f6d58f;

            font-size:.72rem;

            letter-spacing:.16em;

            text-transform:uppercase;
        }

        #final-lantern-secret .secret-main{
            display:block;

            color:#fff;

            font-size:
                clamp(
                    1rem,
                    4vw,
                    1.3rem
                );

            font-weight:700;

            line-height:1.5;
        }

        #final-lantern-secret .secret-sub{
            display:block;

            margin-top:9px;

            color:
                rgba(255,255,255,.68);

            font-size:.8rem;
        }

        @media(max-width:600px){

            #real-lantern-easter{
                right:7%;
                top:14%;

                font-size:40px;
            }

            #real-lantern-hint{
                right:4%;
                top:9%;

                font-size:.6rem;
            }
        }
    `;

    document.head.appendChild(style);


    // ==========================================
    // 4. HINT
    // ==========================================

    const hint =
        document.createElement("div");

    hint.id =
        "real-lantern-hint";

    hint.textContent =
        "coba pencet aku 👀";

    container.appendChild(hint);


    // ==========================================
    // 5. SECRET MESSAGE
    // ==========================================

    const secret =
        document.createElement("div");

    secret.id =
        "final-lantern-secret";

    secret.innerHTML = `
        <span class="secret-title">
            🏮 Secret message
        </span>

        <span class="secret-main">
            Tante... kapan main ke Jawa lagi nih? 👀
        </span>

        <span class="secret-sub">
            Ditunggu lhooo 🤭✨
        </span>
    `;

    document.body.appendChild(secret);


    let opened = false;

    function openSecret(){

        opened = !opened;

        if(opened){

            lantern.classList.add(
                "secret-open"
            );

            hint.style.opacity = "0";

            secret.classList.add(
                "show"
            );

            try{
                if(typeof createSparkles === "function"){
                    createSparkles(12);
                }
            }catch(e){}

            try{
                if(typeof starBurst === "function"){
                    starBurst(
                        window.innerWidth * .9,
                        window.innerHeight * .2,
                        10
                    );
                }
            }catch(e){}

        }else{

            lantern.classList.remove(
                "secret-open"
            );

            secret.classList.remove(
                "show"
            );

            hint.style.opacity = "";
        }
    }


    // CAPTURE PHASE:
    // mencegah handler Easter Egg lama
    // melakukan toggle dua kali.

    container.addEventListener(
        "click",
        function(e){

            const target =
                e.target.closest(
                    "#real-lantern-easter"
                );

            if(!target) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            openSecret();

        },
        true
    );


    container.addEventListener(
        "touchend",
        function(e){

            const target =
                e.target.closest(
                    "#real-lantern-easter"
                );

            if(!target) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            openSecret();

        },
        {
            passive:false,
            capture:true
        }
    );


    secret.addEventListener(
        "click",
        function(){

            opened = false;

            lantern.classList.remove(
                "secret-open"
            );

            secret.classList.remove(
                "show"
            );

            hint.style.opacity = "";
        }
    );


    console.log(
        "FINAL CLEAN + REAL LANTERN AKTIF"
    );

})();
/* ===== LAMPION CLICK FIX FINAL ===== */
(() => {
    const waitLantern = setInterval(() => {
        const lantern = document.getElementById("real-lantern-easter");

        if (!lantern) return;

        clearInterval(waitLantern);

        lantern.style.position = "fixed";
        lantern.style.right = "9%";
        lantern.style.top = "18%";
        lantern.style.zIndex = "999999";
        lantern.style.pointerEvents = "auto";
        lantern.style.cursor = "pointer";
        lantern.style.touchAction = "manipulation";
        lantern.style.userSelect = "none";

        lantern.onclick = null;

        const showSecret = (e) => {
            e.preventDefault();
            e.stopPropagation();

            let msg = document.getElementById("lantern-secret-final");

            if (!msg) {
                msg = document.createElement("div");
                msg.id = "lantern-secret-final";

                msg.innerHTML = `
                    <div class="lantern-secret-title">🏮 Secret Message</div>
                    <div class="lantern-secret-text">
                        Tante... kapan main ke Jawa lagi nih? 👀
                    </div>
                    <div class="lantern-secret-sub">
                        Ditunggu lhooo 🤭✨
                    </div>
                    <button id="lantern-secret-close">Tutup</button>
                `;

                document.body.appendChild(msg);

                document.getElementById("lantern-secret-close").onclick = (ev) => {
                    ev.stopPropagation();
                    msg.classList.remove("show");
                };
            }

            msg.classList.add("show");

            if (typeof createSparkles === "function") {
                createSparkles(25);
            }

            if (typeof starBurst === "function") {
                starBurst(
                    window.innerWidth * 0.88,
                    window.innerHeight * 0.2,
                    18
                );
            }
        };

        lantern.addEventListener("click", showSecret, true);
        lantern.addEventListener("touchend", showSecret, true);

        const hint = document.createElement("div");
        hint.className = "lantern-click-hint";
        hint.textContent = "coba pencet aku 👀";
        lantern.appendChild(hint);

        const style = document.createElement("style");
        style.textContent = `
            #real-lantern-easter {
                display: flex !important;
                align-items: center;
                justify-content: center;
                width: 64px !important;
                height: 78px !important;
                font-size: 48px !important;
                z-index: 999999 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                touch-action: manipulation !important;
                filter: drop-shadow(0 0 12px rgba(255,190,80,.8));
                transform: translateZ(0);
            }

            .lantern-click-hint {
                position: absolute;
                top: 82px;
                left: 50%;
                transform: translateX(-50%);
                width: max-content;
                padding: 5px 9px;
                border-radius: 999px;
                background: rgba(10,12,30,.72);
                color: #fff;
                font-size: 10px;
                white-space: nowrap;
                pointer-events: none;
                animation: lanternHint 2s ease-in-out infinite;
            }

            #lantern-secret-final {
                position: fixed;
                inset: 0;
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(3,5,18,.72);
                backdrop-filter: blur(7px);
                opacity: 0;
                pointer-events: none;
                transition: opacity .6s ease;
            }

            #lantern-secret-final.show {
                opacity: 1;
                pointer-events: auto;
            }

            .lantern-secret-title {
                font-size: 25px;
                margin-bottom: 18px;
                color: #ffd978;
            }

            .lantern-secret-text {
                max-width: 420px;
                text-align: center;
                color: white;
                font-size: 22px;
                line-height: 1.5;
            }

            .lantern-secret-sub {
                margin-top: 12px;
                color: #ffdff0;
                font-size: 16px;
            }

            #lantern-secret-close {
                margin-top: 26px;
                border: 0;
                padding: 10px 22px;
                border-radius: 999px;
                background: #fff;
                color: #222;
                cursor: pointer;
            }

            @keyframes lanternHint {
                0%,100% { opacity:.45; transform:translateX(-50%) translateY(0); }
                50% { opacity:1; transform:translateX(-50%) translateY(-4px); }
            }

            @media(max-width:600px) {
                #real-lantern-easter {
                    right: 6% !important;
                    top: 14% !important;
                }

                .lantern-secret-text {
                    font-size: 19px;
                }
            }
        `;

        document.head.appendChild(style);

        console.log("🏮 LAMPION CLICK FIX READY");
    }, 300);
})();

/* ===== LAMPION CLICK FIX FINAL ===== */
(() => {
    const waitLantern = setInterval(() => {
        const lantern = document.getElementById("real-lantern-easter");

        if (!lantern) return;

        clearInterval(waitLantern);

        lantern.style.position = "fixed";
        lantern.style.right = "9%";
        lantern.style.top = "18%";
        lantern.style.zIndex = "999999";
        lantern.style.pointerEvents = "auto";
        lantern.style.cursor = "pointer";
        lantern.style.touchAction = "manipulation";
        lantern.style.userSelect = "none";

        lantern.onclick = null;

        const showSecret = (e) => {
            e.preventDefault();
            e.stopPropagation();

            let msg = document.getElementById("lantern-secret-final");

            if (!msg) {
                msg = document.createElement("div");
                msg.id = "lantern-secret-final";

                msg.innerHTML = `
                    <div class="lantern-secret-title">🏮 Secret Message</div>
                    <div class="lantern-secret-text">
                        Tante... kapan main ke Jawa lagi nih? 👀
                    </div>
                    <div class="lantern-secret-sub">
                        Ditunggu lhooo 🤭✨
                    </div>
                    <button id="lantern-secret-close">Tutup</button>
                `;

                document.body.appendChild(msg);

                document.getElementById("lantern-secret-close").onclick = (ev) => {
                    ev.stopPropagation();
                    msg.classList.remove("show");
                };
            }

            msg.classList.add("show");

            if (typeof createSparkles === "function") {
                createSparkles(25);
            }

            if (typeof starBurst === "function") {
                starBurst(
                    window.innerWidth * 0.88,
                    window.innerHeight * 0.2,
                    18
                );
            }
        };

        lantern.addEventListener("click", showSecret, true);
        lantern.addEventListener("touchend", showSecret, true);

        const hint = document.createElement("div");
        hint.className = "lantern-click-hint";
        hint.textContent = "coba pencet aku 👀";
        lantern.appendChild(hint);

        const style = document.createElement("style");
        style.textContent = `
            #real-lantern-easter {
                display: flex !important;
                align-items: center;
                justify-content: center;
                width: 64px !important;
                height: 78px !important;
                font-size: 48px !important;
                z-index: 999999 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                touch-action: manipulation !important;
                filter: drop-shadow(0 0 12px rgba(255,190,80,.8));
                transform: translateZ(0);
            }

            .lantern-click-hint {
                position: absolute;
                top: 82px;
                left: 50%;
                transform: translateX(-50%);
                width: max-content;
                padding: 5px 9px;
                border-radius: 999px;
                background: rgba(10,12,30,.72);
                color: #fff;
                font-size: 10px;
                white-space: nowrap;
                pointer-events: none;
                animation: lanternHint 2s ease-in-out infinite;
            }

            #lantern-secret-final {
                position: fixed;
                inset: 0;
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(3,5,18,.72);
                backdrop-filter: blur(7px);
                opacity: 0;
                pointer-events: none;
                transition: opacity .6s ease;
            }

            #lantern-secret-final.show {
                opacity: 1;
                pointer-events: auto;
            }

            .lantern-secret-title {
                font-size: 25px;
                margin-bottom: 18px;
                color: #ffd978;
            }

            .lantern-secret-text {
                max-width: 420px;
                text-align: center;
                color: white;
                font-size: 22px;
                line-height: 1.5;
            }

            .lantern-secret-sub {
                margin-top: 12px;
                color: #ffdff0;
                font-size: 16px;
            }

            #lantern-secret-close {
                margin-top: 26px;
                border: 0;
                padding: 10px 22px;
                border-radius: 999px;
                background: #fff;
                color: #222;
                cursor: pointer;
            }

            @keyframes lanternHint {
                0%,100% { opacity:.45; transform:translateX(-50%) translateY(0); }
                50% { opacity:1; transform:translateX(-50%) translateY(-4px); }
            }

            @media(max-width:600px) {
                #real-lantern-easter {
                    right: 6% !important;
                    top: 14% !important;
                }

                .lantern-secret-text {
                    font-size: 19px;
                }
            }
        `;

        document.head.appendChild(style);

        console.log("🏮 LAMPION CLICK FIX READY");
    }, 300);
})();

