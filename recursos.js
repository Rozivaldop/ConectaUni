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
            <img src="${m.imagem}" alt="${esc(m.titulo)}" class="card-img" onerror="this.onerror=null; this.src=IMG_PADRAO">
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
                <div class="input-group"><label>Cidade</label><input type="text" id="busca-cidade" placeholder="Ex: Recife, Natal ou RN"></div>
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

// ANÚNCIOS: somente o ADM publica (simula os donos de kitnets cadastrando seus locais)
function renderizarAnuncios(container) {
    if (appState.admin) return navegarPara('admin');
    container.innerHTML = vazio('fa-building', 'Os anúncios são cadastrados pelos estabelecimentos parceiros. Encontre sua moradia na busca.', '<button class="btn-primary" onclick="navegarPara(\'buscar\')">Buscar moradia</button>');
}

function publicarAnuncio(base, fotoEl, depois) {
    if (!appState.admin) return alert('Apenas o administrador pode publicar anúncios.');
    const salvar = img => {
        appState.moradias.unshift({ id: Date.now(), criada: true, dono: appState.email, detalhes: ['1 vaga', 'Mobiliado', 'Wi-Fi'], imagem: img, ...base });
        salvarEstado();
        alert('Publicado com sucesso!');
        depois();
    };
    const foto = fotoEl.files[0];
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
            <div>
                <h4 style="font-size:14px; margin-bottom:6px;">Backup dos dados</h4>
                <p style="font-size:12px; color:#64748b; margin-bottom:8px;">Baixe uma cópia para levar suas contas e anúncios a outro navegador ou computador.</p>
                <button class="btn-detalhes" style="padding:8px 14px;" onclick="exportarBackup()"><i class="fa-solid fa-download"></i> Baixar backup</button>
            </div>
            <button class="btn-detalhes" style="width:fit-content; padding:9px 16px;" onclick="sair()"><i class="fa-solid fa-right-from-bracket"></i> Sair da conta</button>
        </div>`;
}

// PAINEL DO ADMINISTRADOR (aparece só para a conta ADM)
function renderizarAdmin(container) {
    if (!appState.admin) return container.innerHTML = vazio('fa-lock', 'Acesso restrito ao administrador.');
    const anuncios = appState.moradias.filter(m => m.criada);
    const contas = lerLS(LS.contas, {});
    const campo = (id, rotulo, extra = '') => `<div class="input-group"><label>${rotulo}</label><input id="${id}" ${extra} required></div>`;
    const linha = (titulo, sub, acao) => `<div class="adm-linha"><div><strong style="font-size:13px;">${titulo}</strong><small>${sub}</small></div>${acao}</div>`;
    const btnExcluir = js => `<button class="btn-detalhes" style="color:#dc2626; border-color:#fecaca;" onclick="${js}">Excluir</button>`;

    container.innerHTML = `
        <div class="card-box">
            <h3 style="margin-bottom:4px;"><i class="fa-solid fa-user-shield"></i> Painel do administrador</h3>
            <p style="font-size:12px; color:#64748b; margin-bottom:18px;">Cadastre locais de estabelecimentos parceiros. Eles aparecem como "Estabelecimento verificado" para todos os alunos.</p>
            <form onsubmit="cadastrarLocalAdm(event)" class="despesas-grid">
                ${campo('adm-nome', 'Nome do estabelecimento')}
                <div class="input-group"><label>Tipo de moradia</label><select id="adm-tipo">${opcoesTipo(false)}</select></div>
                ${campo('adm-cidade', 'Cidade e bairro')}
                ${campo('adm-uni', 'Universidade próxima')}
                ${campo('adm-preco', 'Preço (R$ / mês)', 'type="number" min="0"')}
                ${campo('adm-tel', 'Telefone / WhatsApp')}
                <div class="input-group" style="grid-column:1/-1;"><label>Descrição</label><textarea id="adm-desc" class="form-control" rows="3" required></textarea></div>
                <div class="input-group"><label>Foto (opcional, até 800 KB)</label><input type="file" id="adm-foto" accept="image/*"></div>
                <div style="grid-column:1/-1;"><button class="btn-primary" type="submit">Cadastrar local</button></div>
            </form>
        </div>
        <div class="card-box">
            <h3 style="font-size:16px; margin-bottom:6px;">Anúncios publicados (${anuncios.length})</h3>
            ${anuncios.length ? anuncios.map(m => linha(esc(m.titulo), `${esc(m.cidade)} · ${esc(m.preco)} · por ${esc(m.dono || '-')}`, btnExcluir(`excluirAnuncio(${m.id})`))).join('') : '<p style="font-size:12px; color:#64748b;">Nenhum anúncio publicado ainda.</p>'}
        </div>
        <div class="card-box">
            <h3 style="font-size:16px; margin-bottom:6px;">Usuários cadastrados (${Object.keys(contas).length})</h3>
            ${Object.keys(contas).map(em => {
                const nome = lerLS(LS.dados(em), {}).perfil?.nome || 'Sem nome';
                const acao = em === ADMIN_EMAIL ? '<span class="badge-status badge-green">ADM</span>' : btnExcluir(`removerUsuario(decodeURIComponent('${encodeURIComponent(em)}'))`);
                return linha(esc(nome), esc(em), acao);
            }).join('')}
        </div>`;
}

function cadastrarLocalAdm(e) {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    publicarAnuncio({
        titulo: v('adm-nome'), tipo: v('adm-tipo'), cidade: v('adm-cidade'), uf: v('adm-uni'),
        status: 'Estabelecimento verificado', statusCor: 'green', preco: `R$ ${v('adm-preco')}/mês`,
        descricao: v('adm-desc'), contato: `${v('adm-nome')} - ${v('adm-tel')}`
    }, document.getElementById('adm-foto'), () => renderizarAdmin(document.getElementById('main-content')));
}

function excluirAnuncio(id) {
    if (!appState.admin || !confirm('Excluir este anúncio?')) return;
    appState.moradias = appState.moradias.filter(m => m.id !== id);
    salvarEstado();
    renderizarAdmin(document.getElementById('main-content'));
}

function removerUsuario(email) {
    if (!appState.admin || email === ADMIN_EMAIL || !confirm(`Remover a conta ${email}?`)) return;
    const contas = lerLS(LS.contas, {});
    delete contas[email];
    gravarLS(LS.contas, contas);
    localStorage.removeItem(LS.dados(email));
    renderizarAdmin(document.getElementById('main-content'));
}

// CARROSSEL DA TELA INICIAL (cards compactos; passa sozinho a cada 5s e pausa ao passar o mouse)
let carrosselTimer = null;
const _inicioOriginal = renderizarInicio;
renderizarInicio = function (container) { _inicioOriginal(container); montarCarrossel(); };

function montarCarrossel() {
    const trilho = document.getElementById('home-cards-container');
    if (!trilho) return;
    renderizarCards(appState.moradias, 'home-cards-container');
    trilho.className = 'carrossel-trilho';
    const caixa = document.createElement('div');
    caixa.className = 'carrossel';
    trilho.parentNode.insertBefore(caixa, trilho);
    caixa.appendChild(trilho);
    caixa.insertAdjacentHTML('beforeend',
        '<button class="car-seta esq" aria-label="Anterior" onclick="moverCarrossel(-1)"><i class="fa-solid fa-chevron-left"></i></button>' +
        '<button class="car-seta dir" aria-label="Próximo" onclick="moverCarrossel(1)"><i class="fa-solid fa-chevron-right"></i></button>');
    clearInterval(carrosselTimer);
    carrosselTimer = setInterval(() => {
        if (!document.body.contains(trilho)) return clearInterval(carrosselTimer);
        if (!caixa.matches(':hover')) moverCarrossel(1);
    }, 5000);
}

function moverCarrossel(dir) {
    const t = document.getElementById('home-cards-container');
    const card = t?.querySelector('.listing-card');
    if (!card) return;
    const fim = t.scrollLeft + t.clientWidth >= t.scrollWidth - 5;
    const inicio = t.scrollLeft <= 5;
    if (dir > 0 && fim) t.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && inicio) t.scrollTo({ left: t.scrollWidth, behavior: 'smooth' });
    else t.scrollBy({ left: dir * (card.offsetWidth + 15), behavior: 'smooth' });
}