// SOBRE O PROJETO (Extensão III), REDE E CONECTIVIDADE (TCP/IP) E DOSSIÊ EM PDF
// Carregado depois do auth.js (usa lerLS, gravarLS, esc e appState).

// ---------- helpers de diagramas SVG ----------
const T = (x, y, s, t, o = '') => `<text x="${x}" y="${y}" font-size="${s}" ${o}>${t}</text>`;
function caixa(x, y, w, titulo, linhas, cor = '#2563eb') {
    const h = 30 + linhas.length * 15;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="${cor}" stroke-width="1.5"/>` +
        `<path d="M${x} ${y + 24}V${y + 6}a6 6 0 0 1 6-6H${x + w - 6}a6 6 0 0 1 6 6V${y + 24}Z" fill="${cor}"/>` +
        T(x + w / 2, y + 16, 12, titulo, 'text-anchor="middle" font-weight="700" fill="#fff"') +
        linhas.map((l, i) => T(x + 8, y + 40 + i * 15, 10.5, l, 'fill="#334155"')).join('');
}
function ligar(pts, rot, lx, ly, tracejada) {
    return `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#64748b" stroke-width="1.3"${tracejada ? ' stroke-dasharray="5 4"' : ''}/>` +
        (rot ? T(lx, ly, 10, rot, 'fill="#1e3a8a" font-style="italic"') : '');
}
const svg = (w, h, corpo) => `<div class="svg-box"><svg viewBox="0 0 ${w} ${h}" width="${w}" style="max-width:100%; height:auto;" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Arial, sans-serif">${corpo}</svg></div>`;

function diagramaCasosDeUso() {
    const esq = ['Criar conta / Entrar', 'Buscar moradia (filtros)', 'Favoritar moradias', 'Conversar com anunciante', 'Avaliar moradia ou colega',
        'Dividir despesas', 'Consultar carteira de estudante', 'Consultar Emergência e Segurança', 'Diagnóstico de rede Wi-Fi'];
    const dir = ['Cadastrar local parceiro', 'Excluir anúncios', 'Gerenciar usuários'];
    const elipse = (cx, cy, t) => `<ellipse cx="${cx}" cy="${cy}" rx="105" ry="19" fill="#eff6ff" stroke="#2563eb"/>` + T(cx, cy + 4, 10, t, 'text-anchor="middle" fill="#1e3a8a"');
    const ator = (x, nome) => `<circle cx="${x}" cy="215" r="10" fill="none" stroke="#1e293b" stroke-width="1.5"/><path d="M${x} 225V255M${x - 18} 235H${x + 18}M${x} 255l-15 25M${x} 255l15 25" stroke="#1e293b" stroke-width="1.5" fill="none"/>` + T(x, 298, 12, nome, 'text-anchor="middle" font-weight="700"');
    const ys = esq.map((_, i) => 70 + i * 46);
    return svg(900, 500,
        `<rect x="170" y="10" width="590" height="455" rx="10" fill="#f8fafc" stroke="#94a3b8"/>` + T(465, 32, 13, 'Sistema ConectaUni', 'text-anchor="middle" font-weight="700" fill="#1e3a8a"') +
        esq.map((t, i) => `<line x1="98" y1="235" x2="230" y2="${ys[i]}" stroke="#94a3b8"/>`).join('') +
        dir.map((t, i) => `<line x1="812" y1="235" x2="725" y2="${160 + i * 100}" stroke="#94a3b8"/>`).join('') +
        esq.map((t, i) => elipse(335, ys[i], t)).join('') + dir.map((t, i) => elipse(620, 160 + i * 100, t)).join('') +
        ator(80, 'Estudante') + ator(830, 'Administrador') +
        ligar([[830, 306], [830, 488], [80, 488], [80, 306]], 'herda (o Administrador também é Estudante)', 330, 482, true));
}

function diagramaClasses() {
    return svg(900, 530,
        ligar([[155, 50], [155, 16], [790, 16], [790, 50]], 'participa', 450, 11) +
        ligar([[155, 280], [155, 215]], 'herda', 162, 252) + ligar([[270, 95], [360, 95]], 'favorita N:N', 276, 88) +
        ligar([[270, 300], [330, 300], [330, 140], [360, 140]], 'cadastra', 274, 294) + ligar([[270, 170], [310, 170], [310, 265], [360, 265]], 'escreve', 272, 164) +
        ligar([[480, 170], [480, 230]], 'recebe 1..*', 486, 203) + ligar([[270, 200], [295, 200], [295, 410], [360, 410]], 'recebe', 300, 426) +
        ligar([[790, 110], [790, 170]], '1..* mensagens', 796, 144) + ligar([[40, 120], [20, 120], [20, 440], [40, 440]], 'usa', 2, 290) +
        caixa(40, 50, 230, 'Usuario', ['- id: int', '- nome: String', '- email: String', '- universidade: String', '- curso: String', '- statusVinculo: String', '+ entrar()', '+ sair()', '+ atualizarPerfil()']) +
        caixa(40, 280, 230, 'Administrador', ['+ cadastrarLocal()', '+ excluirAnuncio()', '+ removerUsuario()'], '#dc2626') +
        caixa(40, 420, 230, 'DivisaoDespesas', ['- aluguel, condominio', '- agua, luz, internet', '- moradores: int', '+ calcular(): double'], '#0f766e') +
        caixa(360, 50, 240, 'Moradia', ['- id: int', '- titulo, tipo: String', '- cidade, bairro: String', '- preco: double', '- status: String', '- imagem: String']) +
        caixa(360, 230, 240, 'Avaliacao', ['- nota: int (1 a 5)', '- texto: String', '- data: Date', '+ publicar()']) +
        caixa(360, 380, 240, 'Notificacao', ['- texto: String', '- lida: boolean', '+ marcarLida()']) +
        caixa(690, 50, 200, 'Conversa', ['- id: int', '- participantes: Usuario[]'], '#7c3aed') +
        caixa(690, 170, 200, 'Mensagem', ['- remetente: Usuario', '- texto: String', '- enviadaEm: Date'], '#7c3aed'));
}

