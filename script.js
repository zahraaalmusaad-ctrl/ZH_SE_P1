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

//Grab references to important elements on the page
const board = document.getElementById("board")
const movesEl = document.getElementById("moves")
const pairsEl = document.getElementById("pairs")
const matchesEl = document.getElementById("matches")
const timerEl = document.getElementById("timer")
const restartBtn = document.getElementById("restart")
const messageEl = document.getElementById("message")

//Game state variables
let deck = [] //The array of card objects
let firstCard = null //Store first clicked card
let secondCard = null //Store second clicked card
let matches = 0 //Numbers of pairs matches
let moves = 0 //Numbers of moves made
let seconds = 0 //Timer second
let timer = null
let locked = false //Lock the board while checking matches

//Shuffle function to randomize the cards
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

//Start the timer (called on first flip)
const startTimer = () => {
  if (timer) return
  timer = setInterval(() => {
    seconds++
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    timerEl.textContent = `${m}:${s}`
  }, 1000)
}

//Stops and clear the timer
const stopTimer = () => {
  clearInterval(timer)
  timer = null
}

//Creates a shuffled dick with pairs
const makeDeck = () => {
  let cards = []
  IMAGES.forEach((img, i) => {
    cards.push({ id: `${i}a`, img, pair: i })
    cards.push({ id: `${i}b`, img, pair: i })
  })
  return shuffle(cards)
}

//Draws the cards on the board(DOM elements)
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
    //Add click event to flip the card
    cardEl.addEventListener("click", () => flipCard(cardEl, card))
    board.appendChild(cardEl)
  })
}

//Handles flipping cards and checking matches
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

  //Check if cards match
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

//Resets the selected cards and unlock the board
const resetTurn = () => {
  ;[firstCard, secondCard] = [null, null]
  locked = false
}

//Called when all matches are found
const winGame = () => {
  stopTimer()
  messageEl.textContent = `You won! 🎉 Moves: ${moves}, Time: ${timerEl.textContent}`
  board.classList.add("disabled")
}

//Resets the game state
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
  showCardsBriefly()
}

// This function flips all cards face up for 5 seconds at the start of the game
const showCardsBriefly = () => {
  const allCards = document.querySelectorAll(".card")
  allCards.forEach((card) => card.classList.add("is-flipped"))

  locked = true // Prevent clicking while previewing

  setTimeout(() => {
    allCards.forEach((card) => card.classList.remove("is-flipped"))
    locked = false // Allow user to play after preview
  }, 5000)
}

//Restart button listener
restartBtn.addEventListener("click", resetGame)

//Start the game when page loads
resetGame()
