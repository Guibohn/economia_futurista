
    const articlesDB = './articles.json';

    function createArticleCard(article) {
        const categoryColors = {
            'ANÁLISE DE ECONOMISTAS': 'purple',
            'ANÁLISE TÉCNICA': 'blue',
            'ANÁLISE FUNDAMENTALISTA': 'teal',
            'GIRO DE MERCADO': 'indigo',
            'RADAR SEMANAL': 'amber',
        };
        const color = categoryColors[article.category.toUpperCase()] || 'gray';

        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover transition-all duration-300 flex flex-col">
                <a href="artigo.html?id=${article.id}" class="block"><img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/ccc/FFFFFF?text=Imagem+Indisponível';"></a>
                <div class="p-6 flex flex-col flex-grow">
                    <span class="text-xs text-${color}-600 font-semibold bg-${color}-100 px-2 py-1 rounded-full self-start">${article.category}</span>
                    <h3 class="text-xl font-bold my-2 text-gray-800 flex-grow">${article.title}</h3>
                    <p class="text-gray-600 text-sm mb-4">${article.summary}</p>
                    <a href="artigo.html?id=${article.id}" class="text-${color}-600 hover:text-${color}-800 font-semibold mt-auto">Leia a análise completa &rarr;</a>
                </div>
            </div>
        `;
    }

    // Carrega os 12 artigos mais recentes na página inicial
    async function loadHomepageArticles() {
        try {
            const response = await fetch(articlesDB);
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            const articles = await response.json();

            const container = document.getElementById('latest-articles-container');
            if (container) {
                const recentArticles = articles.slice(0, 12);
                container.innerHTML = recentArticles.map(article => createArticleCard(article)).join('');
            }
        } catch (error) {
             console.error('Erro ao carregar artigos da página inicial:', error);
             const container = document.getElementById('latest-articles-container');
             if(container) container.innerHTML = '<p class="text-center text-red-500 col-span-full">Ocorreu um erro ao carregar os artigos.</p>';
        }
    }

    // Carrega TODOS os artigos na página de arquivo
    async function loadAllArticles() {
         try {
            const response = await fetch(articlesDB);
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            const articles = await response.json();

            const allArticlesContainer = document.getElementById('all-articles-container');
            if (allArticlesContainer) {
                allArticlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('');
            }
        } catch (error) {
            console.error('Erro ao carregar a lista de artigos:', error);
            const container = document.getElementById('all-articles-container');
            if (container) container.innerHTML = '<p class="text-center text-red-500 col-span-3">Ocorreu um erro ao carregar os artigos.</p>';
        }
    }

    // Carrega um único artigo na página de artigo
    async function loadSingleArticle() {
        const articleContent = document.getElementById('article-full-content');
        if (!articleContent) return;

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');
            if (!articleId) {
                articleContent.innerHTML = '<p class="text-center text-orange-500">Nenhum artigo especificado. <a href="index.html" class="underline">Voltar para a página inicial</a>.</p>';
                return;
            }

            const response = await fetch(articlesDB);
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            const articles = await response.json();

            const article = articles.find(a => a.id === articleId);
            if (!article) {
                 articleContent.innerHTML = `<p class="text-center text-red-500">Artigo com ID "${articleId}" não foi encontrado. <a href="index.html" class="underline">Voltar para a página inicial</a>.</p>`;
                 return;
            }

            document.title = `${article.title} - Economia Futurista`;

            articleContent.innerHTML = `
                <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-4">${article.title}</h1>
                <p class="text-gray-500 text-sm mb-6">Publicado em ${article.date} | Categoria: <a href="artigos.html" class="text-indigo-600 hover:underline">${article.category}</a></p>
                <img src="${article.image}" alt="${article.title}" class="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md" onerror="this.onerror=null;this.src='https://placehold.co/600x400/ccc/FFFFFF?text=Imagem+Indisponível';">
                
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
            articleContent.innerHTML = `<p class="text-center text-red-500">Ocorreu um erro ao carregar o artigo. Verifique o console.</p>`;
        }
    }
