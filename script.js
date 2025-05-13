// script.js COMPLETO E CORRIGIDO

// Referências aos elementos
const inputGenero = document.getElementById('genre-input');
const divArtistas = document.getElementById('artist-inputs');
const divResposta = document.getElementById('response');
const btnGerarPlaylist = document.getElementById('generate-playlist-btn');
const btnLimparCampos = document.getElementById('clear-fields-btn');
const btnAdicionarArtista = document.getElementById('add-artist-btn');


/**
 * @function atualizarBotoesRemoverArtistas
 * @description Habilita ou desabilita os botões de remoção de artistas.
 * Garante que haja sempre pelo menos 1 campo de artista.
 */
function atualizarBotoesRemoverArtistas() {
    const botoesRemover = divArtistas.querySelectorAll('.artist-row .btn-danger');
    const linhasArtista = divArtistas.querySelectorAll('.artist-row');
    const contadorLinhas = linhasArtista.length;

    botoesRemover.forEach(botao => {
        botao.disabled = contadorLinhas <= 1; // Mínimo de 1 artista
    });
}

/**
 * @function adicionarArtista
 * @description Cria e adiciona um novo campo para artista.
 */
function adicionarArtista() {
    const linhaArtistaDiv = document.createElement('div');
    // Classes do HTML para consistência visual
    linhaArtistaDiv.className = 'artist-row flex items-center space-x-3';

    const novoInput = document.createElement('input');
    novoInput.type = 'text';
    // Classes do HTML para consistência visual
    novoInput.className = 'artist-input flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-500 transition-colors';
    novoInput.placeholder = 'Nome do artista';

    const botaoRemover = document.createElement('button');
    // Classes do HTML para consistência visual
    botaoRemover.className = 'btn-danger bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed';
    botaoRemover.innerText = 'Excluir';
    botaoRemover.addEventListener('click', () => removerArtista(botaoRemover));

    linhaArtistaDiv.appendChild(novoInput);
    linhaArtistaDiv.appendChild(botaoRemover);
    divArtistas.appendChild(linhaArtistaDiv);

    atualizarBotoesRemoverArtistas();
}

/**
 * @function removerArtista
 * @description Remove a linha do artista.
 * @param {HTMLButtonElement} botao - O botão "Excluir" que acionou a remoção.
 */
function removerArtista(botao) {
    const linhaArtista = botao.parentElement;
    if (linhaArtista) {
        linhaArtista.remove();
    }
    atualizarBotoesRemoverArtistas();
}

/**
 * @function limparTodosOsCampos
 * @description Limpa o campo de gênero e todos os campos de artista.
 */
function limparTodosOsCampos() {
    inputGenero.value = '';
    const inputsArtista = divArtistas.querySelectorAll('.artist-row .artist-input');
    inputsArtista.forEach(input => {
        input.value = '';
    });
    // Opcional: Resetar para 1 campo de artista se desejar, ou manter os campos.
    // Por agora, apenas limpa. Se quiser remover até sobrar 1:
    // while (divArtistas.children.length > 1) {
    //     divArtistas.removeChild(divArtistas.lastChild);
    // }
    // atualizarBotoesRemoverArtistas(); // Se remover campos
    console.log('[limparTodosOsCampos] Campos limpos.');
    // Esconde a div de resposta também
    divResposta.classList.add('hidden');
    // Reseta o placeholder da div de resposta
    divResposta.innerHTML = `
        <div class="flex justify-center items-center h-full">
            <p class="text-gray-400 italic">Aguardando a mágica acontecer...</p>
        </div>
    `;
    divResposta.classList.add('flex', 'items-center', 'justify-center');
}


/**
 * @function renderizarPlaylist
 * @description Constrói o HTML da playlist e o exibe com o novo design.
 * @param {object} dadosPlaylist - Objeto JSON da playlist.
 */
