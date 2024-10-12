let currentPokemon = 1; // Início

async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await response.json();

        // Cálculo da média de status
        const stats = pokemonData.stats;
        const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const averageStats = (totalStats / stats.length).toFixed(2); // Média com duas casas decimais

        // Aplica fade out antes de atualizar
        const pokemonInfo = document.getElementById('pokemon-info');
        pokemonInfo.classList.remove('show');
        pokemonInfo.classList.add('fade');

        setTimeout(() => {
            // Atualizando informações na Pokédex
            document.getElementById('name').innerText = `Nome: ${capitalize(pokemonData.name)}`;
            document.getElementById('national-dex').innerText = `Número: ${pokemonData.id}`;
            document.getElementById('sprite').src = pokemonData.sprites.front_default;
            document.getElementById('sprite-back').src = pokemonData.sprites.back_default; // Adicione esta linha
            document.getElementById('type').innerText = `Tipo: ${pokemonData.types.map(type => capitalize(type.type.name)).join(', ')}`;
            document.getElementById('ability').innerText = `Habilidade: ${capitalize(pokemonData.abilities[0].ability.name)}`;
            document.getElementById('average-status').innerText = `Média de Status: ${averageStats}`; // Atualiza a média

            // Limpa os spans de tipos anteriores
            const typeContainer = document.getElementById('type');
            typeContainer.innerHTML = ''; 
            
            // Adiciona cada tipo com um span colorido
            pokemonData.types.forEach(type => {
                const typeSpan = document.createElement('span');
                typeSpan.classList.add('type', `type-${type.type.name}`);
                typeSpan.innerText = capitalize(type.type.name);
                typeContainer.appendChild(typeSpan);
            });

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
    if (currentPokemon > 1) {
        currentPokemon--;
        fetchPokemonData(currentPokemon);
    }
}

function nextPokemon() {
    if (currentPokemon < 1025) {
        currentPokemon++;
        fetchPokemonData(currentPokemon);
    }
}

function goToPokemon() {
    const searchNumber = document.getElementById('searchNumber').value;
    if (searchNumber >= 1 && searchNumber <= 1025) {
        currentPokemon = searchNumber;
        fetchPokemonData(currentPokemon);
    } else {
        alert("Digite um número entre 1 e 1025.");
    }
}

async function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
        const pokemonData = await response.json();
        if (pokemonData.id >= 1 && pokemonData.id <= 1025) {
            currentPokemon = pokemonData.id;
            fetchPokemonData(currentPokemon);
        } else {
            alert('Este Pokémon não existe.');
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

    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchPokemon(); // Chama a função de pesquisa
        }
    })
}