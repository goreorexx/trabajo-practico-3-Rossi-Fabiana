//Se definen las constantes usando getelementbyid que toma ciertas partes del html mediante su id.
const loadingElement = document.getElementById('loading');
const container = document.getElementById('characters-container');

//Estas constantes se inicializan cuando el contenido de la página está cargado, para evitar conflictos y ahorrar memoria.
document.addEventListener('DOMContentLoaded', function() {
    const searchbar = document.getElementById('b-busc');
    const button = document.getElementById('botonbusq');
    const mensaje = document.getElementById('message');
    const resultados = document.getElementById('results-container');
});



//Se inicia la función asíncrona para tomar los personajes
async function getCharacters() {
    //Se inicia el intento de mostrar los personajes. Si Está cargando se muestra el texto de cargando personajes y
    //se limpian los contenedores.
    try {
        loadingElement.textContent = 'Cargando personajes...';
        container.innerHTML = '';
    //Se define la constante response que contiene los datos de la api de db.
        const response = await fetch('https://dragonball-api.com/api/characters');
    //si el response no es correcto o no se pudo realizar correctamente se crea un objeto de error con su descripción.
        if (!response.ok) {
            throw new Error('Error en la página.');
        }
    //Define la constante data que espera que el response sea true y convierte la información a un objeto js
        const data = await response.json();
    //Se elimina el contenido de cargando personajes ya que sí se pudo cargar el contenido.
        loadingElement.textContent = '';
    //Llama a la funcion displaycharacters para msotrar los personajes con sus datos.
        displayCharacters(data.items);
    //Si hubo un error se lo toma y lo muestra en consola; también advierte al usuario.
    } catch (error) {
        console.error('Error:', error);
        loadingElement.textContent = 'Error al cargar los personajes. Intenta recargar la página.';
    }
}

function displayCharacters(characters) {
    const container = document.getElementById('characters-container');
    container.innerHTML = '';
    
    characters.forEach(character => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3'; // Clases responsive
        
        col.innerHTML = `
            <div class="character-card card h-100">
                <img src="${character.image}" class="card-img-top" alt="${character.name}">
                <div class="card-body">
                    <h5 class="card-title">${character.name}</h5>
                    <p class="card-text">Raza: ${character.race || 'Desconocida'}</p>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Cargar los personajes cuando la página se cargue
document.addEventListener('DOMContentLoaded', getCharacters);

//Estas dos funciones sirven para mostrar mensajes abajo de la barra de búsqueda.
function showMessage(type, text) {
    //Se establece el contenido del texto messageElement con el valor text
    messageElement.textContent = text;
    //Se define la clase de messageelement con el mensaje ingresado y el tipo.
    messageElement.className = 'message ' + type;
    //muestra en pantalla el mensaje, como un display:block en css.
    messageElement.style.display = 'block';
}
//En la función para ocultar el mensaje, se le cambia el display a none para que no se muestre en pantalla.
function hideMessage() {
    messageElement.style.display = 'none';
}
            

//Se inicia la función asíncrona para buscar personajes.
async function searchCharacter() {
    //Se define la constante que toma lo que el usuario ingresó en la búsqueda y adicionalmente elimina los espacios con trim.
    const searchTerm = searchInput.value.trim();
    //Si no se ingresa un valor a la barra de búsqueda se imprime un mensaje de error.
    if (!searchTerm) {
        showMessage('error', 'Por favor ingresa un nombre de personaje');
        return;
    }

    try {
        //Se oculta el mensaje previo.
        hideMessage();
        //Se muestra un mensaje en el div con id resultsContainer
        resultsContainer.innerHTML = '<p>Buscando...</p>';
        //Determina que response es una constante que pide a la api un resultado con lo que el usuario ingresó en la barra de búsqueda.
        //Adicionalmente se le agrega el encodeURIcomponent para evitar problemas con caracteres especiales.
        const response = await fetch(`https://dragonball-api.com/api/characters?name=${encodeURIComponent(searchTerm)}`);
        //Si la respuesta no es true, se crea un nuevo error con un mensaje específico.
        if (!response.ok) {
            throw new Error('Error al consultar la API');
        }
        
        //Se define la constante data y espera a la constante de respuesta para transformar la inormación a un objeto .js
        const data = await response.json();
        //Si no se encuentran personajes con lo descrito en la búsqueda, se devuelve un mensaje en la pantalla.
        if (!data.items || data.items.length === 0) {
            showMessage('info', `No se encontraron resultados para "${searchTerm}"`);
            resultsContainer.innerHTML = '';
            return;
        }
        //Se muestran los resultados en pantalla.
        displayResults(data.items);
    //Si hubo algún error se lo nombra en consola y en la pantalla.
    } catch (error) {
        console.error('Error:', error);
        showMessage('error', 'Error al buscar los personajes. Intenta nuevamente.');
        resultsContainer.innerHTML = '';
    }
}

//Se inicializa la función para mostrar personajes.
function displayResults(characters) {
    //Se limpia el div de results container
    resultsContainer.innerHTML = '';
    //Se crea un div por cada personaje que sale en la búsqueda.
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
        ${character.image ? `<img src="${character.image}" alt="${character.name}" class="character-image">` : ''}
        <h2 class="character-name">${character.name}</h2>
        <p><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
        <p><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
        `;
        
        resultsContainer.appendChild(card);
    });
}

//Si se apreta el botón para buscar al personaje o se aprieta la tecla enter, también se inicializa la función de buscar personaje.1
searchButton.addEventListener('click', searchCharacter);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchCharacter();
    }
});