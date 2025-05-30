//Se definen las constantes usando getelementbyid que toma ciertas partes del html mediante su id.
const loadingElement = document.getElementById('loading');
const container = document.getElementById('characters-container');

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

//Se inicia la función para mostrar los personajes.
function displayCharacters(characters) {
    //Crea una constante que contiene un div la cual resguarda la base donde irían los datos de los personajes.
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        //si no contiene cierto dato, se usa el || para darle otro valor, en este caso, "desconocido/a".
        card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="character-image">
        <h2 class="character-name">${character.name}</h2>
        <p class="character-info"><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
        <p class="character-info"><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
        <p class="character-info"><strong>Ki:</strong> ${character.ki || 'Desconocido'}</p>
        <p class="character-info"><strong>Afiliación:</strong> ${character.affiliation || 'Desconocida'}</p>
        `;
        
        container.appendChild(card);
    });
}

// Cargar los personajes cuando la página se cargue
document.addEventListener('DOMContentLoaded', getCharacters);