function renderizarPlaylist(dadosPlaylist) {
    divResposta.classList.remove('items-center', 'justify-center', 'flex'); // Remove classes de centralização do placeholder

    if (!dadosPlaylist) {
        divResposta.innerHTML = `
            <div class="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                <h3 class="text-lg font-semibold text-red-400 mb-2">Oops! Algo deu errado</h3>
                <p class="text-red-300">Não foi possível obter dados da playlist. Tente novamente.</p>
            </div>`;
        divResposta.classList.remove('hidden');
        return;
    }

    if (dadosPlaylist.aviso_conteudo && (!dadosPlaylist.musicas || dadosPlaylist.musicas.length === 0)) {
        divResposta.innerHTML = `
            <div class="p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg">
                <h3 class="text-lg font-semibold text-yellow-400 mb-2">Aviso da IA</h3>
                <p class="text-yellow-300">${dadosPlaylist.aviso_conteudo}</p>
            </div>`;
        divResposta.classList.remove('hidden');
        return;
    }
    
    if (!dadosPlaylist.titulo_playlist || !Array.isArray(dadosPlaylist.musicas)) {
        console.error("Erro ao renderizar: Dados da playlist no formato inesperado.", dadosPlaylist);
        divResposta.innerHTML = `
            <div class="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                <h3 class="text-lg font-semibold text-red-400 mb-2">Erro Interno</h3>
                <p class="text-red-300">Erro ao processar os dados da playlist recebida.</p>
            </div>`;
        divResposta.classList.remove('hidden');
        return;
    }

    let htmlPlaylist = `
        <div class="mb-6">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-2">${dadosPlaylist.titulo_playlist}</h2>
            ${dadosPlaylist.descricao_playlist ? `<p class="text-md text-gray-400 italic">"${dadosPlaylist.descricao_playlist}"</p>` : ''}
        </div>
    `;

    if (dadosPlaylist.musicas && dadosPlaylist.musicas.length > 0) {
        htmlPlaylist += `<h3 class="text-xl font-semibold text-gray-200 mb-4">Músicas:</h3>
                         <ul class="space-y-3">`;
        dadosPlaylist.musicas.forEach((musica, index) => {
            htmlPlaylist += `
                <li class="flex items-center justify-between p-3 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-colors duration-200">
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-indigo-400 mr-3 w-6 text-center">${index + 1}.</span>
                        <div>
                            <strong class="block text-gray-100 text-md">${musica.titulo_musica}</strong>
                            <span class="text-xs text-gray-400">${musica.artista_musica}</span>
                        </div>
                    </div>
                </li>`;
        });
        htmlPlaylist += `</ul>`;
    } else if (!dadosPlaylist.aviso_conteudo) {
        htmlPlaylist += `<p class="text-gray-400">Nenhuma música sugerida para esta playlist.</p>`;
    }
    
    if (dadosPlaylist.aviso_conteudo && dadosPlaylist.musicas && dadosPlaylist.musicas.length > 0) {
        htmlPlaylist += `
            <div class="mt-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg">
                <h3 class="text-md font-semibold text-yellow-400 mb-1">Aviso Adicional:</h3>
                <p class="text-sm text-yellow-300">${dadosPlaylist.aviso_conteudo}</p>
            </div>
        `;
    }

    divResposta.innerHTML = htmlPlaylist;
    divResposta.classList.remove('hidden');
}


/**
 * @function enviarFormularioPlaylist
 * @description Coleta gênero e artistas, envia para API e renderiza a playlist.
 */
