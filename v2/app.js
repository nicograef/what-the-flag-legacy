const flag = document.getElementById('flag')
const loader = document.getElementById('loader')
const optionsDiv = document.getElementById('options')
const languagesDiv = document.getElementById('languages')

// Time to guess the answer in seconds
const waitingTime = 2

// how many possible answers
const optionsCount = 4

// click does not work on ios
const clickOrTouch = navigator.userAgent.match(/iPhone|iPad/i) ? 'touchstart' : 'click'

let flagTimeout
let data
let language

fetch('https://restcountries.eu/rest/v2/all?fields=name;flag;translations')
  .then(res => res.json())
  .then(jsonData => (data = jsonData))
  .then(init)

function init() {
  optionsDiv.addEventListener(clickOrTouch, e => {
    if (e.target.nodeName !== 'BUTTON') return
    resolve(e.target)
    clearTimeout(flagTimeout)
    flagTimeout = setTimeout(newFlag, waitingTime * 1000)
  })

  languagesDiv.addEventListener(clickOrTouch, e => {
    if (e.target.nodeName !== 'BUTTON') return
    language = e.target.id
    newFlag().then(() => {
      loader.style.display = 'none'
      flag.style.display = 'block'
      options.style.display = 'flex'
    })
    goFullScreen()
    languagesDiv.style.display = 'none'
    loader.style.display = 'block'
  })
  loader.style.display = 'none'
  languagesDiv.style.display = 'flex'
}

function newFlag() {
  const countries = getRandomCountries(data, optionsCount)
  const solutionIndex = Math.floor(Math.random() * optionsCount)
  const solution = countries[solutionIndex]
  return showFlag(solution.flag).then(() => showOptions(countries, solution))
}

function showOptions(options, solution) {
  optionsDiv.innerHTML = ''
  options.forEach(option => {
    const btn = document.createElement('button')
    btn.textContent = language === 'en' ? option.name : option.translations[language]
    if (option.name === solution.name) btn.className = 'solution'
    optionsDiv.appendChild(btn)
  })
}

function getRandomCountries(data, count) {
  const countries = []
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * data.length)
    countries.push(data[index])
  }
  return countries
}

function showFlag(src) {
  return new Promise((resolve, reject) => {
    flag.onload = () => resolve()
    flag.src = src
  })
}

function resolve(clicked) {
  document.querySelector('.solution').style.border = '5px solid #4ca64c'
  if (clicked.className !== 'solution') clicked.style.border = '5px solid #a64c4c'
}

function goFullScreen() {
  var doc = window.document
  var docEl = doc.documentElement
  var requestFullScreen =
    docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
  requestFullScreen.call(docEl)
}