function diagramaMER() {
    return svg(900, 500,
        ligar([[140, 150], [140, 14], [760, 14], [760, 20]], 'participa 1:N', 420, 10) + ligar([[250, 170], [340, 70]], 'anuncia 1:N', 262, 108) +
        ligar([[250, 200], [340, 220]], '1:N', 288, 200) + ligar([[455, 190], [455, 140]], 'N:1', 461, 168) + ligar([[250, 250], [340, 330]], '1:N', 286, 296) +
        ligar([[760, 110], [760, 170]], '1:N', 766, 144) + ligar([[250, 262], [260, 262], [260, 480], [760, 480], [760, 395]], 'recebe 1:N', 440, 474) +
        ligar([[140, 270], [140, 330]], '1:N', 146, 304) +
        caixa(30, 150, 220, 'USUARIO', ['PK id', 'nome', 'email (único)', 'senha_hash, sal', 'universidade, curso, periodo', 'perfil (aluno/admin)']) +
        caixa(340, 20, 230, 'MORADIA', ['PK id', 'FK dono_id', 'titulo, tipo', 'cidade, bairro, uf_universidade', 'preco', 'status, descricao, imagem'], '#0f766e') +
        caixa(340, 190, 230, 'FAVORITO', ['PK/FK usuario_id', 'PK/FK moradia_id'], '#0f766e') +
        caixa(340, 300, 230, 'AVALIACAO', ['PK id', 'FK usuario_id', 'FK moradia_id (opcional)', 'nota (1 a 5), texto'], '#0f766e') +
        caixa(650, 20, 220, 'CONVERSA', ['PK id', 'FK usuario_a', 'FK usuario_b', 'FK moradia_id'], '#7c3aed') +
        caixa(650, 170, 220, 'MENSAGEM', ['PK id', 'FK conversa_id', 'FK remetente_id', 'texto, enviada_em'], '#7c3aed') +
        caixa(650, 320, 220, 'NOTIFICACAO', ['PK id', 'FK usuario_id', 'texto, lida, criada_em'], '#7c3aed') +
        caixa(30, 330, 220, 'DESPESA', ['PK id', 'FK usuario_id', 'aluguel, condominio', 'agua, luz, internet', 'moradores'], '#dc2626'));
}

