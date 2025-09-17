//An array of all images we are using as cards. Each image will appear twice in the game. We store them in one place so we can easily change or add images later.
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
const board = document.getElementById("board") //The game grid where cards appear
const movesEl = document.getElementById("moves") //Shows the number of moves player've made
const pairsEl = document.getElementById("pairs") //Total pairs in the game(12)
const matchesEl = document.getElementById("matches") //How many pairs player've found so far
const timerEl = document.getElementById("timer") //Shows the timer (MM:SS) format
const restartBtn = document.getElementById("restart") //Button that restarts the game
const messageEl = document.getElementById("message") //Small text massage

//Game state variables
let deck = [] //The array of card objects
let firstCard = null //Store first clicked card
let secondCard = null //Store second clicked card
let matches = 0 //Numbers of pairs matches
let moves = 0 //Numbers of moves made
let seconds = 0 //Timer second
let timer = null
let locked = false //Lock the board while checking matches

//Shuffle function to randomize the cards. This makes sure every time player start the game, cards are in different order
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

//Stops and clear the timer when the game ends or restart
const stopTimer = () => {
  clearInterval(timer)
  timer = null
}

//Creates a shuffled dick with pairs
const makeDeck = () => {
  let cards = []
  IMAGES.forEach((img, i) => {
    cards.push({ id: `${i}a`, img, pair: i }) //id is unique identifier to track individual cards
    cards.push({ id: `${i}b`, img, pair: i }) //Pair: a number so we know which two cards match
  })
  return shuffle(cards)
}

//Create the cards on the board every time the game starts or resets (DOM elements)
const renderBoard = () => {
  board.innerHTML = "" //board is the <section id="board"></section> element in HTML,innerHTML = "" removes everything inside it, so we start fresh each time.
  //deck ia an array with all the card objects(each has an img and an id), index is its position in the deck
  deck.forEach((card, index) => {
    // make a card div to represent the card
    const cardEl = document.createElement("div")
    cardEl.classList.add("card")
    cardEl.dataset.index = index //dataset.index: to track which card was clicked later

    //Makes a container inside the card that will hold both the front and back
    const inner = document.createElement("div")
    inner.classList.add("card-inner")

    const front = document.createElement("div")
    front.classList.add("card-face", "card-front")
    front.textContent = "?"

    const back = document.createElement("div")
    back.classList.add("card-face", "card-back") //create the back face of the card

    const img = document.createElement("img") //create <img> tag and sets its src to the card's image file
    img.src = card.img
    img.alt = ""

    back.appendChild(img) //Puts the <img> inside the back face
    inner.appendChild(front) //Puts the front and back inside the container
    inner.appendChild(back)
    cardEl.appendChild(inner) //Puts the inner container inside the main card

    // flip when clicked
    cardEl.addEventListener("click", () => flipCard(cardEl, card))

    // put card on the board
    board.appendChild(cardEl)
  })
}

//Handles flipping cards and checking matches, Check if cards match, flips the card face-up when clicked, if it's the first card it just saves it and wait for the second. When the second card is flipped (increments the mover counter,locks the board while checking if they match, if they match they stay flipped, if they don't match flips them back after 800ms)
//classList gives you a special object that lets you add, remove, or toggle those classes easily.
const flipCard = (fc, card) => {
  if (locked || fc.classList.contains("is-flipped")) return

  startTimer()
  fc.classList.add("is-flipped")

  if (!firstCard) {
    firstCard = { fc, card }
    return
  }

  secondCard = { fc, card }
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
      firstCard.fc.classList.remove("is-flipped")
      secondCard.fc.classList.remove("is-flipped")
      resetTurn()
    }, 800)
  }
}

//Resets the selected cards so the player can pick new ones
const resetTurn = () => {
  ;[firstCard, secondCard] = [null, null]
  locked = false
}

//Called when all matches are found, Stop the timer and display the massage you won
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
