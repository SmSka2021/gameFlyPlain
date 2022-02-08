let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let btn = document.querySelector(".btn");
let rules = document.querySelector("#rules");
let ruleBlock = document.querySelector(".rule_block");
let btnOk = document.querySelector(".btn_ok");
let record = document.querySelector("#record");
let scoreBlock = document.querySelector(".score_block");
let btn_record = document.querySelector(".btn_record");
let maximum = document.querySelector(".maximum");

let game;
let score = localStorage.getItem("score") || 0;
let maxScore = localStorage.getItem("maxScore") || 0;

maximum.innerText = maxScore;
rules.addEventListener("click", ruleRedmy);
btn.addEventListener("click", playGame);
btnOk.addEventListener("click", ruleRedmy);
record.addEventListener("click", recordRedmy);
btn_record.addEventListener("click", recordRedmy);

function ruleRedmy() {
  ruleBlock.classList.toggle("dispNon");
  if (ruleBlock.classList.contains("dispNon")) {
    newGame.play();
  }
}
function recordRedmy() {
  scoreBlock.classList.toggle("dispNon");
}

let plane = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

plane.src = "./assets/img/airbas.png";
bg.src = "./assets/img/fon7.png";
fg.src = "./assets/img/45.png";
pipeUp.src = "./assets/img/obl5.png";
pipeBottom.src = "./assets/img/obl5.png";
// Звуковые файлы
let fly = new Audio();
let score_audio = new Audio();
let finish = new Audio();
let newGame = new Audio();

fly.src = "./assets/audio/motorr.mp3";
score_audio.src = "./assets/audio/score.mp3";
finish.src = "./assets/audio/plachet.mp3";
newGame.src = "./assets/audio/nevGame.mp3";

let gap = 130; //зазор между облаками по высоте//

// При нажатии на какую-либо кнопку- звук двигателя
document.addEventListener("keydown", moveUp);

function moveUp() {
  yPos -= 20;
  fly.play();
}
// Создание блоков
let pipe = [];

pipe[0] = {
  x: canvas.width,
  y: 0,
};

// Начальная позиция самолета
let xPos = 150;
let yPos = 150;
let grav = 1.5;

function draw() {
  context.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    context.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    context.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    pipe[i].x--;

    if (pipe[i].x == 120) {
      //если первое облако находится на расстоянии  150px oт левого края, рисуем справа новое облако
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
      });
    }

    // Отслеживание прикосновений
    if (
      (xPos + plane.width >= pipe[i].x &&
        xPos <= pipe[i].x + pipeUp.width &&
        (yPos <= pipe[i].y + pipeUp.height ||
          yPos + plane.height >= pipe[i].y + pipeUp.height + gap)) ||
      yPos + plane.height >= canvas.height - fg.height
    ) {
      finish.play();
      game = false;
      reload_interval(2000); // Перезагрузка страницы после 2 сек//
      drawin(); //Отрисовка графики
    }

    if (pipe[i].x == -100) {   //Если прошел 100 px под облаками- засчитываем очко    
      score++;
      score_audio.play();
      localStorage.setItem("score", score);
      if (score > maxScore) {
        maxScore = score;
        localStorage.setItem("maxScore", maxScore);
      }
    }
  }
  context.drawImage(plane, xPos, yPos);
  context.drawImage(fg, 0, canvas.height - fg.height); 

  yPos += grav;

  context.fillStyle = "#d5d80b";
  context.font = "24px 'Inter'";
  context.fillText("Счет: " + score, 85, canvas.height - 15);

  requestAnimationFrame(draw);
}

pipeBottom.onload = drawin; ///отрисовка графики после загрузки последнего img

function drawin() {
  context.drawImage(bg, 0, 0);
  context.drawImage(plane, xPos, yPos);
  context.drawImage(fg, 0, canvas.height - fg.height); 
  context.fillStyle = "#d5d80b";
  context.font = "24px 'Inter'";
  context.fillText("Счет: " + score, 85, canvas.height - 15);
}
function playGame() {  //кнопка start 
  score = 0;
  localStorage.setItem("score", score);
  draw();
  game = true;
}

function reload_interval(time) { //Перезагрузка страницы -после указанного time  
  setTimeout(function () {
    location.reload();
  }, time);
}