// ---------- diagramas de sequência, wireframes e topologia de rede ----------
function sequencia(atores, msgs) {
    const n = atores.length, X = i => 100 + i * 210, W = 200 + 210 * (n - 1), H = 80 + msgs.length * 40;
    const topo = atores.map((a, i) => `<rect x="${X(i) - 75}" y="8" width="150" height="30" rx="6" fill="#2563eb"/>` + T(X(i), 28, 11.5, a, 'text-anchor="middle" fill="#fff" font-weight="700"') +
        `<line x1="${X(i)}" y1="38" x2="${X(i)}" y2="${H - 10}" stroke="#94a3b8" stroke-dasharray="4 4"/>`).join('');
    const setas = msgs.map(([de, para, txt, ret], k) => {
        const y = 70 + k * 40, a = X(de), b = X(para), cor = '#475569', ext = ` stroke="${cor}" stroke-width="1.4" fill="none" marker-end="url(#seta)"${ret ? ' stroke-dasharray="5 4"' : ''}`;
        if (de === para) return `<path d="M${a} ${y}h42v20h-40"${ext}/>` + T(a + 50, y + 14, 10.5, `${k + 1}. ${txt}`, 'fill="#1e3a8a"');
        return `<line x1="${a}" y1="${y}" x2="${b + (b > a ? -2 : 2)}" y2="${y}"${ext}/>` + T((a + b) / 2, y - 6, 10.5, `${k + 1}. ${txt}`, 'text-anchor="middle" fill="#1e3a8a"');
    }).join('');
    return svg(W, H, '<defs><marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>' + topo + setas);
}
function diagramasSequencia() {
    const h = t => `<h4 style="margin:10px 0 4px; font-size:13px; color:#1e3a8a;">${t}</h4>`;
    return h('1. Login do estudante') + sequencia(['Estudante', 'Interface', 'Autenticação', 'Armazenamento'], [
        [0, 1, 'informa e-mail e senha'], [1, 2, 'valida credenciais'], [2, 3, 'busca conta e hash'], [3, 2, 'dados da conta', 1],
        [2, 2, 'compara o hash SHA-256'], [2, 1, 'sessão iniciada', 1], [1, 0, 'exibe a tela inicial', 1]]) +
        h('2. Buscar moradia e conversar com o anunciante') + sequencia(['Estudante', 'Interface', 'Moradias', 'Mensagens'], [
        [0, 1, 'informa os filtros'], [1, 2, 'filtra cidade, tipo e preço'], [2, 1, 'lista de resultados', 1], [1, 0, 'exibe os cartões', 1],
        [0, 1, 'abre os detalhes e contata'], [1, 3, 'inicia a conversa'], [3, 0, 'mostra as mensagens', 1]]) +
        h('3. Administrador cadastra um local parceiro') + sequencia(['Administrador', 'Interface', 'Moradias', 'Armazenamento'], [
        [0, 1, 'preenche o formulário do local'], [1, 1, 'confere o perfil de administrador'], [1, 2, 'cria o anúncio'], [2, 3, 'grava o anúncio'],
        [3, 1, 'confirmação', 1], [1, 0, 'informa que foi publicado', 1]]);
}
function wireframes() {
    const r = (x, y, w, h, t = '', o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${o.f || '#fff'}" stroke="#94a3b8"/>` +
        (t ? T(o.c ? x + w / 2 : x + 6, y + h / 2 + 4, 10, t, `fill="${o.k || '#475569'}"${o.c ? ' text-anchor="middle"' : ''}`) : '');
    const moldura = (x, t) => `<rect x="${x}" y="10" width="270" height="410" rx="10" fill="#f8fafc" stroke="#475569" stroke-width="1.5"/><path d="M${x} 36V20a10 10 0 0 1 10-10H${x + 260}a10 10 0 0 1 10 10V36Z" fill="#1e3a8a"/>` + T(x + 135, 28, 12, t, 'text-anchor="middle" fill="#fff" font-weight="700"');
    const azul = { c: 1, f: '#2563eb', k: '#fff' };
    const login = moldura(10, 'Tela 1: Login') + T(145, 90, 17, 'ConectaUni', 'text-anchor="middle" font-weight="700" fill="#1e40af"') + r(35, 110, 220, 28, 'E-mail') + r(35, 148, 220, 28, 'Senha') +
        r(35, 190, 14, 14) + T(56, 201, 10, 'Manter conectado', 'fill="#475569"') + r(35, 220, 220, 32, 'Entrar', azul) + T(145, 280, 10, 'Primeira vez aqui? Criar conta', 'text-anchor="middle" fill="#2563eb"');
    let busca = moldura(315, 'Tela 2: Buscar moradia') + r(325, 46, 250, 24, 'Início | Buscar | Mensagens', { f: '#e2e8f0' }) + r(325, 80, 120, 24, 'Cidade') + r(455, 80, 120, 24, 'Tipo') + r(325, 112, 120, 24, 'Preço máx.') + r(455, 112, 120, 24, 'Buscar', azul);
    for (let i = 0; i < 3; i++) { const y = 148 + i * 88; busca += r(325, y, 250, 80) + r(331, y + 6, 64, 68, 'foto', { f: '#e2e8f0' }) + T(405, y + 26, 11, 'Kitnet Residencial', 'font-weight="700" fill="#1e293b"') + T(405, y + 44, 10, 'Natal, RN - Lagoa Nova', 'fill="#64748b"') + T(405, y + 64, 11, 'R$ 1.130/mês', 'fill="#2563eb" font-weight="700"'); }
    const adm = moldura(620, 'Tela 3: Painel do administrador') + r(630, 46, 58, 364, 'Menu', { f: '#1e3a8a', k: '#fff', c: 1 }) + T(698, 62, 11, 'Cadastrar local', 'font-weight="700" fill="#1e293b"') +
        r(698, 72, 182, 24, 'Nome do estabelecimento') + r(698, 104, 182, 24, 'Tipo e cidade') + r(698, 136, 182, 24, 'Preço e telefone') + r(698, 168, 182, 50, 'Descrição') + r(698, 226, 182, 24, 'Foto (opcional)') +
        r(698, 258, 182, 28, 'Cadastrar local', azul) + T(698, 312, 11, 'Anúncios publicados', 'font-weight="700" fill="#1e293b"') + r(698, 320, 182, 24, 'Kitnet Ponta Verde | Excluir') + r(698, 350, 182, 24, 'República Cordeiro | Excluir');
    return svg(900, 430, login + busca + adm);
}
function diagramaTopologia() {
    return svg(780, 260,
        ligar([[150, 132], [190, 132]]) + ligar([[310, 132], [350, 130]]) + ligar([[500, 112], [530, 112], [530, 57], [560, 57]], 'SSID principal', 506, 106) + ligar([[500, 148], [530, 148], [530, 215], [560, 215]], 'SSID guest', 506, 164) +
        caixa(30, 110, 120, 'Internet', ['Provedor (ISP)'], '#64748b') + caixa(190, 110, 120, 'Modem / ONT', ['Link do provedor'], '#64748b') +
        caixa(350, 98, 150, 'Roteador Wi-Fi', ['WPA3 + firewall', 'DHCP e NAT'], '#dc2626') +
        caixa(560, 20, 190, 'Rede principal', ['Notebooks e computadores', 'Impressora compartilhada', 'Arquivos da entidade'], '#16a34a') +
        caixa(560, 190, 190, 'Rede Guest (isolada)', ['Celulares de visitantes', 'TV e dispositivos IoT'], '#ca8a04'));
}

// ---------- tabelas e textos editáveis ----------
function tabelaEd(ed, pref, cab, linhas, fixas = 0) {
    return `<div class="svg-box"><table class="tabela-rede"><tr>${cab.map(c => `<th>${c}</th>`).join('')}</tr>${linhas.map((l, i) => `<tr>${l.map((c, j) => `<td>${j < fixas ? esc(c) : bloco(ed, pref + i + '_' + j, c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
const linhasTap = (ed, lista) => lista.map(([k, t, p]) => `<div class="tap-linha"><strong>${t}</strong>${bloco(ed, k, p)}</div>`).join('');
const dica = (ed, t) => ed ? `<p class="doc-dica no-print">${t}</p>` : '';

const REQUISITOS = [
    ['RF01', 'Cadastro e login com senha pessoal', 'Funcional', 'Criar conta / Entrar'], ['RF02', 'Busca de moradias com filtros (cidade, universidade, tipo, preço e ordenação)', 'Funcional', 'Buscar moradia'],
    ['RF03', 'Favoritar moradias', 'Funcional', 'Favoritar moradias'], ['RF04', 'Conversar com o anunciante por mensagens', 'Funcional', 'Conversar com anunciante'],
    ['RF05', 'Avaliar moradias e colegas', 'Funcional', 'Avaliar moradia ou colega'], ['RF06', 'Dividir as despesas da moradia', 'Funcional', 'Dividir despesas'],
    ['RF07', 'Consultar os links da carteira de estudante por estado', 'Funcional', 'Consultar carteira de estudante'], ['RF08', 'Consultar telefones de emergência e guia de segurança', 'Funcional', 'Consultar Emergência e Segurança'],
    ['RF09', 'Fazer o diagnóstico de rede Wi-Fi', 'Funcional', 'Diagnóstico de rede Wi-Fi'], ['RF10', 'Administrador cadastra locais de estabelecimentos', 'Funcional', 'Cadastrar local parceiro'],
    ['RF11', 'Administrador gerencia anúncios e usuários', 'Funcional', 'Excluir anúncios / Gerenciar usuários'],
    ['RNF01', 'Senhas guardadas com hash e sal (SHA-256)', 'Não funcional (segurança)', 'Criar conta / Entrar'], ['RNF02', 'Interface responsiva para celular, tablet e computador', 'Não funcional (usabilidade)', 'Todos'],
    ['RNF03', 'Funcionar nos principais navegadores, sem instalação', 'Não funcional (portabilidade)', 'Todos'], ['RNF04', 'Dados mantidos entre acessos (localStorage e backup)', 'Não funcional (disponibilidade)', 'Todos'],
    ['RNF05', 'Acesso restrito por perfil (aluno e administrador)', 'Não funcional (segurança)', 'Gerenciar usuários'], ['RNF06', 'Textos claros em português e bom contraste', 'Não funcional (acessibilidade)', 'Todos']
];
const RELACIONAL = `USUARIO (id PK, nome, email UNIQUE, senha_hash, sal, universidade, curso, periodo, perfil, vinculo_status, criado_em)
MORADIA (id PK, dono_id FK -> USUARIO.id, titulo, tipo, cidade, bairro, uf_universidade, preco, descricao, imagem_url, status, criada_em)
FAVORITO (usuario_id PK/FK -> USUARIO.id, moradia_id PK/FK -> MORADIA.id)
AVALIACAO (id PK, usuario_id FK -> USUARIO.id, moradia_id FK -> MORADIA.id (anulável), sobre, nota, texto, criada_em)
CONVERSA (id PK, usuario_a FK -> USUARIO.id, usuario_b FK -> USUARIO.id, moradia_id FK -> MORADIA.id (anulável))
MENSAGEM (id PK, conversa_id FK -> CONVERSA.id, remetente_id FK -> USUARIO.id, texto, enviada_em)
NOTIFICACAO (id PK, usuario_id FK -> USUARIO.id, texto, lida, criada_em)
DESPESA (id PK, usuario_id FK -> USUARIO.id, aluguel, condominio, agua, luz, internet, moradores)
CARTEIRA_ESTUDANTE (uf PK, estado, capital, portal, url)

Normalização
1FN: todas as colunas guardam valores atômicos. Listas (favoritos, mensagens) viraram tabelas próprias.
2FN: FAVORITO tem chave composta e nenhum outro atributo. Nas demais tabelas a chave é um único campo, sem dependência parcial.
3FN: os dados do anunciante ficam só em USUARIO (MORADIA guarda apenas dono_id) e os dados da carteira por estado ficam em CARTEIRA_ESTUDANTE, sem dependência transitiva.`;
const INOV = [
    ['inov1', 'Proposta de inovação', 'Plataforma única que reúne moradia verificada, carteira estudantil, segurança e conectividade para quem chega a uma nova cidade.'],
    ['inov2', 'Oportunidades identificadas', 'Parcerias com universidades e centros acadêmicos, locais verificados, guias de segurança e expansão para outros estados.'],
    ['inov3', 'Viabilidade financeira', 'Custo inicial baixo (hospedagem estática). Receita futura com planos para estabelecimentos parceiros e apoio institucional.'],
    ['inov4', 'Indicadores de impacto', 'Estudantes atendidos, locais verificados, golpes evitados relatados e satisfação medida na validação.'],
    ['inov5', 'Sustentabilidade operacional', 'Equipe de extensão que se renova a cada semestre, documentação aberta e apoio da universidade.']
];
const CRONO = [
    ['Etapa 1', 'Alinhamento de escopo e TAP', 'Gerência de Projetos e Empreendedorismo', '[Semana __]'], ['Etapa 1', 'Imersão comunitária e diagnóstico tecnológico e de redes', 'Arquitetura TCP/IP e Análise OO', '[Semana __]'],
    ['Etapa 1', 'Modelagem conceitual e casos de uso', 'Análise OO e Banco de Dados I', '[Semana __]'], ['Etapa 1', 'Validação dos requisitos e modelo lógico de dados', 'Banco de Dados I e Gerência de Projetos', '[Semana __]'],
    ['Etapa 2', 'Prototipagem de telas e plano de conectividade', 'Análise OO e Arquitetura TCP/IP', '[Semana __]'], ['Etapa 2', 'Modelo de sustentabilidade e treinamento do usuário', 'Empreendedorismo e Gerência de Projetos', '[Semana __]'],
    ['Etapa 2', 'Validação prática e testes na comunidade', 'Integração interdisciplinar', '[Semana __]'], ['Etapa 2', 'Seminário de apresentação e entrega de evidências', 'Avaliação formativa e extensionista', '[Semana __]']
];
const RISCOS = [
    ['Entidade parceira indisponível para as reuniões', 'Média', 'Alto', 'Agendar com antecedência e ter uma entidade alternativa'], ['Medições de rede incompletas', 'Média', 'Médio', 'Repetir os testes em horários diferentes'],
    ['Atraso nas entregas', 'Média', 'Alto', 'Cronograma semanal e revisão com o orientador'], ['Perda de dados do protótipo (localStorage)', 'Baixa', 'Médio', 'Backup em arquivo .json'],
    ['Baixa adesão ao treinamento', 'Média', 'Médio', 'Material simples e sessão presencial curta'], ['Golpes ou mau uso da plataforma', 'Baixa', 'Alto', 'Perfil de administrador e orientações de segurança']
];
const COMUNIC = [
    ['Entidade parceira', 'Reuniões presenciais e mensagens', 'Quinzenal', '[Responsável]'], ['Professor orientador', 'E-mail e reuniões de acompanhamento', 'Semanal', '[Responsável]'],
    ['Equipe do projeto', 'Grupo de mensagens', 'Diária, conforme a demanda', '[Responsável]'], ['Estudantes (usuários)', 'Site, redes sociais e murais', 'Mensal', '[Responsável]']
];
const MEDICOES = [
    ['Velocidade contratada', '[Mbps]', ''], ['Download medido', '[Mbps]', ''], ['Upload medido', '[Mbps]', ''], ['Latência (ping)', '[ms]', ''],
    ['Dispositivos conectados', '[quantidade]', ''], ['Cobertura do Wi-Fi', '[locais sem sinal]', ''], ['Compartilhamento de recursos', '[impressora, arquivos]', ''], ['Segurança do Wi-Fi', '[WPA2/WPA3, rede Guest]', '']
];
const DIAGLOCAL = [['dl1', 'Local avaliado', '[Nome da entidade e endereço]'], ['dl2', 'Acesso à internet e acessibilidade', '[Todos os usuários conseguem acessar? Há computadores ou Wi-Fi para os atendidos?]'],
    ['dl3', 'Problemas encontrados', '[Descreva]'], ['dl4', 'Recomendações para a entidade', '[Descreva]']];
const VALID = [['Facilidade de uso', '[1 a 5]', ''], ['Clareza das informações', '[1 a 5]', ''], ['Utilidade para a entidade', '[1 a 5]', ''], ['Segurança e confiança', '[1 a 5]', ''], ['Sugestões de melhoria', '-', '']];
const ATA = [['val_a1', 'Data e local', '[__/__/____, local da reunião]'], ['val_a2', 'Participantes', '[Nomes e funções]'], ['val_a3', 'O que foi apresentado', 'Protótipo do site, modelo de banco de dados e plano de melhoria da rede.'],
    ['val_a4', 'Feedback técnico', '[Registre]'], ['val_a5', 'Feedback social', '[Registre]'], ['val_a6', 'Encaminhamentos', '[Registre]']];
const TUTORIAL = [
    ['1. Criar conta e entrar', ['Abra o site e clique em "Criar conta".', 'Preencha nome, universidade, curso, e-mail e uma senha de 6 ou mais caracteres.', 'Entre com o e-mail e a senha. Marque "Manter conectado" só no seu computador.']],
    ['2. Buscar e filtrar moradias', ['Use Início ou "Buscar moradia".', 'Filtre por cidade ou sigla (ex.: RN), universidade, tipo e preço máximo.', 'Ordene por preço e clique em "Ver detalhes".']],
    ['3. Favoritar e conversar', ['Clique no coração do cartão para favoritar.', 'Em "Ver detalhes", use "Entrar em Contato".', 'Acompanhe as respostas em "Mensagens".']],
    ['4. Dividir despesas e avaliar', ['Em "Divisão de despesas", informe aluguel, contas e número de moradores.', 'Em "Avaliações", escolha a nota e escreva um comentário.']],
    ['5. Carteira, emergência e rede', ['Em "Carteira de estudante", ache seu estado e abra o portal oficial.', 'Em "Emergência e Segurança", use os botões de ligar e siga o guia.', 'Em "Rede e Conectividade", marque o diagnóstico da sua rede.']],
    ['6. Para o administrador', ['Entre com a conta de administrador e abra o "Painel ADM".', 'Preencha os dados do estabelecimento e clique em "Cadastrar local".', 'Confira o anúncio na busca e exclua anúncios, se precisar.']]
];
function medirConexao() {
    const c = navigator.connection;
    if (!c) return alert('Este navegador não informa a medição. Use o Chrome ou o Edge, ou preencha manualmente.');
    salvarDoc('med1_1', `${c.downlink} Mbps (estimativa do navegador)`);
    salvarDoc('med3_1', `${c.rtt} ms (estimativa do navegador)`);
    renderizarRede(document.getElementById('main-content'));
}
function diagnosticoLocal(ed) {
    return `<h3>Diagnóstico de rede da entidade (topologia e medições)</h3>${diagramaTopologia()}
        ${dica(ed, 'Preencha as medições feitas no local. O botão usa a estimativa do navegador (só Chrome e Edge).')}
        ${ed ? '<button class="btn-detalhes no-print" style="margin-bottom:8px;" onclick="medirConexao()"><i class="fa-solid fa-gauge-high"></i> Preencher com a medição do navegador</button>' : ''}
        ${tabelaEd(ed, 'med', ['Item avaliado', 'Resultado', 'Observação'], MEDICOES, 1)}${linhasTap(ed, DIAGLOCAL)}`;
}

const SQL_SCRIPT = `-- ConectaUni: script de criação do banco (MySQL 8). Hoje o protótipo usa localStorage;
-- este é o modelo que seria usado em um servidor real.
CREATE DATABASE IF NOT EXISTS conectauni CHARACTER SET utf8mb4;
USE conectauni;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash CHAR(64) NOT NULL,
  sal VARCHAR(32) NOT NULL,
  universidade VARCHAR(80) NOT NULL,
  curso VARCHAR(100) NOT NULL,
  periodo VARCHAR(30),
  perfil ENUM('aluno','admin') NOT NULL DEFAULT 'aluno',
  vinculo_status ENUM('verificado','pendente','expirado') NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE moradia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dono_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  tipo ENUM('Kitnet','Quarto em apartamento','Quarto em casa compartilhada','Vaga em república') NOT NULL,
  cidade VARCHAR(80) NOT NULL,
  bairro VARCHAR(80),
  uf_universidade VARCHAR(10),
  preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  descricao TEXT,
  imagem_url VARCHAR(255),
  status VARCHAR(40) DEFAULT 'Estabelecimento verificado',
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dono_id) REFERENCES usuario(id)
);

CREATE TABLE favorito (
  usuario_id INT NOT NULL,
  moradia_id INT NOT NULL,
  PRIMARY KEY (usuario_id, moradia_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (moradia_id) REFERENCES moradia(id) ON DELETE CASCADE
);

CREATE TABLE avaliacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  moradia_id INT NULL,
  sobre VARCHAR(120) NOT NULL,
  nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  texto TEXT NOT NULL,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (moradia_id) REFERENCES moradia(id) ON DELETE SET NULL
);

CREATE TABLE conversa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_a INT NOT NULL,
  usuario_b INT NOT NULL,
  moradia_id INT NULL,
  FOREIGN KEY (usuario_a) REFERENCES usuario(id),
  FOREIGN KEY (usuario_b) REFERENCES usuario(id),
  FOREIGN KEY (moradia_id) REFERENCES moradia(id) ON DELETE SET NULL
);

CREATE TABLE mensagem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversa_id INT NOT NULL,
  remetente_id INT NOT NULL,
  texto TEXT NOT NULL,
  enviada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversa_id) REFERENCES conversa(id) ON DELETE CASCADE,
  FOREIGN KEY (remetente_id) REFERENCES usuario(id)
);

