// Estado Global da Aplicação
const appState = {
    paginaAtual: 'inicio',
    usuario: {
        nome: "Ana Souza",
        curso: "Engenharia de Software",
        universidade: "UFPE",
        ano: "2º ano",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        status: "green", // green, yellow, red
        statusTexto: "Vínculo verificado",
        atualizacao: "2026"
    },
    moradias: [
        {
            id: 1,
            titulo: "Quarto em apartamento",
            cidade: "Recife, PE - Boa Vista",
            uf: "UFPE",
            status: "Vínculo verificado",
            statusCor: "green",
            detalhes: ["1 quarto", "Mobiliado", "Wi-Fi"],
            preco: "R$ 850/mês",
            imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500",
            descricao: "Excelente apartamento próximo à UFPE. Quarto mobiliado com escrivaninha, cama box e armário embutido. Condomínio incluso.",
            contato: "Carlos Silva (UFPE)"
        },
        {
            id: 2,
            titulo: "Vaga em república",
            cidade: "Recife, PE - UFPE",
            uf: "UFPE",
            status: "Renovação pendente",
            statusCor: "yellow",
            detalhes: ["1 vaga", "Mobiliado", "Wi-Fi"],
            preco: "R$ 650/mês",
            imagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500",
            descricao: "República estudantil jovem e organizada. Vaga em quarto duplo para estudantes de tecnologia/engenharia.",
            contato: "Mariana Costa (UFPE)"
        },
        {
            id: 3,
            titulo: "Quarto em casa compartilhada",
            cidade: "Natal, RN - UFRN",
            uf: "UFRN",
            status: "Vínculo verificado",
            statusCor: "green",
            detalhes: ["1 quarto", "Mobiliado", "Wi-Fi"],
            preco: "R$ 700/mês",
            imagem: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=500",
            descricao: "Casa bem localizada em Lagoa Nova, pertinho do Campus Central da UFRN. Ambiente silencioso para estudos.",
            contato: "Lucas Medeiros (UFRN)"
        }
    ],
    conversas: {
        1: {
            nome: "Carlos Silva",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
            naoLidas: 1,
            mensagens: [
                { remetente: "outro", texto: "Olá Ana! Vi que você tem interesse na vaga de Recife." },
                { remetente: "eu", texto: "Oi Carlos! Sim, gostaria de saber se o valor do condomínio está incluso." },
                { remetente: "outro", texto: "Sim! Está tudo incluso no valor de R$ 850." }
            ]
        },
        2: {
            nome: "Mariana Costa",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
            naoLidas: 1,
            mensagens: [
                { remetente: "outro", texto: "Oi Ana! Tudo bem? Quando você pretende fazer a mudança?" }
            ]
        }
    },
    chatAtivo: 1,
    notificacoes: [
        { id: 1, texto: "Carlos Silva respondeu sua mensagem sobre a moradia em Recife.", lida: false, tempo: "Há 10 min" },
        { id: 2, texto: "Seu documento de vínculo foi verificado com sucesso para 2026.", lida: false, tempo: "Há 2 horas" },
        { id: 3, texto: "Nova vaga compatível com seu perfil adicionada perto da UFPE.", lida: true, tempo: "Ontem" }
    ]
};

