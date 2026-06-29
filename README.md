# FocoVest 

FocoVest é uma aplicação web (SPA) focada em ajudar estudantes a organizar suas revisões para o vestibular. Permite gerenciar os assuntos estudados, filtrar por disciplinas, acompanhar o progresso de revisão e manter o foco nos estudos.

## Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web puras, garantindo alta performance e facilidade de manutenção:

*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+ com `fetch` API)
*   **Backend:** PHP 8+ (API RESTful)
*   **Banco de Dados:** MySQL (via PDO)
*   **Design:** UI/UX moderna, com sistema de cores dinâmico por disciplina e ícones SVG.

## Funcionalidades

*   **Gestão de Assuntos:** Adicionar, editar e excluir assuntos estudados.
*   **Categorização por Disciplinas:** Identificação visual rápida de disciplinas (Matemática, História, Biologia, etc.) com paletas de cores únicas.
*   **Controle de Revisões:** Sistema simples de "Pendente" / "Revisado" para acompanhar o que precisa de atenção.
*   **Busca em Tempo Real:** Filtro rápido por título ou disciplina na página inicial.
*   **Single Page Application (SPA):** Navegação fluida sem recarregamento da página.

## Como executar o projeto localmente

Para rodar este projeto na sua máquina, você precisará de um servidor web local com suporte a PHP e MySQL. Recomendamos o uso do **XAMPP**.

### Pré-requisitos
*   [XAMPP](https://www.apachefriends.org/pt_br/index.html) instalado.

### Passo a passo

1. **Clone o repositório:**
   Faça o clone deste repositório diretamente para a pasta `htdocs` do seu XAMPP (geralmente em `C:\xampp\htdocs\` no Windows ou `/opt/lampp/htdocs/` no Linux).
   ```bash
   cd C:\xampp\htdocs
   git clone https://github.com/SEU-USUARIO/focovest.git
   ```

2. **Inicie os serviços:**
   Abra o painel de controle do XAMPP e inicie os módulos **Apache** e **MySQL**.

3. **Configure o Banco de Dados:**
   O projeto acompanha um script de configuração automática que cria o banco de dados, as tabelas e insere dados de exemplo (garantindo a codificação UTF-8 correta).
   *   Abra o seu navegador e acesse: `http://localhost/focovest/setup.php`
   *   Se aparecer a mensagem "OK — Banco 'focovest' criado", o banco está pronto.

4. **Acesse a aplicação:**
   Pronto! Agora é só acessar a aplicação pelo seu navegador:
   *   `http://localhost/focovest/`

## Estrutura de Arquivos

*   `/api` — Arquivos do backend em PHP.
    *   `config.php` — Configurações de conexão PDO com o MySQL.
    *   `subjects.php` — Endpoints da API REST (GET, POST, PUT, PATCH, DELETE).
*   `app.js` — Lógica do frontend e comunicação com a API.
*   `database.sql` — Schema do banco de dados (referência).
*   `index.html` — Estrutura principal da página (Single Page Application).
*   `setup.php` — Script de inicialização e popularização do banco de dados.
*   `styles.css` — Estilos visuais e design system.