CREATE TABLE notificacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  texto VARCHAR(255) NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE despesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  aluguel DECIMAL(10,2) DEFAULT 0,
  condominio DECIMAL(10,2) DEFAULT 0,
  agua DECIMAL(10,2) DEFAULT 0,
  luz DECIMAL(10,2) DEFAULT 0,
  internet DECIMAL(10,2) DEFAULT 0,
  moradores INT NOT NULL DEFAULT 1 CHECK (moradores >= 1),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE carteira_estudante (
  uf CHAR(2) PRIMARY KEY,
  estado VARCHAR(40) NOT NULL,
  capital VARCHAR(40) NOT NULL,
  portal VARCHAR(80) NOT NULL,
  url VARCHAR(255) NOT NULL
);

INSERT INTO carteira_estudante VALUES
  ('RN','Rio Grande do Norte','Natal','Portal do Estudante NuBus','https://www.nubusnatal.com.br/estudante.html');

CREATE INDEX idx_moradia_busca ON moradia (cidade, tipo, preco);`;

function copiarSQL() { navigator.clipboard?.writeText(SQL_SCRIPT).then(() => alert('Script SQL copiado!')); }
function baixarSQL() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([SQL_SCRIPT], { type: 'text/plain' }));
    a.download = 'conectauni.sql';
    a.click();
}

// ---------- textos editáveis (Canvas, TAP) salvos no navegador ----------
const textoDoc = (k, padrao) => lerLS('cu_doc', {})[k] ?? padrao;
const fmt = t => esc(t).replace(/\n/g, '<br>');
function salvarDoc(k, t) { const d = lerLS('cu_doc', {}); d[k] = t; gravarLS('cu_doc', d); }
const bloco = (ed, k, padrao) => `<div class="doc-ed" ${ed ? `contenteditable="true" onblur="salvarDoc('${k}', this.innerText)"` : ''}>${fmt(textoDoc(k, padrao))}</div>`;

const CANVAS = [
    ['valor', 'Proposta de valor', 'Conectar estudantes que se mudam para estudar a moradias seguras, com preço de referência e rede de apoio entre colegas.'],
    ['segmento', 'Público atendido', 'Estudantes universitários vindos de outras cidades e donos de kitnets e repúblicas próximos às universidades.'],
    ['impacto', 'Impacto social', 'Reduz o risco de golpes de aluguel, facilita a permanência estudantil e aproxima calouros de veteranos.'],
    ['parcerias', 'Parcerias-chave', 'Universidades, centros acadêmicos, entidades estudantis, proprietários e órgãos de segurança pública.'],
    ['atividades', 'Atividades-chave', 'Verificar locais parceiros, manter a plataforma, orientar sobre segurança e conectividade, divulgar a carteira estudantil.'],
    ['recursos', 'Recursos-chave', 'Equipe de extensão, plataforma web, base de locais verificados, conteúdo educativo.'],
    ['canais', 'Canais', 'Site, redes sociais dos centros acadêmicos, murais e eventos de recepção de calouros.'],
    ['relacionamento', 'Relacionamento', 'Atendimento por mensagens, avaliações entre usuários e orientações de segurança.'],
    ['sustentabilidade', 'Fontes de sustentabilidade', 'Planos para estabelecimentos parceiros, apoio institucional da universidade, editais de extensão e patrocínio local.'],
    ['custos', 'Custos', 'Hospedagem e domínio, manutenção, divulgação e tempo da equipe.']
];
const TAP = [
    ['tap0', 'Entidade parceira', '[Nome da entidade, responsável, contato e o que ela faz pela comunidade]'],
    ['tap1', 'Título do projeto', 'ConectaUni: plataforma de moradia e apoio para estudantes de outras cidades'],
    ['tap2', 'Justificativa', 'Estudantes que migram para cursar a faculdade enfrentam dificuldade para achar moradia segura e a preço justo.'],
    ['tap3', 'Objetivo geral', 'Desenvolver um protótipo web que conecta estudantes a moradias e a informações de segurança, carteira estudantil e conectividade.'],
    ['tap4', 'Escopo', 'Inclui: busca de moradias, painel do administrador, favoritos, avaliações, divisão de despesas, emergência e rede. Não inclui: pagamentos e contratos online.'],
    ['tap5', 'Premissas e restrições', 'Dados salvos no navegador (localStorage); locais de demonstração; prazo do semestre letivo.'],
    ['tap6', 'Partes interessadas', 'Estudantes, proprietários, universidade, professor orientador, equipe do projeto.'],
    ['tap7', 'Marcos principais', '[Preencha com as datas da sua equipe: levantamento, modelagem, desenvolvimento, testes, apresentação]'],
    ['tap8', 'Equipe e aprovação', '[Nomes dos integrantes, orientador e data de aprovação]']
];
const EAP = [
    ['1. Gerenciamento', ['1.1 Termo de Abertura (TAP)', '1.2 Cronograma e acompanhamento']],
    ['2. Análise e projeto', ['2.1 Casos de uso', '2.2 Diagrama de classes', '2.3 Modelo Entidade-Relacionamento']],
    ['3. Banco de dados', ['3.1 Script SQL de criação', '3.2 Carga de dados de exemplo']],
    ['4. Desenvolvimento', ['4.1 Interface e navegação', '4.2 Login e painel do administrador', '4.3 Busca, favoritos, avaliações e despesas']],
    ['5. Rede e segurança', ['5.1 Diagnóstico de rede Wi-Fi', '5.2 Guia contra golpes e phishing', '5.3 Emergência e Segurança']],
    ['6. Ação de extensão', ['6.1 Divulgação para os estudantes', '6.2 Coleta de evidências (fotos)']],
    ['7. Encerramento', ['7.1 Dossiê em PDF', '7.2 Apresentação final']]
];

// ---------- páginas ----------
const ABAS = [['oo', 'Análise OO', 'fa-diagram-project'], ['bd', 'Banco de Dados', 'fa-database'], ['emp', 'Empreendedorismo', 'fa-lightbulb'], ['gp', 'Gerência de Projetos', 'fa-list-check'], ['trein', 'Treinamento', 'fa-chalkboard-user'], ['val', 'Validação', 'fa-clipboard-check'], ['ev', 'Evidências', 'fa-camera']];

function secao(aba, ed) {
    const sd = (t, h) => `<h3>${t}</h3>${h}`;
    if (aba === 'oo') return sd('Levantamento de requisitos', tabelaEd(false, 'req', ['Código', 'Requisito', 'Tipo', 'Caso de uso relacionado'], REQUISITOS, 4)) + sd('Diagrama de Casos de Uso', diagramaCasosDeUso()) +
        sd('Diagrama de Classes', diagramaClasses()) + sd('Diagramas de Sequência', diagramasSequencia()) + sd('Protótipos de interface (wireframes)', `<p class="doc-dica">O próprio site funciona como protótipo navegável destas telas.</p>${wireframes()}`);
    if (aba === 'bd') return sd('Modelo Entidade-Relacionamento (MER)', diagramaMER()) + sd('Modelo lógico (esquema relacional)', `<pre class="code-box">${esc(RELACIONAL)}</pre>`) +
        sd('Script SQL de criação das tabelas', `${ed ? '<div class="no-print" style="display:flex; gap:8px; margin-bottom:8px;"><button class="btn-detalhes" onclick="copiarSQL()"><i class="fa-regular fa-copy"></i> Copiar</button><button class="btn-detalhes" onclick="baixarSQL()"><i class="fa-solid fa-download"></i> Baixar .sql</button></div>' : ''}<pre class="code-box">${esc(SQL_SCRIPT)}</pre>`);
    const grade = lista => `<div class="canvas-grid">${lista.map(([k, t, p]) => `<div class="canvas-bloco ${['valor', 'impacto', 'sustentabilidade', 'inov1'].includes(k) ? 'destaque' : ''}"><h4>${t}</h4>${bloco(ed, k, p)}</div>`).join('')}</div>`;
    if (aba === 'emp') return sd('Canvas Social do ConectaUni', dica(ed, 'Clique em qualquer bloco para editar. As alterações ficam salvas.') + grade(CANVAS)) + sd('Proposta de inovação e sustentabilidade', grade(INOV));
    if (aba === 'gp') return sd('TAP: Termo de Abertura do Projeto', dica(ed, 'Clique nos textos para editar e complete os campos entre colchetes.') + linhasTap(ed, TAP)) +
        sd('EAP / WBS: Estrutura Analítica do Projeto', `<ul class="eap">${EAP.map(([t, f]) => `<li><strong>${t}</strong><ul>${f.map(x => `<li>${x}</li>`).join('')}</ul></li>`).join('')}</ul>`) +
        sd('Cronograma de entregas', tabelaEd(ed, 'cr', ['Etapa', 'Atividade', 'Foco', 'Período'], CRONO, 3)) + sd('Matriz de riscos', tabelaEd(ed, 'rk', ['Risco', 'Probabilidade', 'Impacto', 'Resposta'], RISCOS)) +
        sd('Plano de comunicação', tabelaEd(ed, 'cm', ['Público', 'Canal', 'Frequência', 'Responsável'], COMUNIC, 3));
    if (aba === 'trein') return sd('Tutorial de uso do ConectaUni', TUTORIAL.map(([t, p]) => `<div class="tap-linha"><strong>${t}</strong><ol class="lista-guia">${p.map(x => `<li>${x}</li>`).join('')}</ol></div>`).join('')) +
        sd('Roteiro da capacitação', bloco(ed, 'trein_rot', 'Duração: [__ minutos]. Público: [descrever]. Atividades: apresentação do site (10 min), prática guiada com cada participante (20 min), dúvidas e feedback (10 min). Material: este tutorial e o site em funcionamento.'));
    if (aba === 'val') return sd('Ficha de validação com a comunidade', dica(ed, 'Preencha com as notas e comentários dos participantes da reunião.') + tabelaEd(ed, 'vl', ['Critério', 'Nota (1 a 5)', 'Comentário'], VALID, 1)) + sd('Ata da reunião de validação', linhasTap(ed, ATA));
    const ev = lerLS('cu_evid', []);
    return `<h3>Evidências fotográficas das ações de extensão</h3>
        ${ed ? '<p class="doc-dica no-print">Envie as fotos das ações. Elas entram automaticamente no dossiê em PDF.</p><input class="no-print" type="file" accept="image/*" multiple onchange="adicionarEvidencias(event)">' : ''}
        ${ev.length ? '' : '<p class="doc-dica">Nenhuma foto adicionada ainda.</p>'}
        <div class="galeria">${ev.map((e, i) => `<figure><img src="${e.src}" alt="Evidência ${i + 1}"><figcaption ${ed ? `contenteditable="true" onblur="legendaEvidencia(${i}, this.innerText)"` : ''}>${esc(e.legenda)}</figcaption>${ed ? `<button class="btn-detalhes no-print" onclick="removerEvidencia(${i})">Remover</button>` : ''}</figure>`).join('')}</div>`;
}

function renderizarProjeto(container) {
    const aba = appState.abaProjeto || 'oo';
    container.innerHTML = `
        <section style="background:linear-gradient(135deg,#1e3a8a,#3b82f6); color:white; border-radius:16px; padding:28px;">
            <h2 style="font-size:24px; margin-bottom:6px;"><i class="fa-solid fa-diagram-project"></i> Sobre o Projeto (Extensão III)</h2>
            <p style="font-size:13px; color:#dbeafe; max-width:560px; line-height:1.6; margin-bottom:14px;">Documentação e arquitetura do ConectaUni: análise orientada a objetos, banco de dados, empreendedorismo e gerência de projetos.</p>
            <button class="btn-cta" style="width:auto; padding:10px 16px; font-size:12px;" onclick="baixarDossie()"><i class="fa-solid fa-file-pdf"></i> Baixar Dossiê de Evidências (PDF)</button>
        </section>
        <div class="abas">${ABAS.map(([k, n, ic]) => `<button class="aba ${k === aba ? 'ativa' : ''}" onclick="abrirAba('${k}')"><i class="fa-solid ${ic}"></i> ${n}</button>`).join('')}</div>
        <div class="card-box">${secao(aba, true)}</div>`;
}
function abrirAba(a) { appState.abaProjeto = a; renderizarProjeto(document.getElementById('main-content')); }

// ---------- evidências (fotos redimensionadas e salvas no navegador) ----------
function adicionarEvidencias(e) {
    [...e.target.files].forEach(f => {
        const r = new FileReader();
        r.onload = ev => {
            const img = new Image();
            img.onload = () => {
                const k = Math.min(1, 800 / img.width), cv = document.createElement('canvas');
                cv.width = img.width * k; cv.height = img.height * k;
                cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
                const lista = lerLS('cu_evid', []);
                lista.push({ src: cv.toDataURL('image/jpeg', 0.7), legenda: f.name.replace(/\.[^.]+$/, '') });
                gravarLS('cu_evid', lista);
                if (appState.paginaAtual === 'projeto') renderizarProjeto(document.getElementById('main-content'));
            };
            img.src = ev.target.result;
        };
        r.readAsDataURL(f);
    });
}
function legendaEvidencia(i, t) { const l = lerLS('cu_evid', []); if (l[i]) { l[i].legenda = t.trim(); gravarLS('cu_evid', l); } }
function removerEvidencia(i) { const l = lerLS('cu_evid', []); l.splice(i, 1); gravarLS('cu_evid', l); renderizarProjeto(document.getElementById('main-content')); }

// ---------- diagnóstico de rede e conectividade (TCP/IP) ----------
const DIAG = [
    'Troquei a senha padrão do painel do roteador (admin/admin).',
    'Uso WPA3 (ou WPA2-AES) com senha de 12 caracteres ou mais.',
    'Desativei o WPS (conexão por botão ou PIN).',
    'Criei uma rede Guest (visitantes) isolada da rede principal.',
    'O firmware do roteador está atualizado.',
    'O nome da rede (SSID) não expõe meu nome nem meu apartamento.',
    'Computadores e impressoras ficam na rede principal; visitantes e TV/IoT na rede Guest.',
    'Em Wi-Fi público uso VPN e só acesso sites com HTTPS (cadeado).'
];
const chaveDiag = () => 'cu_diag_' + appState.email;
function mostrarDiag() {
    const n = lerLS(chaveDiag(), []).length, el = document.getElementById('diag-res');
    if (!el) return;
    const [nivel, cor] = n >= 7 ? ['Rede protegida', '#16a34a'] : n >= 4 ? ['Atenção: faltam ajustes', '#ca8a04'] : ['Risco alto: configure o quanto antes', '#dc2626'];
    el.innerHTML = `<div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; margin:14px 0 6px;"><span style="color:${cor};">${nivel}</span><span>${n} de ${DIAG.length}</span></div>
        <div style="background:#e2e8f0; border-radius:8px; height:10px;"><div style="width:${n / DIAG.length * 100}%; background:${cor}; height:10px; border-radius:8px; transition:0.3s;"></div></div>`;
}
function marcarDiag(i, on) {
    const m = new Set(lerLS(chaveDiag(), []));
    on ? m.add(i) : m.delete(i);
    gravarLS(chaveDiag(), [...m]);
    mostrarDiag();
}

function guiaRede() {
    const sec = (t, itens) => `<h3>${t}</h3><ul class="lista-guia">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
    return sec('Configuração de roteadores Wi-Fi para repúblicas e kitnets', [
        '<strong>Rede Guest isolada:</strong> ative a rede de visitantes e marque a opção de isolamento de clientes (AP isolation), assim visitantes e vizinhos não enxergam seus dispositivos.',
        '<strong>Painel do roteador:</strong> troque usuário e senha de fábrica e desative o acesso remoto (WAN) ao painel.',
        '<strong>Criptografia:</strong> use WPA3-Personal. Se algum aparelho for antigo, use WPA2-AES (nunca WEP nem rede aberta).',
        '<strong>WPS e UPnP:</strong> desative o WPS e o UPnP, que facilitam invasões.',
        '<strong>Divisão em república:</strong> combine uma senha forte, troque-a quando um morador sair e documente quem administra o roteador.',
        '<strong>Posição e canal:</strong> deixe o roteador em local central e alto; use a banda de 5 GHz para estudo e 2,4 GHz para alcance.',
        '<strong>Atualizações:</strong> atualize o firmware a cada poucos meses e ative o firewall do roteador.'
    ]) + sec('Boas práticas de segurança de rede e golpes de aluguel', [
        '<strong>Phishing:</strong> desconfie de links com urgência, descontos absurdos ou pedidos de dados por mensagem. Confira o endereço do site antes de entrar com senha.',
        '<strong>Golpe do aluguel:</strong> nunca pague sinal sem visitar o imóvel, confirmar o dono e assinar contrato. Desconfie de preço muito abaixo do mercado.',
        '<strong>Senhas:</strong> use senhas diferentes por serviço, um gerenciador de senhas e verificação em duas etapas.',
        '<strong>Wi-Fi público:</strong> evite acessar banco ou e-mail sem VPN e sempre confira o HTTPS.',
        '<strong>Atualização dos aparelhos:</strong> mantenha celular e computador atualizados e com antivírus ativo.'
    ]) + `<h3>Camadas do modelo TCP/IP e a segurança</h3><div class="svg-box"><table class="tabela-rede"><tr><th>Camada</th><th>Protocolos</th><th>Risco comum</th><th>Medida recomendada</th></tr>
        <tr><td>Aplicação</td><td>HTTP/HTTPS, DNS</td><td>Phishing e sites falsos</td><td>Usar HTTPS, conferir o domínio e ativar verificação em duas etapas</td></tr>
        <tr><td>Transporte</td><td>TCP, UDP</td><td>Portas abertas e varredura</td><td>Firewall ativo e desativar UPnP e portas expostas</td></tr>
        <tr><td>Internet</td><td>IP, ICMP</td><td>Acesso remoto indevido ao roteador</td><td>Desativar administração remota e atualizar o firmware</td></tr>
        <tr><td>Acesso à rede</td><td>Wi-Fi (802.11), Ethernet</td><td>Invasão do Wi-Fi e rede compartilhada</td><td>WPA3, rede Guest isolada e desativar o WPS</td></tr></table></div>`;
}

