// RECURSOS EXTRAS (carregado depois do script.js: as funções abaixo substituem as versões antigas)
const IMG_PADRAO = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500';
const TIPOS = ['Quarto em apartamento', 'Vaga em república', 'Quarto em casa compartilhada', 'Kitnet'];
const opcoesTipo = (todos) => (todos ? '<option value="Todos">Todos</option>' : '') + TIPOS.map(t => `<option>${t}</option>`).join('');
const precoNum = m => parseInt(String(m.preco).replace(/\./g, '').match(/\d+/)?.[0] || 0, 10);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vazio = (icone, texto, botao) => `<div class="card-box" style="text-align:center; color:#64748b;"><i class="fa-regular ${icone}" style="font-size:36px; margin-bottom:10px;"></i><p style="font-size:13px; margin-bottom:12px;">${texto}</p>${botao || ''}</div>`;

// Salva o perfil sempre que for atualizado
const _salvarPerfilOriginal = salvarPerfil;
salvarPerfil = function (e) { _salvarPerfilOriginal(e); salvarEstado(); };

// CARDS (agora com favorito salvo)
function renderizarCards(lista, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!lista.length) { el.innerHTML = `<p style="grid-column:1/-1; color:#64748b; text-align:center; padding:20px;">Nenhuma moradia encontrada.</p>`; return; }
    el.innerHTML = lista.map(m => {
        const fav = appState.favoritos.includes(m.id);
        const b = { green: 'badge-green', yellow: 'badge-yellow' }[m.statusCor] || 'badge-red';
        return `
        <div class="listing-card">
            <button class="fav-btn ${fav ? 'active' : ''}" onclick="toggleFavorito(this, ${m.id})"><i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i></button>
            <img src="${m.imagem}" alt="${esc(m.titulo)}" class="card-img">
            <div class="card-content">
                <span class="badge-status ${b}"><span class="status-dot ${m.statusCor}"></span> ${m.status}</span>
                <h5 class="card-title">${esc(m.titulo)}</h5>
                <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${esc(m.cidade)}</p>
                <div class="card-features">
                    <span><i class="fa-solid fa-bed"></i> ${m.detalhes[0]}</span>
                    <span><i class="fa-solid fa-couch"></i> ${m.detalhes[1]}</span>
                    <span><i class="fa-solid fa-wifi"></i> ${m.detalhes[2]}</span>
                </div>
                <div class="card-footer">
                    <span class="card-price">${esc(m.preco)}</span>
                    <button class="btn-detalhes" onclick="abrirModal(${m.id})">Ver detalhes +</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function toggleFavorito(btn, id) {
    const i = appState.favoritos.indexOf(id);
    if (i >= 0) appState.favoritos.splice(i, 1); else appState.favoritos.push(id);
    salvarEstado();
    if (appState.paginaAtual === 'favoritos') return renderizarFavoritos(document.getElementById('main-content'));
    btn.classList.toggle('active');
    btn.querySelector('i').className = i >= 0 ? 'fa-regular fa-heart' : 'fa-solid fa-heart';
}

function renderizarFavoritos(container) {
    const lista = appState.moradias.filter(m => appState.favoritos.includes(m.id));
    container.innerHTML = `
        <div class="card-box"><h3><i class="fa-solid fa-heart" style="color:#ef4444;"></i> Meus favoritos (${lista.length})</h3></div>
        ${lista.length ? '<div class="cards-grid" id="fav-cards"></div>' : vazio('fa-heart', 'Você ainda não favoritou nenhuma moradia.', '<button class="btn-primary" onclick="navegarPara(\'buscar\')">Buscar moradia</button>')}`;
    if (lista.length) renderizarCards(lista, 'fav-cards');
}

// BUSCA (filtros funcionando: cidade, universidade, tipo, preço máximo e ordenação)
function executarBuscaHome(e) {
    e.preventDefault();
    appState.filtros = {
        cidade: document.getElementById('home-cidade').value,
        uni: document.getElementById('home-uf').value,
        tipo: document.getElementById('home-tipo').value
    };
    navegarPara('buscar');
}

function renderizarBusca(container) {
    const f = appState.filtros || {};
    container.innerHTML = `
        <section class="search-box">
            <h4><i class="fa-solid fa-magnifying-glass"></i> Filtrar Moradias e Vagas</h4>
            <form class="search-form" style="grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));" onsubmit="filtrarMoradiasPagina(event)">
                <div class="input-group"><label>Cidade</label><input type="text" id="busca-cidade" placeholder="Ex: Recife, Natal..."></div>
                <div class="input-group"><label>Universidade</label><input type="text" id="busca-uf" placeholder="Ex: UFPE, UFRN..."></div>
                <div class="input-group"><label>Tipo de moradia</label><select id="busca-tipo">${opcoesTipo(true)}</select></div>
                <div class="input-group"><label>Preço máximo (R$)</label><input type="number" id="busca-preco" min="0" placeholder="Ex: 800"></div>
                <div class="input-group"><label>Ordenar por</label>
                    <select id="busca-ordem"><option value="">Mais recentes</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select></div>
                <button type="submit" class="btn-search">Aplicar Filtro</button>
            </form>
        </section>
        <section class="listings-section">
            <p id="busca-total" style="font-size:13px; color:#64748b;"></p>
            <div class="cards-grid" id="busca-cards-container"></div>
        </section>`;
    document.getElementById('busca-cidade').value = f.cidade || '';
    document.getElementById('busca-uf').value = f.uni || '';
    document.getElementById('busca-tipo').value = f.tipo || 'Todos';
    appState.filtros = {};
    filtrarMoradiasPagina();
}

function filtrarMoradiasPagina(e) {
    if (e) e.preventDefault();
    const val = id => document.getElementById(id).value.toLowerCase().trim();
    const [cid, uni, tipo, ordem] = [val('busca-cidade'), val('busca-uf'), document.getElementById('busca-tipo').value, val('busca-ordem')];
    const max = parseFloat(document.getElementById('busca-preco').value) || Infinity;

    const lista = appState.moradias.filter(m =>
        (!cid || m.cidade.toLowerCase().includes(cid)) &&
        (!uni || m.cidade.toLowerCase().includes(uni) || m.uf.toLowerCase().includes(uni)) &&
        (tipo === 'Todos' || (m.tipo || m.titulo).toLowerCase().includes(tipo.toLowerCase())) &&
        precoNum(m) <= max
    );
    if (ordem) lista.sort((a, b) => ordem === 'menor' ? precoNum(a) - precoNum(b) : precoNum(b) - precoNum(a));

    document.getElementById('busca-total').textContent = `${lista.length} moradia(s) encontrada(s)`;
    renderizarCards(lista, 'busca-cards-container');
}

// ANÚNCIOS (com universidade, tipo e foto)
function renderizarAnuncios(container) {
    const u = appState.usuario;
    container.innerHTML = `
        <div class="card-box">
            <h3 style="margin-bottom:15px;">Cadastrar Nova Moradia / Vaga</h3>
            <form onsubmit="cadastrarVaga(event)" style="display:flex; flex-direction:column; gap:15px;">
                <div class="input-group"><label>Título da Vaga</label><input type="text" id="vaga-titulo" placeholder="Ex: Kitnet perto do campus" required></div>
                <div class="input-group"><label>Tipo de moradia</label><select id="vaga-tipo">${opcoesTipo(false)}</select></div>
                <div class="input-group"><label>Cidade e Bairro</label><input type="text" id="vaga-cidade" placeholder="Ex: Natal, RN - Lagoa Nova" required></div>
                <div class="input-group"><label>Universidade próxima</label><input type="text" id="vaga-uni" value="${esc(u.universidade)}" required></div>
                <div class="input-group"><label>Preço (R$ / mês)</label><input type="number" id="vaga-preco" min="0" placeholder="Ex: 750" required></div>
                <div class="input-group"><label>Descrição Detalhada</label><textarea id="vaga-desc" class="form-control" rows="3" placeholder="Descreva os diferenciais da moradia..." required></textarea></div>
                <div class="input-group"><label>Foto (opcional, até 800 KB)</label><input type="file" id="vaga-foto" accept="image/*"></div>
                <button type="submit" class="btn-primary" style="width:200px;">Publicar Anúncio</button>
            </form>
        </div>`;
}

function cadastrarVaga(e) {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const salvar = img => {
        appState.moradias.unshift({
            id: Date.now(), criada: true, titulo: v('vaga-titulo'), tipo: v('vaga-tipo'), cidade: v('vaga-cidade'), uf: v('vaga-uni'),
            status: appState.usuario.statusTexto, statusCor: appState.usuario.status,
            detalhes: ['1 vaga', 'Mobiliado', 'Wi-Fi'], preco: `R$ ${v('vaga-preco')}/mês`, imagem: img,
            descricao: v('vaga-desc'), contato: `${appState.usuario.nome} (${appState.usuario.universidade})`
        });
        salvarEstado();
        alert('Vaga publicada com sucesso!');
        navegarPara('inicio');
    };
    const foto = document.getElementById('vaga-foto').files[0];
    if (!foto) return salvar(IMG_PADRAO);
    if (foto.size > 800 * 1024) return alert('Foto muito grande. Use uma imagem de até 800 KB.');
    const r = new FileReader();
    r.onload = ev => salvar(ev.target.result);
    r.readAsDataURL(foto);
}

// DIVISÃO DE DESPESAS
function renderizarDespesas(container) {
    const d = Object.assign({ aluguel: 0, condominio: 0, agua: 0, luz: 0, internet: 0, pessoas: 2 }, appState.despesas);
    const campos = [['aluguel', 'Aluguel', 'fa-house'], ['condominio', 'Condomínio', 'fa-building'], ['agua', 'Água', 'fa-droplet'], ['luz', 'Luz', 'fa-bolt'], ['internet', 'Internet', 'fa-wifi']];
    container.innerHTML = `
        <div class="card-box">
            <h3 style="margin-bottom:5px;"><i class="fa-solid fa-calculator"></i> Divisão de despesas</h3>
            <p style="font-size:12px; color:#64748b; margin-bottom:18px;">Informe os valores do mês e veja quanto cada morador paga.</p>
            <div class="despesas-grid">
                ${campos.map(([k, nome, ic]) => `<div class="input-group"><label><i class="fa-solid ${ic}"></i> ${nome} (R$)</label><input type="number" min="0" step="0.01" id="dp-${k}" value="${d[k]}" oninput="calcularDespesas()"></div>`).join('')}
                <div class="input-group"><label><i class="fa-solid fa-users"></i> Moradores</label><input type="number" min="1" step="1" id="dp-pessoas" value="${d.pessoas}" oninput="calcularDespesas()"></div>
            </div>
            <div id="dp-resultado" class="dp-resultado"></div>
        </div>`;
    calcularDespesas();
}

function calcularDespesas() {
    const n = id => parseFloat(document.getElementById('dp-' + id)?.value) || 0;
    const chaves = ['aluguel', 'condominio', 'agua', 'luz', 'internet'];
    const pessoas = Math.max(1, Math.floor(n('pessoas')));
    const total = chaves.reduce((s, k) => s + n(k), 0);
    appState.despesas = Object.fromEntries([...chaves, 'pessoas'].map(k => [k, n(k)]));
    document.getElementById('dp-resultado').innerHTML = `
        <div><span>Total do mês</span><strong>${brl(total)}</strong></div>
        <div><span>Cada um paga (${pessoas})</span><strong style="color:#2563eb;">${brl(total / pessoas)}</strong></div>`;
    salvarEstado();
}

// AVALIAÇÕES (com estrelas e comentário)
function renderizarAvaliacoes(container) {
    const estrelas = n => '★'.repeat(n) + '☆'.repeat(5 - n);
    const exemplo = { autor: 'Lucas Medeiros (UFRN)', sobre: 'Colega de apartamento', nota: 5, texto: 'Excelente colega de apartamento! Muito organizada e responsável com as contas.' };
    const lista = [...appState.avaliacoes, exemplo].map(a => `
        <div style="border-bottom:1px solid #e2e8f0; padding:12px 0;">
            <strong style="font-size:14px;">${esc(a.autor)}</strong>
            <span style="color:#f59e0b; margin-left:8px;">${estrelas(a.nota)}</span>
            <p style="font-size:11px; color:#94a3b8;">Sobre: ${esc(a.sobre)}</p>
            <p style="font-size:13px; color:#475569; margin-top:4px;">${esc(a.texto)}</p>
        </div>`).join('');
    container.innerHTML = `
        <div class="card-box">
            <h3 style="margin-bottom:15px;">Deixar uma avaliação</h3>
            <form onsubmit="publicarAvaliacao(event)" style="display:grid; grid-template-columns:1fr 160px; gap:12px;">
                <div class="input-group"><label>Sobre quem ou qual moradia?</label><input id="av-sobre" required placeholder="Ex: Kitnet da Rua X"></div>
                <div class="input-group"><label>Nota</label><select id="av-nota">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${estrelas(n)}</option>`).join('')}</select></div>
                <div class="input-group" style="grid-column:1/-1;"><label>Comentário</label><textarea id="av-texto" class="form-control" rows="3" required></textarea></div>
                <div><button class="btn-primary" type="submit">Publicar avaliação</button></div>
            </form>
        </div>
        <div class="card-box"><h3 style="margin-bottom:5px;">Avaliações e Recomendações</h3>${lista}</div>`;
}

function publicarAvaliacao(e) {
    e.preventDefault();
    appState.avaliacoes.unshift({
        autor: appState.usuario.nome, sobre: document.getElementById('av-sobre').value.trim(),
        nota: parseInt(document.getElementById('av-nota').value, 10), texto: document.getElementById('av-texto').value.trim()
    });
    salvarEstado();
    renderizarAvaliacoes(document.getElementById('main-content'));
}

// CONFIGURAÇÕES (alterar senha e sair)
function renderizarConfiguracoes(container) {
    container.innerHTML = `
        <div class="card-box" style="display:flex; flex-direction:column; gap:20px;">
            <h3>Configurações da Conta</h3>
            <label style="display:flex; align-items:center; gap:10px; font-size:13px; cursor:pointer;">
                <input type="checkbox" checked> Receber alertas por e-mail de novas vagas compatíveis
            </label>
            <form onsubmit="alterarSenha(event)" style="display:flex; flex-direction:column; gap:12px; max-width:340px;">
                <h4 style="font-size:14px;">Alterar senha</h4>
                <div class="input-group"><label>Senha atual</label><input type="password" id="sn-atual" required></div>
                <div class="input-group"><label>Nova senha (mín. 6 caracteres)</label><input type="password" id="sn-nova" minlength="6" required></div>
                <p id="sn-msg" style="font-size:12px;"></p>
                <button class="btn-primary" type="submit" style="width:fit-content;">Salvar nova senha</button>
            </form>
            <button class="btn-detalhes" style="width:fit-content; padding:9px 16px;" onclick="sair()"><i class="fa-solid fa-right-from-bracket"></i> Sair da conta</button>
        </div>`;
}
