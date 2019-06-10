const $$ = Dom7

const app = new Framework7({
  root: '#app',
  name: 'What The Flag',
  id: 'com.nicograef.wtf',
  version: '4.0.0',
  smartSelect: {
    closeOnSelect: true
  },
  data: {
    countries: [],
    language: 'en',
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
    waitingTime: 1000
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

loadSettings()

// In page events:
$$(document).on('page:init', function(e, page) {
  if (page.name === 'game') initGame()
})

$$('#play').on('click', () => {
  app.data.language = languageSelect.getValue()
  app.data.gameMode = gameSelect.getValue()
  app.data.region = regionSelect.getValue()

  saveSettings()

  const region = app.data.region === 'world' ? 'all' : 'region/' + app.data.region
  fetch(`https://restcountries.eu/rest/v2/${region}?fields=name;flag;capital;translations`)
    .then(res => res.json())
    .then(countries => {
      app.data.countries = countries.map(country => {
        country.translations.en = country.name
        country.name = country.translations
        delete country.translations
        return country
      })
    })
    .then(() => mainView.router.navigate('/game/'))
})

function initGame() {
  const newTitle = app.data.gameMode
    .split('-')
    .join(' ')
    .toUpperCase()
  $$('#game-title').text(newTitle)

  ui = new UI()
  ui.options.addEventListener('click', e => {
    if (e.target.nodeName !== 'BUTTON') return
    ui.showSolution(e.target)
    clearTimeout(nextQuestionTimeout)
    nextQuestionTimeout = setTimeout(nextQuestion, app.data.waitingTime)
  })

  nextQuestion()
}

function nextQuestion() {
  let mixedMode
  if (app.data.gameMode === 'mixed') {
    mixedMode = true
    app.data.gameMode = app.data.gameModes[Math.floor(Math.random() * app.data.gameModes.length)]
    const newTitle = app.data.gameMode
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
    .then(() => ui.showOptions(countries, solution))
    .then(() => ui.showGame())
    .then(() => {
      if (mixedMode) app.data.gameMode = 'mixed'
    })
}

function getRandomCountries() {
  const countries = []
  const indices = []
  const count = app.data.optionsCount[app.data.gameMode]
  let index
  for (let i = 0; i < count; i++) {
    index = Math.floor(Math.random() * app.data.countries.length)
    if (!indices.includes(index)) {
      indices.push(index)
      countries.push(app.data.countries[index])
    } else i--
  }
  return countries
}

function loadSettings() {
  const language = localStorage.getItem('language') || 'en'
  const gameMode = localStorage.getItem('gameMode') || 'mixed'
  const region = localStorage.getItem('region') || 'world'

  console.log(language, gameMode, region)

  app.data.language = language
  app.data.gameMode = gameMode
  app.data.region = region

  languageSelect.setValue(language)
  gameSelect.setValue(gameMode)
  regionSelect.setValue(region)
}

function saveSettings() {
  localStorage.setItem('language', app.data.language)
  localStorage.setItem('gameMode', app.data.gameMode)
  localStorage.setItem('region', app.data.region)
}