async function enviarFormularioPlaylist() {
    console.log('[enviarFormularioPlaylist] Processando...');

    btnGerarPlaylist.disabled = true;
    btnGerarPlaylist.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Gerando sua vibe...
    `;
    
    divResposta.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full py-8">
            <svg class="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-400 text-lg">Criando sua playlist perfeita...</p>
            <p class="text-sm text-gray-500">Isso pode levar alguns segundos.</p>
        </div>
    `;
    divResposta.classList.remove('hidden');
    divResposta.classList.add('flex', 'items-center', 'justify-center');


    const genero = inputGenero.value.trim();
    const inputsArtistaNodes = divArtistas.querySelectorAll('.artist-row .artist-input');
    const artistas = [];
    inputsArtistaNodes.forEach(input => {
        const valor = input.value.trim();
        if (valor) {
            artistas.push(valor);
        }
    });

    if (!genero) {
        alert('Por favor, informe o gênero musical!');
        divResposta.classList.add('hidden');
        // Reseta o placeholder da div de resposta
        divResposta.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <p class="text-gray-400 italic">Aguardando a mágica acontecer...</p>
            </div>
        `;
        btnGerarPlaylist.disabled = false;
        btnGerarPlaylist.innerHTML = 'Gerar Minha Playlist ✨';
        return;
    }
    if (artistas.length < 1) {
        alert('Por favor, informe pelo menos um artista!');
        divResposta.classList.add('hidden');
        // Reseta o placeholder da div de resposta
        divResposta.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <p class="text-gray-400 italic">Aguardando a mágica acontecer...</p>
            </div>
        `;
        btnGerarPlaylist.disabled = false;
        btnGerarPlaylist.innerHTML = 'Gerar Minha Playlist ✨';
        return;
    }

    const dadosParaAPI = {
        genero: genero,
        artistas: artistas
    };

    console.log('[enviarFormularioPlaylist] Dados para API:', dadosParaAPI);

    try {
        const respostaAPI = await fetch('https://back-end-api-gemini.vercel.app/playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaAPI)
        });

        const resultadoJSON = await respostaAPI.json();
        console.log('[enviarFormularioPlaylist] Resposta JSON:', resultadoJSON);

        if (!respostaAPI.ok) {
            const errorMsg = resultadoJSON.error || `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`;
            console.error('[enviarFormularioPlaylist] API retornou erro:', errorMsg);
            // Atualiza divResposta para mostrar erro vindo da API de forma estilizada
            divResposta.innerHTML = `
                <div class="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                    <h3 class="text-lg font-semibold text-red-400 mb-2">Erro da API</h3>
                    <p class="text-red-300">${errorMsg}</p>
                </div>`;
            divResposta.classList.remove('flex', 'items-center', 'justify-center'); // Remove centralização
        } else {
            renderizarPlaylist(resultadoJSON);
        }

    } catch (error) {
        console.error('[enviarFormularioPlaylist] Erro no Fetch ou parsing JSON:', error);
        divResposta.innerHTML = `
            <div class="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                <h3 class="text-lg font-semibold text-red-400 mb-2">Erro de Comunicação</h3>
                <p class="text-red-300">Ocorreu um erro ao comunicar com o servidor: ${error.message}</p>
            </div>`;
        divResposta.classList.remove('flex', 'items-center', 'justify-center'); // Remove centralização
    } finally {
        btnGerarPlaylist.disabled = false;
        btnGerarPlaylist.innerHTML = 'Gerar Minha Playlist ✨';
        console.log('[enviarFormularioPlaylist] Finalizado.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Playlist Generator carregado.');

    // Verifica se os botões existem antes de adicionar listeners
    if (btnAdicionarArtista) {
        btnAdicionarArtista.addEventListener('click', adicionarArtista);
    } else {
        console.error('Botão "add-artist-btn" não encontrado.');
    }

    if (btnGerarPlaylist) {
        btnGerarPlaylist.addEventListener('click', enviarFormularioPlaylist);
    } else {
        console.error('Botão "generate-playlist-btn" não encontrado.');
    }
    
    if (btnLimparCampos) {
        btnLimparCampos.addEventListener('click', limparTodosOsCampos);
    } else {
        console.error('Botão "clear-fields-btn" não encontrado.');
    }

    const botoesRemoverIniciais = divArtistas.querySelectorAll('.artist-row .btn-danger');
    botoesRemoverIniciais.forEach(botao => {
        botao.addEventListener('click', () => removerArtista(botao));
    });

    atualizarBotoesRemoverArtistas();
});