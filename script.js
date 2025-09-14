const IMAGES = [
  "Images/Carrot.png",
  "Images/Corn.png",
  "Images/Cucumber.png",
  "Images/eggplant.png",
  "Images/Lettuce.png",
  "Images/peas.png",
  "Images/Pepper.png",
  "Images/Potato.png",
  "Images/Pumpkin.png",
  "Images/Radish.png",
  "Images/spinach.png",
  "Images/Tomato.png",
]

const board = document.getElementById("board")
const movesEl = document.getElementById("moves")
const pairsEl = document.getElementById("pairs")
const matchesEl = document.getElementById("matches")
const timerEl = document.getElementById("timer")
const restartBtn = document.getElementById("restart")
const messageEl = document.getElementById("message")

let deck = []
let firstCard = null
let secondCard = null
let matches = 0
let moves = 0
let seconds = 0
let timer = null
let locked = false

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

const startTimer = () => {
  if (timer) return
  timer = setInterval(() => {
    seconds++
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    timerEl.textContent = `${m}:${s}`
  }, 1000)
}

const stopTimer = () => {
  clearInterval(timer)
  timer = null
}

const makeDeck = () => {
  let cards = []
  IMAGES.forEach((img, i) => {
    cards.push({ id: `${i}a`, img, pair: i })
    cards.push({ id: `${i}b`, img, pair: i })
  })
  return shuffle(cards)
}

const renderBoard = () => {
  board.innerHTML = ""
  deck.forEach((card, index) => {
    const cardEl = document.createElement("div")
    cardEl.className = "card"
    cardEl.dataset.index = index

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">?</div>
        <div class="card-face card-back"><img src="${card.img}" alt=""></div>
      </div>
    `

    cardEl.addEventListener("click", () => flipCard(cardEl, card))
    board.appendChild(cardEl)
  })
}

const flipCard = (el, card) => {
  if (locked || el.classList.contains("is-flipped")) return

  startTimer()
  el.classList.add("is-flipped")

  if (!firstCard) {
    firstCard = { el, card }
    return
  }

  secondCard = { el, card }
  moves++
  movesEl.textContent = moves
  locked = true

  if (firstCard.card.pair === secondCard.card.pair) {
    matches++
    matchesEl.textContent = matches
    resetTurn()
    if (matches === IMAGES.length) winGame()
  } else {
    setTimeout(() => {
      firstCard.el.classList.remove("is-flipped")
      secondCard.el.classList.remove("is-flipped")
      resetTurn()
    }, 800)
  }
}

const resetTurn = () => {
  ;[firstCard, secondCard] = [null, null]
  locked = false
}

const winGame = () => {
  stopTimer()
  messageEl.textContent = `You won! 🎉 Moves: ${moves}, Time: ${timerEl.textContent}`
  board.classList.add("disabled")
}

const resetGame = () => {
  stopTimer()
  seconds = 0
  timerEl.textContent = "00:00"
  moves = 0
  matches = 0
  movesEl.textContent = "0"
  matchesEl.textContent = "0"
  messageEl.textContent = "Find all matching pairs!"
  board.classList.remove("disabled")

  deck = makeDeck()
  renderBoard()
}

restartBtn.addEventListener("click", resetGame)
resetGame()
