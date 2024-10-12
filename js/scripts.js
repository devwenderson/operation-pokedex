let currentPokemon = 650; // Início da 6ª geração

async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await response.json();

        // Aplica fade out antes de atualizar
        const pokemonInfo = document.getElementById('pokemon-info');
        pokemonInfo.classList.remove('show');
        pokemonInfo.classList.add('fade');

        setTimeout(() => {
            // Atualizando informações na Pokédex
            document.getElementById('name').innerText = `Nome: ${capitalize(pokemonData.name)}`;
            document.getElementById('national-dex').innerText = `Número: ${pokemonData.id}`;
            document.getElementById('sprite').src = pokemonData.sprites.front_default;
            document.getElementById('type').innerText = `Tipo: ${pokemonData.types.map(type => capitalize(type.type.name)).join(', ')}`;
            document.getElementById('ability').innerText = `Habilidade: ${capitalize(pokemonData.abilities[0].ability.name)}`;
            
            // Guardando o link do choro
            const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonData.name}.mp3`;
            document.getElementById('cry').dataset.cryUrl = cryUrl;

            // Aplica fade in após atualizar
            pokemonInfo.classList.remove('fade');
            pokemonInfo.classList.add('show');
        }, 500);
        
    } catch (error) {
        console.error('Erro ao buscar dados do Pokémon:', error);
    }
}

function playCry() {
    const cryUrl = document.getElementById('cry').dataset.cryUrl;
    const audio = new Audio(cryUrl);
    audio.play();
}

function previousPokemon() {
    if (currentPokemon > 650) {
        currentPokemon--;
        fetchPokemonData(currentPokemon);
    }
}

function nextPokemon() {
    if (currentPokemon < 721) {
        currentPokemon++;
        fetchPokemonData(currentPokemon);
    }
}

function goToPokemon() {
    const searchNumber = document.getElementById('searchNumber').value;
    if (searchNumber >= 650 && searchNumber <= 721) {
        currentPokemon = searchNumber;
        fetchPokemonData(currentPokemon);
    } else {
        alert("Digite um número entre 650 e 721.");
    }
}

async function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
        const pokemonData = await response.json();
        if (pokemonData.id >= 650 && pokemonData.id <= 721) {
            currentPokemon = pokemonData.id;
            fetchPokemonData(currentPokemon);
        } else {
            alert('Este Pokémon não pertence à 6ª Geração.');
        }
    } catch (error) {
        alert('Pokémon não encontrado.');
    }
}

// Capitaliza a primeira letra do nome
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Carrega o primeiro Pokémon ao iniciar a página
window.onload = () => {
    fetchPokemonData(currentPokemon);
};
