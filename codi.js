let mensaje = document.getElementById("mensaje");
let duracionTotal = 5 * 60;
let contador = document.getElementById('contador');

function actualizarContador(tiempoRestante) {
  var minutos = Math.floor(tiempoRestante / 60);
  var segundos = tiempoRestante % 60;
  contador.innerHTML = minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
}

let intervalo = setInterval(() => {
  duracionTotal--;
  actualizarContador(duracionTotal);

  if (duracionTotal <= 0) {
    clearInterval(intervalo);
    mensaje.style.display = "block";
    mensaje.innerHTML = `
        <h2>¡Oh No! ¡El Team Rocket se te ha adelantado!</h2>
        <img src="./imagenes/team_rocket.gif" width="350px">
        <br>
        <button onclick=reiniciar()>Jugar de nuevo</button>
        `;

  }
}, 1000);

const wordsByDifficulty = {
  easy: ['pikachu', 'piplup', 'meowth', 'snorlax', 'cubone'],
  medium: ['bulbasaur', 'magikarp', 'dratini', 'machamp', 'kadabra', 'rattata'],
  hard: ['charmander', 'squirtle', 'charizard', 'jigglypuff', 'dragonite', 'gyarados', 'vaporeon']
};

const imagesByWord = {
  pikachu: 'pikachu.gif',
  piplup: 'piplup.gif',
  meowth: 'meowth.gif',
  snorlax: 'snorlax.gif',
  cubone: 'cubone.gif',
  bulbasaur: 'bulbasaur.gif',
  magikarp: 'magikarp.gif',
  dratini: 'dratini.gif',
  machamp: 'machamp.gif',
  kadabra: 'kadabra.gif',
  rattata: 'rattata.gif',
  charmander: 'charmander.gif',
  squirtle: 'squirtle.gif',
  charizard: 'charizard.gif',
  jigglypuff: 'jigglypuff.gif',
  dragonite: 'dragonite.gif',
  gyarados: 'gyarados.gif',
  vaporeon: 'vaporeon.gif',
};
let selectedLetters = [];
function clearWord() {
  let selectedCells = document.querySelectorAll(".letras-seleccionadas");
  selectedCells.forEach(function(element) {
    element.classList.remove("letras-seleccionadas");
  });
  selectedLetters = [];
}

let currentWordList = [];
let currentDifficulty = 'easy';
generateWordSearch();
function generateWordSearch() {
  duracionTotal = 5 * 60;
  currentDifficulty = document.getElementById('difficulty').value;
  currentWordList = wordsByDifficulty[currentDifficulty];
 
  if (!localStorage.getItem("record-easy")) {
    localStorage.setItem("record-easy", "-");
  } else if (!localStorage.getItem("record-medium")) {
    localStorage.setItem("record-medium", "-");
  } else if (!localStorage.getItem("record-hard")) {
    localStorage.setItem("record-hard", "-");
  }

  let textRecord = document.getElementById('record');
  if (currentDifficulty == "easy") {
    textRecord.textContent = localStorage.getItem("record-easy");
  } else if (currentDifficulty == "medium") {
    textRecord.textContent = localStorage.getItem("record-medium");
  } else if (currentDifficulty == "hard") {
    textRecord.textContent = localStorage.getItem("record-hard");
  }
 
  
  const wordSearch = document.getElementById('word-search');
  const wordList = document.getElementById('word-list');

  // Limpiar tablero y lista de palabras
  wordSearch.innerHTML = '';
  wordList.innerHTML = '';

  if (currentDifficulty == "easy" || currentDifficulty == "medium") {
    wordList.innerHTML = "<br>";
  }

  // Obtener sopa de letras y lista de palabras
  const { puzzle, placedWords } = generatePuzzle(currentWordList);
  
  // Crear tabla de sopa de letras
  for (let row of puzzle) {
    const tr = document.createElement('tr');
    for (let cell of row) {
      const td = document.createElement('td');
      td.textContent = cell;
      td.id = cell;
      td.onclick = () => onClickCell(td);
      tr.appendChild(td);
    }
    wordSearch.appendChild(tr);
  }

  // Crear lista de palabras y agregar imágenes
  for (let word of placedWords) {
    const listItem = document.createElement('div');
    listItem.innerHTML = `<img src="imagenes/${word}.gif" alt="${word}"> <span id="${word}">${word}</span>`;
    wordList.appendChild(listItem);
  }
}

