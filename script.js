const cards = document.querySelectorAll(".card")
const restartButton = document.getElementById("#restart")
let firstCard = null
let secondCard = null
let lockBoard = false
let moves = 0

cards.forEach((card) => card.addEventListener("click", flipCard))
restartButton.addEventListener("click", restartGame)
shuffleCards()