// Navegação entre Telas
function navegarPara(pagina) {
    appState.paginaAtual = pagina;

    // Atualizar Navegação Visual
    document.querySelectorAll('.nav-item, .menu-item').forEach(el => el.classList.remove('active'));

    const navEl = document.getElementById(`nav-${pagina}`);
    const sideEl = document.getElementById(`side-${pagina}`);
    if (navEl) navEl.classList.add('active');
    if (sideEl) sideEl.classList.add('active');

    const mainContainer = document.getElementById('main-content');

    switch (pagina) {
        case 'inicio':
            renderizarInicio(mainContainer);
            break;
        case 'buscar':
            renderizarBusca(mainContainer);
            break;
        case 'mensagens':
            renderizarMensagens(mainContainer);
            break;
        case 'notificacoes':
            renderizarNotificacoes(mainContainer);
            break;
        case 'perfil':
            renderizarPerfil(mainContainer);
            break;
        case 'anuncios':
            renderizarAnuncios(mainContainer);
            break;
        case 'avaliacoes':
            renderizarAvaliacoes(mainContainer);
            break;
        case 'carteira':
            renderizarCarteira(mainContainer);
            break;
        case 'emergencia':
            renderizarEmergencia(mainContainer);
            break;
        case 'admin':
            renderizarAdmin(mainContainer);
            break;
        case 'favoritos':
            renderizarFavoritos(mainContainer);
            break;
        case 'despesas':
            renderizarDespesas(mainContainer);
            break;
        case 'configuracoes':
            renderizarConfiguracoes(mainContainer);
            break;
        default:
            renderizarInicio(mainContainer);
    }

    atualizarBadges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 1. TELA INÍCIO
function renderizarInicio(container) {
    container.innerHTML = `
        <section class="hero-banner">
            <div class="hero-text">
                <h2>ConectaUni</h2>
                <h3>Mais do que uma moradia, uma rede de apoio.</h3>
                <p>Conectamos estudantes que estão chegando a uma nova cidade com quem já está lá. Aqui você encontra moradia, colegas para dividir despesas e pessoas de confiança.</p>
            </div>
            <div class="hero-tag">Juntos fica mais fácil!</div>
        </section>

        <section class="search-box">
            <h4><i class="fa-solid fa-location-dot"></i> Encontre sua próxima moradia</h4>
            <form id="search-form-home" class="search-form" onsubmit="executarBuscaHome(event)">
                <div class="input-group">
                    <label>Cidade</label>
                    <input type="text" id="home-cidade" placeholder="Ex: Recife, PE">
                </div>
                <div class="input-group">
                    <label>Universidade</label>
                    <input type="text" id="home-uf" placeholder="Ex: UFPE, UFRN...">
                </div>
                <div class="input-group">
                    <label>Tipo de moradia</label>
                    <select id="home-tipo">
                        <option value="Todos">Todos</option>
                        <option value="Quarto em apartamento">Quarto em apartamento</option>
                        <option value="Vaga em república">Vaga em república</option>
                        <option value="Quarto em casa compartilhada">Quarto em casa compartilhada</option>
                    </select>
                </div>
                <button type="submit" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i> Buscar</button>
            </form>
        </section>

        <section class="listings-section">
            <div class="section-header">
                <h3><i class="fa-solid fa-house-user"></i> Moradias disponíveis</h3>
                <span class="link-ver-todas" onclick="navegarPara('buscar')">Ver todas <i class="fa-solid fa-arrow-right"></i></span>
            </div>
            <div class="cards-grid" id="home-cards-container"></div>
        </section>

        <section class="info-blocks-grid">
            <div class="info-card">
                <h4>Como funciona?</h4>
                <div class="steps-grid">
                    <div class="step-item"><div class="step-icon"><i class="fa-solid fa-user-plus"></i></div><strong>1. Cadastro</strong><span>Insira dados acadêmicos.</span></div>
                    <div class="step-item"><div class="step-icon"><i class="fa-solid fa-magnifying-glass"></i></div><strong>2. Conexão</strong><span>Ache estudantes compatíveis.</span></div>
                    <div class="step-item"><div class="step-icon"><i class="fa-regular fa-comments"></i></div><strong>3. Chat</strong><span>Combine detalhes.</span></div>
                    <div class="step-item"><div class="step-icon"><i class="fa-solid fa-house-flag"></i></div><strong>4. Mudança</strong><span>Inicie sua nova jornada.</span></div>
                </div>
            </div>
            <div class="info-card">
                <h4>Tecnologias que tornam isso possível</h4>
                <div class="tech-grid">
                    <div class="tech-item"><i class="fa-solid fa-database tech-icon"></i><div><strong>Banco de Dados</strong><p>Armazenamento seguro de cadastros e dados.</p></div></div>
                    <div class="tech-item"><i class="fa-solid fa-location-crosshairs tech-icon"></i><div><strong>Geolocalização</strong><p>Proximidade com a universidade de destino.</p></div></div>
                    <div class="tech-item"><i class="fa-solid fa-robot tech-icon"></i><div><strong>Inteligência Artificial</strong><p>Recomendação inteligente de compatibilidade.</p></div></div>
                </div>
            </div>
        </section>
    `;
    renderizarCards(appState.moradias, 'home-cards-container');
}

function renderizarCards(lista, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';

    if (lista.length === 0) {
        el.innerHTML = `<p style="grid-column: 1 / -1; color: #64748b; text-align: center; padding: 20px;">Nenhuma moradia encontrada.</p>`;
        return;
    }

    lista.forEach(m => {
        const badgeClass = m.statusCor === 'green' ? 'badge-green' : (m.statusCor === 'yellow' ? 'badge-yellow' : 'badge-red');
        el.innerHTML += `
            <div class="listing-card">
                <button class="fav-btn" onclick="toggleFavorito(this)"><i class="fa-regular fa-heart"></i></button>
                <img src="${m.imagem}" alt="${m.titulo}" class="card-img">
                <div class="card-content">
                    <span class="badge-status ${badgeClass}">
                        <span class="status-dot ${m.statusCor}"></span> ${m.status}
                    </span>
                    <h5 class="card-title">${m.titulo}</h5>
                    <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${m.cidade}</p>
                    <div class="card-features">
                        <span><i class="fa-solid fa-bed"></i> ${m.detalhes[0]}</span>
                        <span><i class="fa-solid fa-couch"></i> ${m.detalhes[1]}</span>
                        <span><i class="fa-solid fa-wifi"></i> ${m.detalhes[2]}</span>
                    </div>
                    <div class="card-footer">
                        <span class="card-price">${m.preco}</span>
                        <button class="btn-detalhes" onclick="abrirModal(${m.id})">Ver detalhes +</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function executarBuscaHome(e) {
    e.preventDefault();
    navegarPara('buscar');
}

// 2. TELA BUSCAR
function renderizarBusca(container) {
    container.innerHTML = `
        <section class="search-box">
            <h4><i class="fa-solid fa-magnifying-glass"></i> Filtrar Moradias e Vagas</h4>
            <form class="search-form" onsubmit="filtrarMoradiasPagina(event)">
                <div class="input-group">
                    <label>Cidade</label>
                    <input type="text" id="busca-cidade" placeholder="Ex: Recife, Natal...">
                </div>
                <div class="input-group">
                    <label>Universidade</label>
                    <input type="text" id="busca-uf" placeholder="Ex: UFPE, UFRN...">
                </div>
                <div class="input-group">
                    <label>Tipo de moradia</label>
                    <select id="busca-tipo">
                        <option value="Todos">Todos</option>
                        <option value="Quarto em apartamento">Quarto em apartamento</option>
                        <option value="Vaga em república">Vaga em república</option>
                        <option value="Quarto em casa compartilhada">Quarto em casa compartilhada</option>
                    </select>
                </div>
                <button type="submit" class="btn-search">Aplicar Filtro</button>
            </form>
        </section>

        <section class="listings-section">
            <div class="cards-grid" id="busca-cards-container"></div>
        </section>
    `;
    renderizarCards(appState.moradias, 'busca-cards-container');
}

function filtrarMoradiasPagina(e) {
    e.preventDefault();
    const cid = document.getElementById('busca-cidade').value.toLowerCase();
    const uni = document.getElementById('busca-uf').value.toLowerCase();
    const tipo = document.getElementById('busca-tipo').value;

    const filtrado = appState.moradias.filter(m => {
        const matchCid = !cid || m.cidade.toLowerCase().includes(cid);
        const matchUni = !uni || m.cidade.toLowerCase().includes(uni) || m.uf.toLowerCase().includes(uni);
        const matchTipo = tipo === 'Todos' || m.titulo.toLowerCase().includes(tipo.toLowerCase());
        return matchCid && matchUni && matchTipo;
    });

    renderizarCards(filtrado, 'busca-cards-container');
}

// 3. TELA MENSAGENS / CHAT
const RESPOSTAS_AUTO = [
    'Perfeito! Qualquer dúvida sobre o contrato ou moradia é só me avisar.',
    'Combinado! Posso te mandar mais fotos e detalhes se quiser.',
    'Claro! A visita pode ser marcada em qualquer dia da semana.',
    'Boa! Me conta quando você pretende se mudar que eu reservo para você.'
];

// Gera um avatar com as iniciais do contato (sem depender de site externo)
function avatarIniciais(nome) {
    const ini = String(nome).split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#2563eb'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='white'>${esc(ini)}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Atualiza a bolinha vermelha das mensagens (topo e menu lateral) e a das notificações
function atualizarBadges() {
    const total = Object.values(appState.conversas || {}).reduce((soma, c) => soma + (c.naoLidas || 0), 0);
    ['chat-count-badge', 'chat-count-side'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = total > 9 ? '9+' : total;
        el.style.display = total ? '' : 'none';
    });
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = (appState.notificacoes || []).some(n => !n.lida) ? '' : 'none';
}

function renderizarMensagens(container, manterRascunho = false) {
    const rascunho = manterRascunho ? (document.getElementById('chat-input')?.value || '') : '';
    const ids = Object.keys(appState.conversas);

    if (!ids.length) {
        container.innerHTML = `<div class="card-box" style="text-align:center; color:#64748b;">Você ainda não tem conversas. Abra uma moradia e clique em "Entrar em contato".</div>`;
        atualizarBadges();
        return;
    }

    // se a conversa ativa não existe mais, usa a primeira
    if (!appState.conversas[appState.chatAtivo]) appState.chatAtivo = ids[0];
    const conAtiva = appState.conversas[appState.chatAtivo];

    // abrir a conversa = marcar como lida
    if (conAtiva.naoLidas) {
        conAtiva.naoLidas = 0;
        salvarEstado();
    }
    atualizarBadges();

    let contatosHTML = '';
    ids.forEach(id => {
        const c = appState.conversas[id];
        const ativa = String(id) === String(appState.chatAtivo) ? 'active' : '';
        const ultima = c.mensagens.length ? c.mensagens[c.mensagens.length - 1].texto : 'Nova conversa';
        const previa = ultima.length > 24 ? ultima.substring(0, 24) + '...' : ultima;
        contatosHTML += `
            <div class="contact-item ${ativa} ${c.naoLidas ? 'nao-lida' : ''}" onclick="selecionarChat('${id}')">
                <img src="${c.avatar}" class="contact-avatar" alt="">
                <div class="contact-info">
                    <strong>${esc(c.nome)}</strong>
                    <span>${esc(previa)}</span>
                </div>
                ${c.naoLidas ? `<span class="badge">${c.naoLidas}</span>` : ''}
            </div>
        `;
    });

    let msgsHTML = '';
    if (!conAtiva.mensagens.length) {
        msgsHTML = `<p style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">Envie a primeira mensagem para ${esc(conAtiva.nome)}.</p>`;
    }
    conAtiva.mensagens.forEach(msg => {
        const classe = msg.remetente === 'eu' ? 'sent' : 'received';
        msgsHTML += `<div class="msg-bubble ${classe}">${esc(msg.texto)}</div>`;
    });

    container.innerHTML = `
        <div class="chat-wrapper">
            <div class="chat-sidebar">
                <div class="chat-sidebar-header">Mensagens Diretas</div>
                <div class="chat-contacts-list">${contatosHTML}</div>
            </div>
            <div class="chat-main">
                <div class="chat-header">
                    <img src="${conAtiva.avatar}" class="contact-avatar" style="width:30px;height:30px;" alt="">
                    <span>${esc(conAtiva.nome)}</span>
                </div>
                <div class="chat-messages" id="chat-messages-box">${msgsHTML}</div>
                <form class="chat-input-area" onsubmit="enviarMensagem(event)">
                    <input type="text" id="chat-input" class="form-control" placeholder="Digite sua mensagem..." autocomplete="off" required>
                    <button type="submit" class="btn-primary"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    `;

    const input = document.getElementById('chat-input');
    if (manterRascunho && input) {
        input.value = rascunho;
        input.focus();
    }

    setTimeout(() => {
        const box = document.getElementById('chat-messages-box');
        if (box) box.scrollTop = box.scrollHeight;
    }, 50);
}

function selecionarChat(id) {
    appState.chatAtivo = String(id);
    renderizarMensagens(document.getElementById('main-content'));
}

function enviarMensagem(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();
    if (!texto) return;

    const idChat = String(appState.chatAtivo); // guarda a conversa de quem recebe a resposta
    appState.conversas[idChat].mensagens.push({ remetente: 'eu', texto });
    salvarEstado();
    renderizarMensagens(document.getElementById('main-content'), true);

    // resposta automática simulada
    setTimeout(() => {
        const conversa = appState.conversas[idChat];
        if (!conversa) return;
        conversa.mensagens.push({
            remetente: 'outro',
            texto: RESPOSTAS_AUTO[Math.floor(Math.random() * RESPOSTAS_AUTO.length)]
        });

        const vendoEssaConversa = appState.paginaAtual === 'mensagens' && String(appState.chatAtivo) === idChat;
        if (!vendoEssaConversa) {
            // chegou mensagem em uma conversa que o usuário não está vendo
            conversa.naoLidas = (conversa.naoLidas || 0) + 1;
            appState.notificacoes.unshift({ id: Date.now(), texto: `${conversa.nome} respondeu sua mensagem.`, lida: false, tempo: 'Agora' });
        }
        salvarEstado();

        if (appState.paginaAtual === 'mensagens') {
            renderizarMensagens(document.getElementById('main-content'), true);
        } else if (appState.paginaAtual === 'notificacoes') {
            renderizarNotificacoes(document.getElementById('main-content'));
        }
        atualizarBadges();
    }, 1200);
}

// 4. TELA NOTIFICAÇÕES
function renderizarNotificacoes(container) {
    const naoLidas = appState.notificacoes.filter(n => !n.lida).length;
    let listHTML = '';
    appState.notificacoes.forEach(n => {
        listHTML += `
            <div style="background:white; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; gap:12px; border:1px solid #f1f5f9; border-left: 4px solid ${n.lida ? '#cbd5e1' : '#2563eb'};">
                <div>
                    <p style="font-size:13px; color:#1e293b; font-weight:${n.lida ? 'normal' : 'bold'}">${esc(n.texto)}</p>
                    <small style="color:#94a3b8; font-size:11px;">${esc(n.tempo)}</small>
                </div>
                <button class="btn-detalhes" style="white-space:nowrap;" ${n.lida ? 'disabled' : ''} onclick="marcarLida(${n.id})">${n.lida ? 'Lida' : 'Marcar como lida'}</button>
            </div>
        `;
    });
    if (!listHTML) listHTML = '<p style="font-size:13px; color:#64748b;">Você não tem notificações.</p>';

    container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:15px;">
                <h3 style="font-size:18px;">Minhas Notificações</h3>
                ${naoLidas ? '<button class="btn-detalhes" onclick="marcarTodasLidas()">Marcar todas como lidas</button>' : ''}
            </div>
            <div>${listHTML}</div>
        </div>
    `;
    atualizarBadges();
}

function marcarLida(id) {
    const item = appState.notificacoes.find(n => n.id === id);
    if (item) item.lida = true;
    salvarEstado();
    renderizarNotificacoes(document.getElementById('main-content'));
}

function marcarTodasLidas() {
    appState.notificacoes.forEach(n => n.lida = true);
    salvarEstado();
    renderizarNotificacoes(document.getElementById('main-content'));
}

// 5. TELA MEU PERFIL & COMPROVANTE ACADÊMICO
function renderizarPerfil(container) {
    container.innerHTML = `
        <div style="background:white; padding:25px; border-radius:16px; display:flex; flex-direction:column; gap:20px;">
            <h3 style="font-size:18px; color:#1e293b;">Meu Perfil e Dados Acadêmicos</h3>

            <div class="profile-photo-upload-section">
                <img id="preview-avatar" src="${appState.usuario.avatar}" class="profile-avatar-preview" alt="Sua Foto">
                <div>
                    <label style="font-size:12px; font-weight:600; color:#64748b; display:block; margin-bottom:5px;">Alterar Foto do Perfil</label>
                    <input type="file" id="prof-photo-file" accept="image/*" onchange="previewFotoPerfil(event)" style="font-size:12px;">
                </div>
            </div>

            <form onsubmit="salvarPerfil(event)" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div class="input-group">
                    <label>Nome Completo</label>
                    <input type="text" id="prof-nome" value="${appState.usuario.nome}" required>
                </div>
                <div class="input-group">
                    <label>Universidade</label>
                    <input type="text" id="prof-uni" value="${appState.usuario.universidade}" required>
                </div>
                <div class="input-group">
                    <label>Curso</label>
                    <input type="text" id="prof-curso" value="${appState.usuario.curso}" required>
                </div>
                <div class="input-group">
                    <label>Período / Ano</label>
                    <input type="text" id="prof-ano" value="${appState.usuario.ano}" required>
                </div>
                <div style="grid-column: span 2;" class="input-group">
                    <label>Upload de Comprovante de Vínculo Acadêmico (PDF/Imagem)</label>
                    <input type="file" id="prof-file" accept="image/*,.pdf" style="padding:8px;">
                </div>
                <div style="grid-column: span 2;">
                    <button type="submit" class="btn-primary">Atualizar Perfil e Vínculo</button>
                </div>
            </form>
        </div>
    `;
}

function previewFotoPerfil(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            document.getElementById('preview-avatar').src = evt.target.result;
            appState.usuario.avatar = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function salvarPerfil(e) {
    e.preventDefault();

    // Atualiza estado global com novos valores digitados
    appState.usuario.nome = document.getElementById('prof-nome').value;
    appState.usuario.universidade = document.getElementById('prof-uni').value;
    appState.usuario.curso = document.getElementById('prof-curso').value;
    appState.usuario.ano = document.getElementById('prof-ano').value;

    const fileDocumento = document.getElementById('prof-file').files[0];
    if (fileDocumento) {
        appState.usuario.status = 'green';
        appState.usuario.statusTexto = 'Vínculo verificado';
        appState.usuario.atualizacao = '2026';
    }

    // Atualiza imediatamente todos os elementos da página
    atualizarInterfaceUsuario();

    alert('Perfil atualizado com sucesso!');
    renderizarPerfil(document.getElementById('main-content'));
}

function atualizarInterfaceUsuario() {
    const u = appState.usuario;

    // Atualiza Top Navbar
    const topName = document.getElementById('top-user-name');
    const topAvatar = document.getElementById('top-user-avatar');
    if (topName) topName.innerHTML = `${u.nome} <i class="fa-solid fa-chevron-down"></i>`;
    if (topAvatar) topAvatar.src = u.avatar;

    // Atualiza Sidebar Direita
    const sideAvatar = document.getElementById('side-user-avatar');
    const sideName = document.getElementById('side-user-name');
    const sideCourse = document.getElementById('side-user-course');
    const sideYear = document.getElementById('side-user-year');

    if (sideAvatar) sideAvatar.src = u.avatar;
    if (sideName) sideName.innerText = u.nome;
    if (sideCourse) sideCourse.innerText = `${u.universidade} - ${u.curso}`;
    if (sideYear) sideYear.innerHTML = `<i class="fa-solid fa-user-graduate"></i> ${u.ano}`;

    // Status do Vínculo
    const display = document.getElementById('user-status-display');
    const textDisplay = document.getElementById('status-text-display');
    const dateDisplay = document.getElementById('status-date-display');
    const dotDisplay = document.getElementById('status-dot-display');

    if (display && textDisplay && dateDisplay && dotDisplay) {
        textDisplay.innerText = u.statusTexto;
        dateDisplay.innerText = `Documento atualizado em ${u.atualizacao}`;
        display.className = `status-badge ${u.status === 'green' ? 'badge-green' : 'badge-yellow'}`;
        dotDisplay.className = `status-dot ${u.status}`;
    }
}

// 6. TELA MEUS ANÚNCIOS (CRIAR VAGA)
function renderizarAnuncios(container) {
    container.innerHTML = `
        <div style="background:white; padding:25px; border-radius:16px;">
            <h3 style="margin-bottom:15px;">Cadastrar Nova Moradia / Vaga</h3>
            <form onsubmit="cadastrarVaga(event)" style="display:flex; flex-direction:column; gap:15px;">
                <div class="input-group">
                    <label>Título da Vaga</label>
                    <input type="text" id="vaga-titulo" placeholder="Ex: Quarto individual perto do centro" required>
                </div>
                <div class="input-group">
                    <label>Cidade e Bairro</label>
                    <input type="text" id="vaga-cidade" placeholder="Ex: Recife, PE - Boa Vista" required>
                </div>
                <div class="input-group">
                    <label>Preço (R$ / mês)</label>
                    <input type="text" id="vaga-preco" placeholder="Ex: R$ 750/mês" required>
                </div>
                <div class="input-group">
                    <label>Descrição Detalhada</label>
                    <textarea id="vaga-desc" class="form-control" rows="3" placeholder="Descreva os diferenciais da moradia..." required></textarea>
                </div>
                <button type="submit" class="btn-primary" style="width:200px;">Publicar Anúncio</button>
            </form>
        </div>
    `;
}

function cadastrarVaga(e) {
    e.preventDefault();
    const novaVaga = {
        id: Date.now(),
        titulo: document.getElementById('vaga-titulo').value,
        cidade: document.getElementById('vaga-cidade').value,
        uf: "UFPE",
        status: "Vínculo verificado",
        statusCor: "green",
        detalhes: ["1 vaga", "Mobiliado", "Wi-Fi"],
        preco: document.getElementById('vaga-preco').value,
        imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500",
        descricao: document.getElementById('vaga-desc').value,
        contato: appState.usuario.nome
    };

    appState.moradias.unshift(novaVaga);
    alert('Vaga publicada com sucesso!');
    navegarPara('inicio');
}

// 7. TELAS SECUNDÁRIAS (AVALIAÇÕES & CONFIGURAÇÕES)
function renderizarAvaliacoes(container) {
    container.innerHTML = `
        <div style="background:white; padding:25px; border-radius:16px;">
            <h3 style="margin-bottom:15px;">Avaliações e Recomendações</h3>
            <div style="border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:10px;">
                <strong style="font-size:14px;">Lucas Medeiros (UFRN)</strong>
                <p style="font-size:12px; color:#64748b;">"Excelente colega de apartamento! Muito organizada e responsável com as contas." ★★★★★</p>
            </div>
        </div>
    `;
}

function renderizarConfiguracoes(container) {
    container.innerHTML = `
        <div style="background:white; padding:25px; border-radius:16px;">
            <h3 style="margin-bottom:15px;">Configurações da Conta</h3>
            <label style="display:flex; align-items:center; gap:10px; font-size:13px; cursor:pointer;">
                <input type="checkbox" checked> Receber alertas por e-mail de novas vagas compatíveis
            </label>
        </div>
    `;
}

// 8. TELA EMERGÊNCIA E SEGURANÇA
function renderizarEmergencia(container) {
    const servicos = [
        { numero: '190', nome: 'Polícia Militar', desc: 'Crimes em andamento, ameaças e situações de risco imediato.', icone: 'fa-shield-halved', cor: '#1d4ed8', fundo: '#eff6ff' },
        { numero: '180', nome: 'Central de Atendimento à Mulher', desc: 'Violência, assédio e orientação. Gratuito e 24h.', icone: 'fa-venus', cor: '#be185d', fundo: '#fdf2f8' },
        { numero: '100', nome: 'Direitos Humanos', desc: 'Disque 100: denúncias de violações de direitos humanos.', icone: 'fa-hand-holding-heart', cor: '#7c3aed', fundo: '#f5f3ff' },
        { numero: '192', nome: 'SAMU', desc: 'Emergências médicas e atendimento de urgência.', icone: 'fa-truck-medical', cor: '#dc2626', fundo: '#fef2f2' }
    ];

    const passos = [
        {
            icone: 'fa-person-walking-arrow-right',
            titulo: 'Priorize sua segurança física',
            itens: [
                'Saia do local e vá para um lugar seguro e movimentado (portaria, loja, campus).',
                'Se houver risco imediato, ligue <strong>190</strong> sem hesitar.',
                'Avise alguém de confiança (amigo, familiar, colega) e compartilhe sua localização.'
            ]
        },
        {
            icone: 'fa-camera',
            titulo: 'Reúna evidências',
            itens: [
                'Tire prints de conversas, perfis, anúncios e comprovantes de pagamento.',
                'Salve e-mails, áudios, fotos e links. Não apague nada, mesmo que sejam desagradáveis.',
                'Anote data, horário, local e nomes de testemunhas.',
                'Guarde cópias em mais de um lugar (nuvem ou e-mail).'
            ]
        },
        {
            icone: 'fa-file-signature',
            titulo: 'Registre um Boletim de Ocorrência (B.O.)',
            itens: [
                'Vá a uma delegacia (para mulheres, procure a <strong>DEAM</strong>, quando houver na cidade).',
                'Muitos estados têm <strong>Delegacia Virtual</strong> para golpes e fraudes. Procure pelo nome do seu estado.',
                'Leve documento com foto e todas as evidências reunidas.',
                'Peça uma cópia do B.O. e guarde o número do registro.'
            ]
        },
        {
            icone: 'fa-building-columns',
            titulo: 'Procure a Ouvidoria ou o acolhimento da Universidade',
            itens: [
                'Toda universidade possui Ouvidoria. Procure no site da sua instituição.',
                'Muitas têm também núcleos de acolhimento, assistência estudantil ou comissões de combate ao assédio.',
                'Leve o B.O. e as evidências para formalizar o relato.',
                'Para golpes de aluguel, avise também a plataforma onde o anúncio foi publicado.'
            ]
        }
    ];

    const cardsServicos = servicos.map(s => `
        <div style="background:white; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.04); border-top:4px solid ${s.cor}; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:44px; height:44px; border-radius:12px; background:${s.fundo}; color:${s.cor}; display:flex; align-items:center; justify-content:center; font-size:20px;">
                    <i class="fa-solid ${s.icone}"></i>
                </div>
                <div>
                    <div style="font-size:26px; font-weight:800; color:${s.cor}; line-height:1;">${s.numero}</div>
                    <div style="font-size:13px; font-weight:700; color:#1e293b;">${s.nome}</div>
                </div>
            </div>
            <p style="font-size:12px; color:#64748b; line-height:1.5; flex:1;">${s.desc}</p>
            <a href="tel:${s.numero}"
               style="display:flex; align-items:center; justify-content:center; gap:8px; background:${s.cor}; color:white; padding:11px; border-radius:10px; font-weight:700; font-size:13px; transition:0.2s;"
               onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                <i class="fa-solid fa-phone"></i> Ligar para ${s.numero}
            </a>
        </div>
    `).join('');

    const cardsPassos = passos.map((p, i) => `
        <div style="display:flex; gap:16px; background:white; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="width:38px; height:38px; border-radius:50%; background:#2563eb; color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px;">${i + 1}</div>
                <i class="fa-solid ${p.icone}" style="color:#93c5fd; font-size:18px;"></i>
            </div>
            <div style="flex:1;">
                <h4 style="font-size:15px; color:#1e293b; margin-bottom:8px;">${p.titulo}</h4>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:6px;">
                    ${p.itens.map(item => `
                        <li style="font-size:13px; color:#475569; line-height:1.5; display:flex; gap:8px; align-items:flex-start;">
                            <i class="fa-solid fa-circle-check" style="color:#22c55e; font-size:12px; margin-top:4px;"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <section style="background:linear-gradient(135deg,#991b1b,#ef4444); color:white; border-radius:16px; padding:30px;">
            <h2 style="font-size:26px; margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> Emergência e Segurança</h2>
            <p style="font-size:13px; line-height:1.6; max-width:560px; color:#fee2e2;">
                Telefones públicos de acesso rápido e um guia de orientação para estudantes.
                Se você está em perigo agora, <strong>ligue 190</strong>.
            </p>
        </section>

        <section>
            <h3 style="font-size:16px; color:#1e293b; margin-bottom:12px;"><i class="fa-solid fa-phone-volume"></i> Ligue agora</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:15px;">
                ${cardsServicos}
            </div>
        </section>

        <section style="display:flex; flex-direction:column; gap:12px;">
            <h3 style="font-size:16px; color:#1e293b;"><i class="fa-solid fa-list-check"></i> O que fazer em caso de assédio ou fraude</h3>
            ${cardsPassos}
        </section>

        <section style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:18px; display:flex; gap:12px; align-items:flex-start;">
            <i class="fa-solid fa-circle-info" style="color:#2563eb; font-size:20px; margin-top:2px;"></i>
            <p style="font-size:12px; color:#1e3a8a; line-height:1.6;">
                O ConectaUni <strong>não recebe denúncias</strong> por aqui. Esta página apenas orienta e reúne contatos oficiais.
                Os números 190, 180, 100 e 192 são gratuitos. Em caso de golpe de aluguel, nunca pague adiantado sem visitar o imóvel e confirmar o contrato.
            </p>
        </section>
    `;
}

// 9. TELA CARTEIRA DE ESTUDANTE (POR ESTADO)
// Links oficiais por capital, conforme documento enviado.
// Para adicionar um novo estado, basta incluir um objeto neste array.
const carteiraEstados = [
    {
        sigla: 'AL', estado: 'Alagoas', capital: 'Maceió',
        portal: 'Vamu Mobilidade',
        beneficio: 'Passe Livre e créditos estudantis',
        desc: 'Cadastro e recadastro feitos pelo portal Vamu Mobilidade ou pelo aplicativo Vamu Escolar.',
        link: 'https://vamumobilidade.com.br/cadastro-e-recadastro-estudantil/'
    },
    {
        sigla: 'BA', estado: 'Bahia', capital: 'Salvador',
        portal: 'SalvadorCARD',
        beneficio: 'Meia Passagem Estudantil',
        desc: 'Agendamento e controle da Meia Passagem Estudantil pelo Portal de Agendamento do SalvadorCARD.',
        link: 'https://www1.salvadorcard.com.br/servicos/estudante/agendamento1ViaPrincipal.jsf'
    },
    {
        sigla: 'CE', estado: 'Ceará', capital: 'Fortaleza',
        portal: 'Identidade Estudantil (Etufor)',
        beneficio: 'Identidade estudantil e biometria',
        desc: 'Solicitações virtuais de biometria e emissão da identidade estudantil gerenciadas pela Etufor.',
        link: 'https://idestudantil.fortaleza.ce.gov.br/'
    },
    {
        sigla: 'MA', estado: 'Maranhão', capital: 'São Luís',
        portal: 'UMES São Luís',
        beneficio: 'Cartão de transporte e meia-entrada',
        desc: 'O cartão de transporte é controlado na plataforma Cartão Estudantil SLZ - SET. Para meia-entrada local, a emissão também é feita pela UMES São Luís.',
        link: 'https://www.umesslz.com/'
    },
    {
        sigla: 'PB', estado: 'Paraíba', capital: 'João Pessoa',
        portal: 'EstudantePB',
        beneficio: 'Carteira unificada',
        desc: 'Solicitação online da carteira unificada do estado pelo portal oficial EstudantePB.',
        link: 'https://www.estudantepb.com.br/'
    },
    {
        sigla: 'PE', estado: 'Pernambuco', capital: 'Recife',
        portal: 'Portal do Estudante CIE-PE',
        beneficio: 'Desconto no cartão VEM',
        desc: 'No Grande Recife, a CIE-PE é obrigatória para liberar o desconto no cartão VEM.',
        link: 'https://estudante.ciepe.com.br/'
    },
    {
        sigla: 'PI', estado: 'Piauí', capital: 'Teresina',
        portal: 'Transmobi Benefícios',
        beneficio: 'Carteira de transporte estudantil',
        desc: 'Atualização cadastral e requisição da carteira vinculada ao SETUT pelo portal Transmobi Benefícios.',
        link: 'https://transmobi.com.br/para-estudantes/'
    },
    {
        sigla: 'RN', estado: 'Rio Grande do Norte', capital: 'Natal',
        portal: 'Portal do Estudante NuBus',
        beneficio: 'Chip de transporte e clube de vantagens',
        desc: 'Emissão eletrônica da carteira com chip de transporte unificado e clube de vantagens, pelo portal ou pelo aplicativo NuBus.',
        link: 'https://www.nubusnatal.com.br/estudante.html'
    },
    {
        sigla: 'SE', estado: 'Sergipe', capital: 'Aracaju',
        portal: 'Portal do Usuário AracajuCard',
        beneficio: 'Cartão Mais Aracaju Escolar',
        desc: 'Envio de documentos para o cartão Mais Aracaju Escolar pelo Portal do Usuário AracajuCard.',
        link: 'https://aracajucard.com.br/escolar/cadastramento/'
    }
];

// Estados que ainda não têm link cadastrado (aparecem como "em breve")
const carteiraEstadosPendentes = [
    'AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO',
    'DF', 'GO', 'MT', 'MS',
    'ES', 'MG', 'RJ', 'SP',
    'PR', 'RS', 'SC'
];

function renderizarCarteira(container) {
    container.innerHTML = `
        <section style="background:linear-gradient(135deg,#1e3a8a,#3b82f6); color:white; border-radius:16px; padding:28px; position:relative; overflow:hidden;">
            <i class="fa-regular fa-id-card" style="position:absolute; right:24px; top:50%; transform:translateY(-50%) rotate(-8deg); font-size:90px; opacity:0.15;"></i>
            <h2 style="font-size:24px; margin-bottom:6px;"><i class="fa-regular fa-id-card"></i> Carteira de Estudante</h2>
            <p style="font-size:13px; color:#dbeafe; max-width:540px; line-height:1.6;">
                Escolha o seu estado e acesse o portal oficial da capital para emitir sua carteira. Ela garante meia passagem no transporte e outros benefícios locais.
            </p>
        </section>

        <section class="search-box">
            <div class="input-group">
                <label>Buscar estado ou capital</label>
                <input type="text" id="carteira-busca" placeholder="Ex: Pernambuco, Natal, RN..." oninput="filtrarCarteira()">
            </div>
        </section>

        <section id="carteira-lista" style="display:flex; flex-direction:column; gap:20px;"></section>

        <section style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:18px; display:flex; gap:12px; align-items:flex-start;">
            <i class="fa-solid fa-circle-info" style="color:#2563eb; font-size:20px; margin-top:2px;"></i>
            <p style="font-size:12px; color:#1e3a8a; line-height:1.6;">
                Os links levam a sites oficiais de transporte e entidades estudantis. Cada cidade tem suas regras, prazos e documentos exigidos,
                então confira as instruções no próprio portal antes de iniciar o cadastro.
            </p>
        </section>
    `;
    filtrarCarteira();
}

function filtrarCarteira() {
    const termo = (document.getElementById('carteira-busca')?.value || '').toLowerCase().trim();
    const lista = document.getElementById('carteira-lista');
    if (!lista) return;

    const filtrados = carteiraEstados.filter(e =>
        !termo ||
        e.estado.toLowerCase().includes(termo) ||
        e.sigla.toLowerCase().includes(termo) ||
        e.capital.toLowerCase().includes(termo) ||
        e.portal.toLowerCase().includes(termo)
    );

    const pendentes = carteiraEstadosPendentes.filter(s => !termo || s.toLowerCase().includes(termo));

    if (filtrados.length === 0 && pendentes.length === 0) {
        lista.innerHTML = `<p style="text-align:center; color:#64748b; padding:20px;">Nenhum estado encontrado.</p>`;
        return;
    }

    const cardsHTML = filtrados.map(e => `
        <div style="background:white; border-radius:14px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04); display:flex; flex-direction:column; gap:10px; border-top:3px solid #2563eb;">
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:44px; height:44px; border-radius:12px; background:#eff6ff; color:#2563eb; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center;">${e.sigla}</div>
                <div>
                    <strong style="font-size:14px; color:#1e293b; display:block;">${e.estado}</strong>
                    <span style="font-size:11px; color:#64748b;"><i class="fa-solid fa-location-dot"></i> ${e.capital}</span>
                </div>
            </div>
            <span style="background:#dcfce7; color:#166534; font-size:11px; font-weight:600; padding:4px 10px; border-radius:12px; width:fit-content;">
                <i class="fa-solid fa-ticket"></i> ${e.beneficio}
            </span>
            <p style="font-size:12px; color:#64748b; line-height:1.5; flex:1;">${e.desc}</p>
            <a href="${e.link}" target="_blank" rel="noopener noreferrer"
               style="display:flex; align-items:center; justify-content:center; gap:8px; background:#2563eb; color:white; padding:10px; border-radius:8px; font-size:12px; font-weight:600; transition:0.2s;"
               onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                Acessar ${e.portal} <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    `).join('');

    const pendentesHTML = pendentes.length === 0 ? '' : `
        <div style="background:white; border-radius:14px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <h4 style="font-size:13px; color:#1e293b; margin-bottom:4px;"><i class="fa-regular fa-clock"></i> Outros estados</h4>
            <p style="font-size:12px; color:#64748b; margin-bottom:12px;">Links oficiais em breve.</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${pendentes.map(s => `<span style="background:#f1f5f9; color:#94a3b8; font-size:12px; font-weight:600; padding:6px 12px; border-radius:8px;">${s}</span>`).join('')}
            </div>
        </div>
    `;

    lista.innerHTML = `
        ${filtrados.length ? `
        <div>
            <h3 style="font-size:14px; color:#1e3a8a; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-circle-check" style="color:#22c55e;"></i> Links disponíveis (${filtrados.length})
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:14px;">${cardsHTML}</div>
        </div>` : ''}
        ${pendentesHTML}
    `;
}


// MODAL E INTERAÇÕES DIVERSAS
function abrirModal(id) {
    const item = appState.moradias.find(m => m.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-detalhes');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <button class="modal-close" onclick="fecharModal()">&times;</button>
        <img src="${item.imagem}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:15px;" onerror="this.onerror=null; this.src=IMG_PADRAO">
        <span class="badge-status badge-green" style="margin-bottom:10px;">
            <span class="status-dot green"></span> ${esc(item.status)}
        </span>
        <h3 style="font-size:18px; margin-bottom:5px;">${esc(item.titulo)}</h3>
        <p style="color:#64748b; font-size:13px; margin-bottom:10px;">${esc(item.cidade)}</p>
        <p style="font-size:13px; color:#334155; margin-bottom:15px;">${esc(item.descricao)}</p>
        <p style="font-weight:bold; font-size:16px; margin-bottom:15px;">${esc(item.preco)}</p>
        <button class="btn-primary" style="width:100%;" onclick="iniciarChatCom(${item.id})">Entrar em Contato com ${esc(item.contato)}</button>
    `;

    modal.classList.add('active');
}

function fecharModal() {
    document.getElementById('modal-detalhes').classList.remove('active');
}

function iniciarChatCom(idMoradia) {
    const moradia = appState.moradias.find(m => m.id === idMoradia);
    fecharModal();
    if (!moradia) return navegarPara('mensagens');

    // "Carlos Silva (UFPE)" -> "Carlos Silva" | "Residencial X - 8499..." -> "Residencial X"
    const nome = String(moradia.contato).split(/ \(| - /)[0].trim();
    let id = Object.keys(appState.conversas).find(k => appState.conversas[k].nome.toLowerCase() === nome.toLowerCase());
    if (!id) {
        id = String(Date.now());
        appState.conversas[id] = { nome, avatar: avatarIniciais(nome), naoLidas: 0, mensagens: [] };
        salvarEstado();
    }
    appState.chatAtivo = id;
    navegarPara('mensagens');
}

function toggleFavorito(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
        icon.className = 'fa-solid fa-heart';
    } else {
        icon.className = 'fa-regular fa-heart';
    }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarInterfaceUsuario();
    navegarPara('inicio');
});