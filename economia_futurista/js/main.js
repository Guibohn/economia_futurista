// Define o caminho para o arquivo JSON. O CORREÇÃO original já foi aplicada.
const articlesDB = './articles.json';

// Define as cores da categoria fora da função para evitar recriação desnecessária em cada chamada.
const categoryColors = {
    'ANÁLISE ECONÔMICA': 'pink',
    'O OLHAR DO ESPECIALISTA': 'purple',
    'RADAR DE MACRO TENDÊNCIAS': 'emerald',
    'GIRO DE MERCADO': 'indigo',
    'RADAR SEMANAL': 'amber',
};

// Função para gerar o HTML de um card de artigo
function createArticleCard(article) {
    const color = categoryColors[article.category.toUpperCase()] || 'gray';

    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover transition-all duration-300 flex flex-col">
            <a href="artigo.html?id=${article.id}" class="block">
                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
            </a>
            <div class="p-6 flex flex-col flex-grow">
                <span class="text-xs text-${color}-600 font-semibold bg-${color}-100 px-2 py-1 rounded-full self-start">${article.category}</span>
                <h3 class="text-xl font-bold my-2 text-gray-800 flex-grow">${article.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${article.summary}</p>
                <a href="artigo.html?id=${article.id}" class="text-${color}-600 hover:text-${color}-800 font-semibold mt-auto">Leia a análise completa &rarr;</a>
            </div>
        </div>
    `;
}

// Função para carregar os artigos na página inicial e na página de artigos
async function loadArticleLists() {
    const latestArticlesContainer = document.getElementById('latest-articles-container');
    const allArticlesContainer = document.getElementById('all-articles-container');

    // Mostra mensagens de carregamento para uma melhor experiência do usuário
    if (latestArticlesContainer) {
        latestArticlesContainer.innerHTML = '<p class="text-center text-gray-500">Carregando últimos artigos...</p>';
    }
    if (allArticlesContainer) {
        allArticlesContainer.innerHTML = '<p class="text-center text-gray-500">Carregando todos os artigos...</p>';
    }

    try {
        const response = await fetch(articlesDB);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const articles = await response.json();

        // Carrega os 3 artigos mais recentes na página inicial
        if (latestArticlesContainer) {
            latestArticlesContainer.innerHTML = articles.slice(0, 3).map(createArticleCard).join('');
        }

        // Carrega TODOS os artigos na página de artigos
        if (allArticlesContainer) {
            allArticlesContainer.innerHTML = articles.map(createArticleCard).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar a lista de artigos:', error);
        // Seleciona o container relevante para exibir a mensagem de erro
        const container = latestArticlesContainer || allArticlesContainer;
        if (container) {
            container.innerHTML = '<p class="text-center text-red-500">Ocorreu um erro ao carregar os artigos. Verifique o console para mais detalhes.</p>';
        }
    }
}

// Função para carregar um único artigo na página de artigo
async function loadSingleArticle() {
    const articleContent = document.getElementById('article-full-content');
    if (!articleContent) return;

    // Mostra uma mensagem de carregamento para uma melhor experiência do usuário
    articleContent.innerHTML = '<p class="text-center text-gray-500">Carregando artigo...</p>';

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        // CORREÇÃO: Trata o caso de não haver ID na URL de forma mais graciosa.
        if (!articleId) {
            articleContent.innerHTML = '<p class="text-center text-orange-500">Nenhum artigo especificado. <a href="index.html" class="underline">Voltar para a página inicial</a>.</p>';
            return;
        }

        const response = await fetch(articlesDB);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const articles = await response.json();

        const article = articles.find(a => a.id === articleId);
        if (!article) {
            // CORREÇÃO: Mensagem mais clara quando o artigo não é encontrado.
            articleContent.innerHTML = `<p class="text-center text-red-500">Artigo com ID "${articleId}" não foi encontrado. <a href="index.html" class="underline">Voltar para a página inicial</a>.</p>`;
            return;
        }

        document.title = `${article.title} - Economia Futurista`; // Atualiza o título da aba do navegador

        // Formata a data para exibição mais amigável
        const formattedDate = new Date(article.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

        articleContent.innerHTML = `
            <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-4">${article.title}</h1>
            <p class="text-gray-500 text-sm mb-6">Publicado em ${formattedDate} | Categoria: ${article.category}</p>
            <img src="${article.image}" alt="${article.title}" class="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md">
            
            <div class="prose max-w-none text-gray-700 leading-relaxed">
                ${article.content}
            </div>
            
            <hr class="my-8 border-gray-300">
            <div class="text-center">
                <a href="artigos.html" class="text-indigo-600 hover:text-indigo-800 font-semibold">&larr; Voltar para todos os artigos</a>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar o artigo:', error);
        articleContent.innerHTML = `<p class="text-center text-red-500">Ocorreu um erro ao carregar o artigo. Verifique o console para mais detalhes.</p>`;
    }
}