function renderizarRede(container) {
    const marc = lerLS(chaveDiag(), []);
    container.innerHTML = `
        <section style="background:linear-gradient(135deg,#0f766e,#14b8a6); color:white; border-radius:16px; padding:28px;">
            <h2 style="font-size:24px; margin-bottom:6px;"><i class="fa-solid fa-wifi"></i> Rede e Conectividade</h2>
            <p style="font-size:13px; color:#ccfbf1; max-width:560px; line-height:1.6;">Diagnóstico e recomendações de segurança de rede para moradias estudantis (Arquitetura TCP/IP).</p>
        </section>
        <div class="card-box"><h3>Diagnóstico rápido da sua rede</h3><p class="doc-dica">Marque o que você já fez na sua moradia.</p>
            ${DIAG.map((t, i) => `<label class="diag-item"><input type="checkbox" ${marc.includes(i) ? 'checked' : ''} onchange="marcarDiag(${i}, this.checked)"> ${t}</label>`).join('')}
            <div id="diag-res"></div></div>
        <div class="card-box">${diagnosticoLocal(true)}</div>
        <div class="card-box">${guiaRede()}</div>`;
    mostrarDiag();
}

// ---------- dossiê em PDF (abre a versão para impressão: escolha "Salvar como PDF") ----------
function baixarDossie() {
    const j = window.open('', '_blank');
    if (!j) return alert('Libere os pop-ups deste site para gerar o dossiê.');
    const u = appState.usuario, hoje = new Date().toLocaleDateString('pt-BR');
    const partes = [['Análise Orientada a Objetos e Requisitos', secao('oo', false)], ['Banco de Dados', secao('bd', false)], ['Empreendedorismo', secao('emp', false)], ['Gerência de Projetos', secao('gp', false)],
        ['Diagnóstico de Rede e Conectividade (TCP/IP)', diagnosticoLocal(false) + guiaRede()], ['Treinamento do Usuário', secao('trein', false)], ['Validação na Comunidade', secao('val', false)], ['Evidências de Extensão', secao('ev', false)]];
    j.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><base href="${location.href}"><title>Dossiê ConectaUni</title><link rel="stylesheet" href="style.css"></head>
        <body class="dossie"><div class="dossie-capa"><h1>Dossiê de Evidências de Extensão</h1><h2 style="border:none;">ConectaUni: Estudantes conectam estudantes</h2>
        <p>Responsável: ${esc(u.nome)} (${esc(u.universidade)}, ${esc(u.curso)})</p><p>Gerado em ${hoje}</p>
        <p class="no-print" style="color:#dc2626;">Na janela de impressão, escolha "Salvar como PDF" como destino.</p></div>
        ${partes.map(([t, h]) => `<h2>${t}</h2>${h}`).join('')}</body></html>`);
    j.document.close();
    let impresso = false;
    const imprimir = () => { if (!impresso) { impresso = true; j.print(); } };
    j.onload = () => setTimeout(imprimir, 400);
    setTimeout(imprimir, 1500);
}