function generatePuzzle(words) {
  const puzzleSize = 15;
  const directions = [
    { x: 1, y: 0 },  // Horizontal
    { x: 0, y: 1 },  // Vertical
    { x: 1, y: 1 },  // Diagonal hacia abajo-derecha
    { x: 1, y: -1 }   // Diagonal hacia arriba-derecha
  ];

  let puzzle = Array.from({ length: puzzleSize }, () => Array(puzzleSize).fill(''));
  let placedWords = [];

  for (let word of words) {
    // Elegir una dirección aleatoria
    const direction = directions[Math.floor(Math.random() * directions.length)];
    let wordPlaced = false;

    // Intentar colocar la palabra en posiciones aleatorias hasta que encontremos una válida
    while (!wordPlaced) {
      const startX = Math.floor(Math.random() * puzzleSize);
      const startY = Math.floor(Math.random() * puzzleSize);

      // Intentar colocar la palabra en la sopa de letras
      const { newPuzzle, success } = tryPlaceWord(puzzle, word, startX, startY, direction);

      if (success) {
        puzzle = newPuzzle;
        placedWords.push(word);
        wordPlaced = true;
      }
    }
  }

  // Rellenar espacios vacíos con letras aleatorias
  for (let i = 0; i < puzzleSize; i++) {
    for (let j = 0; j < puzzleSize; j++) {
      if (puzzle[i][j] === '') {
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        puzzle[i][j] = randomLetter;
      }
    }
  }

  return { puzzle, placedWords };
}

function tryPlaceWord(puzzle, word, startX, startY, direction) {
  const puzzleSize = puzzle.length;
  const wordLength = word.length;
  let success = true;

  const newPuzzle = puzzle.map(row => row.slice());

  // Verificar si la palabra se ajusta en la dirección dada
  for (let i = 0; i < wordLength; i++) {
    const newX = startX + i * direction.x;
    const newY = startY + i * direction.y;

    // Verificar si la posición está dentro de la sopa de letras
    if (newX < 0 || newX >= puzzleSize || newY < 0 || newY >= puzzleSize) {
      success = false;
      break;
    }

    // Verificar si la posición está vacía o contiene la misma letra que la palabra
    if (newPuzzle[newX][newY] === '' || newPuzzle[newX][newY] === word[i]) {
      newPuzzle[newX][newY] = word[i];
    } else {
      success = false;
      break;
    }
  }

  return { newPuzzle, success };
}

function onClickCell(td) {
  selectedLetters.push(td.textContent);
  td.classList.add("letras-seleccionadas");
}

function tiempo(hora) {
  let partesHora = hora.split(":");
  let horas = parseInt(partesHora[0], 10);
  let minutos = parseInt(partesHora[1], 10);
  return horas * 60 * 60 * 1000 + minutos * 60 * 1000;
}

let record = localStorage.getItem("record-" + currentDifficulty);
function verifyWord() {
  let selectedWord = selectedLetters.join('');
  let selectedCells = document.querySelectorAll(".letras-seleccionadas");
  let textRecord = document.getElementById('record');

  selectedCells.forEach(function(element) {
    if (currentWordList.includes(selectedWord)) {
      element.classList.add("palabra-correcta");
      document.getElementById(selectedWord).classList.add("palabra-correcta");
      mensaje.style.display = "block";
      if (verificarClaseEnLabels("palabra-correcta") == true) {
        clearInterval(intervalo);
  
        if (textRecord.textContent == "-" ) {
          localStorage.setItem("record-" + currentDifficulty, contador.innerText);
        } else {
          let tiempoContador = tiempo(contador.innerText);
          let tiempoRecord = tiempo(record);
          if (tiempoContador > tiempoRecord) {
            localStorage.setItem("record-" + currentDifficulty, contador.innerText);
          }
        }

        mensaje.innerHTML = `
        <h2>¡Lo has conseguido!<br>¡Has llenado la pokedex!<br>¡El Team Rocket despega de nuevo!</h2>
        <img src="./imagenes/team_rocket_perder.gif" width="350px">
        <br>
        <button onclick=reiniciar()>Jugar de nuevo</button>
        `;
      } else {
        mensaje.innerHTML = `
        <h2>¡Pokémon capturado!</h2>
        <img src="./imagenes/pokemon-capturado.gif" width="250px">
        `;
        setTimeout(() => mensaje.style.display = "none", 2000);
      }
    }
    element.classList.remove("letras-seleccionadas");
  }); 
  selectedLetters = [];
}

function verificarClaseEnLabels(clase) {
  let listaPokemons = document.getElementsByTagName("span");

  for (var i = 0; i < currentWordList.length; i++) {
    if (!listaPokemons[i].classList.contains(clase)) {
      return false;
    }
  }

  return true;
}

function pista() {
  const puzzle = document.getElementById('word-search');
  const cells = puzzle.getElementsByTagName('td');
  const pokemons = document.getElementsByTagName("span");
  let word = "";
  for (let i = 0; i < currentWordList.length; i++) {
    if (!pokemons[i].classList.contains("palabra-correcta")) {
      word = pokemons[i].id[0];
      break;
    }
  }
  
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.id == word && !cell.classList.contains('palabra-correcta')) {
      cell.classList.add('pista');
      break;
    }
  }
}

function reiniciar(params) {
  window.location.reload();
}