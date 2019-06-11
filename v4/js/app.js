const $$ = Dom7

const DATA = {
  countries: [],
  language: 'en',
  languages: ['en', 'de', 'es', 'fr', 'it', 'nl', 'ja'],
  region: 'world',
  gameMode: 'flag-to-country',
  gameModes: [
    'flag-to-country',
    'flag-to-capital',
    'country-to-flag',
    'country-to-capital',
    'capital-to-flag',
    'capital-to-country'
  ],
  optionsCount: {
    'flag-to-country': 5,
    'flag-to-capital': 5,
    'country-to-flag': 3,
    'country-to-capital': 5,
    'capital-to-flag': 3,
    'capital-to-country': 5
  },
  waitingTime: 1500
}

const app = new Framework7({
  root: '#app',
  name: 'What The Flag',
  id: 'com.nicograef.wtf',
  version: '4.0.0',
  smartSelect: {
    closeOnSelect: true
  },
  routes: [
    {
      path: '/',
      url: 'index.html'
    },
    {
      path: '/game/',
      url: 'game.html'
    }
  ]
})

let ui, nextQuestionTimeout

const mainView = app.views.create('.view-main')
const languageSelect = app.smartSelect.get('#languages')
const gameSelect = app.smartSelect.get('#games')
const regionSelect = app.smartSelect.get('#regions')

// load app settings on app start
$$(document).on('DOMContentLoaded', e => {
  loadSettings()
})

// init game when game page is loaded
$$(document).on('page:init', function(e, page) {
  if (page.name === 'game') initGame()
})

$$('#play').on('click', () => {
  DATA.language = languageSelect.getValue()
  DATA.gameMode = gameSelect.getValue()
  DATA.region = regionSelect.getValue()

  saveSettings()

  const region = DATA.region === 'world' ? 'all' : 'region/' + DATA.region
  fetch(`https://restcountries.eu/rest/v2/${region}?fields=name;flag;capital;translations`)
    .then(res => res.json())
    .then(countries => setCountryData(countries))
    .then(() => mainView.router.navigate('/game/'))
})

function initGame() {
  const newTitle = DATA.gameMode
    .split('-')
    .join(' ')
    .toUpperCase()
  $$('#game-title').text(newTitle)

  ui = new UI()
  ui.options.addEventListener('click', e => {
    if (e.target.nodeName !== 'BUTTON') return
    ui.revealSolution(e.target)
    clearTimeout(nextQuestionTimeout)
    nextQuestionTimeout = setTimeout(nextQuestion, DATA.waitingTime)
  })

  nextQuestion()
}

function nextQuestion() {
  ui.clearUI()
  app.preloader.show()
  let mixedMode
  if (DATA.gameMode === 'mixed') {
    mixedMode = true
    DATA.gameMode = DATA.gameModes[Math.floor(Math.random() * DATA.gameModes.length)]
    const newTitle = DATA.gameMode
      .split('-')
      .join(' ')
      .toUpperCase()
    $$('#game-title').text(newTitle)
  }

  const countries = getRandomCountries()
  const solutionIndex = Math.floor(Math.random() * countries.length)
  const solution = countries[solutionIndex]

  return ui
    .setQuestion(solution)
    .then(() => ui.setOptions(countries, solution))
    .then(() => ui.showGame())
    .then(() => {
      if (mixedMode) DATA.gameMode = 'mixed'
      app.preloader.hide()
    })
}

function getRandomCountries() {
  const countries = []
  const indices = []
  const count = DATA.optionsCount[DATA.gameMode]
  let index
  for (let i = 0; i < count; i++) {
    index = Math.floor(Math.random() * DATA.countries.length)
    if (!indices.includes(index)) {
      indices.push(index)
      countries.push(DATA.countries[index])
    } else i--
  }
  return countries
}

// load language, game mode and region from local storage
function loadSettings() {
  const language = localStorage.getItem('language') || 'en'
  const gameMode = localStorage.getItem('gameMode') || 'mixed'
  const region = localStorage.getItem('region') || 'world'

  DATA.language = language
  DATA.gameMode = gameMode
  DATA.region = region

  languageSelect.setValue(language)
  gameSelect.setValue(gameMode)
  regionSelect.setValue(region)
}

// save language, game mode and region to local storage
function saveSettings() {
  localStorage.setItem('language', DATA.language)
  localStorage.setItem('gameMode', DATA.gameMode)
  localStorage.setItem('region', DATA.region)
}

// process data coming from the api and set the country data for the app
function setCountryData(countries) {
  DATA.countries = countries.map(country => {
    country.translations.en = country.name
    country.name = country.translations
    delete country.translations

    // some countries do not have all translations, so I set them to the english name (11 is the normal amount of translations from the api)
    if (Object.keys(country.name).length < 11) {
      DATA.languages.forEach(language => {
        if (!country.name[language]) country.name[language] = country.name.en
      })
    }

    return country
  })
  // remove countries that have not all data (there are some that miss a capital)
  DATA.countries = DATA.countries.filter(country => country.capital !== '')
}
