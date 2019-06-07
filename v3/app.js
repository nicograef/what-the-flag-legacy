// Time to guess the answer in milliseconds
const waitingTime = 2000

// click does not work on ios
const clickOrTouch = navigator.userAgent.match(/iPhone|iPad/i) ? 'touchstart' : 'click'

let nextQuestionTimeout
let data

const STATE = {
  language: 'en',
  gameMode: 'flag-to-capital',
  optionsCount: {
    'flag-to-country': 5,
    'flag-to-capital': 5,
    'country-to-flag': 3,
    'country-to-capital': 5,
    'capital-to-flag': 3,
    'capital-to-country': 5
  }
}

const ui = new UI()

fetch('https://restcountries.eu/rest/v2/all?fields=name;flag;capital;translations')
  .then(res => res.json())
  .then(countries => {
    data = countries.map(country => {
      country.translations.en = country.name
      country.name = country.translations
      delete country.translations
      return country
    })
  })
  .then(init)

function init() {
  ui.options.addEventListener(clickOrTouch, e => {
    if (e.target.nodeName !== 'BUTTON') return
    ui.showSolution(e.target)
    clearTimeout(nextQuestionTimeout)
    nextQuestionTimeout = setTimeout(nextQuestion, waitingTime)
  })

  ui.languages.addEventListener(clickOrTouch, e => {
    if (e.target.nodeName !== 'BUTTON') return
    STATE.language = e.target.id
    nextQuestion().then(() => ui.showGame())
    ui.showLoader()
  })

  ui.games.addEventListener(clickOrTouch, e => {
    if (e.target.nodeName !== 'BUTTON') return
    STATE.gameMode = e.target.id
    if (STATE.gameMode)
      if (STATE.gameMode.includes('country')) ui.showLanguageMenu()
      else {
        nextQuestion().then(() => ui.showGame())
        ui.showLoader()
      }
  })

  // ui.showLanguageMenu()
  ui.showGamesMenu()
}

function nextQuestion() {
  const countries = getRandomCountries()
  const solutionIndex = Math.floor(Math.random() * countries.length)
  const solution = countries[solutionIndex]

  return ui.setQuestion(solution).then(() => ui.showOptions(countries, solution))
}

function getRandomCountries() {
  const countries = []
  const indices = []
  let index
  for (let i = 0; i < STATE.optionsCount[STATE.gameMode]; i++) {
    index = Math.floor(Math.random() * data.length)
    if (!indices.includes(index)) {
      indices.push(index)
      countries.push(data[index])
    } else i--
  }
  return countries
}
