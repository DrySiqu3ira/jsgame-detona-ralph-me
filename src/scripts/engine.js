const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    livesContainer: document.querySelector(".menu-lives"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    if (state.values.result > 10) {
      playSound("victory");
      alert("Você ganhou! O seu resultado foi: " + state.values.result);
    } else {
      playSound("gameover");
      alert("Game Over! O seu resultado foi: " + state.values.result);
    }
  }
}

function playSound(audioName) {
  try {
    const audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
  } catch (error) {
    console.error("Erro ao tentar tocar o som:", error);
  }
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  const randomNumber = Math.floor(Math.random() * 9);
  const randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitbox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.lives--;
        updateLives();

        if (state.values.lives <= 0) {
          clearInterval(state.actions.countDownTimerId);
          clearInterval(state.actions.timerId);
          playSound("gameover");
          alert(
            "Game Over! Você perdeu todas as vidas. Sua pontuação final foi: " +
              state.values.result
          );
        } else {
          playSound("wrong");
        }
      }
    });
  });
}

function updateLives() {
  state.view.livesContainer.innerHTML = "";

  for (let i = 0; i < state.values.lives; i++) {
    let lifeImage = document.createElement("img");
    lifeImage.src = "./src/images/player.png";
    lifeImage.alt = "Vida do Jogador";
    state.view.livesContainer.appendChild(lifeImage);
  }
}

function init() {
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  addListenerHitbox();
  updateLives();
}

init();
