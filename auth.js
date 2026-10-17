// AUTENTICAÇÃO E PERSISTÊNCIA (demonstração: dados ficam no localStorage do navegador)
// >>> Troque pelo e-mail que será o ADMINISTRADOR. Quem criar conta com este e-mail terá o painel de ADM.
const ADMIN_EMAIL = 'admin@conectauni.com';
const LS = { contas: 'cu_contas', sessao: 'cu_sessao', anuncios: 'cu_anuncios', ultimo: 'cu_ultimo', dados: e => 'cu_dados_' + e };
const MORADIAS_BASE = appState.moradias.slice();
// cópias dos dados iniciais de conversas e notificações (cada conta novo começa com eles)
const CONVERSAS_BASE = JSON.parse(JSON.stringify(appState.conversas));
const NOTIFICACOES_BASE = JSON.parse(JSON.stringify(appState.notificacoes));
Object.assign(appState, { email: null, admin: false, favoritos: [], avaliacoes: [], despesas: {}, filtros: {} });

const lerLS = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch { return padrao; } };
const gravarLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('Armazenamento cheio', e); } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function hashSenha(senha, sal) {
    const txt = sal + senha;
    if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0; for (const c of txt) h = (h * 31 + c.charCodeAt(0)) | 0;
    return 'x' + h;
}

function montarTelaAuth(modo) {
    let el = document.getElementById('tela-auth');
    if (!el) { el = document.createElement('div'); el.id = 'tela-auth'; document.body.appendChild(el); }
    const cad = modo === 'cadastro';
    const campo = (id, rotulo, extra = '') => `<div class="input-group"><label>${rotulo}</label><input id="${id}" ${extra} required></div>`;
    el.innerHTML = `
        <form class="auth-box" onsubmit="enviarAuth(event, '${modo}')">
            <div class="auth-logo"><i class="fa-solid fa-graduation-cap"></i> ConectaUni</div>
            <p class="auth-sub">${cad ? 'Crie sua conta de estudante' : 'Entre com seu e-mail e sua senha'}</p>
            ${cad ? campo('au-nome', 'Nome completo') + campo('au-uni', 'Universidade', 'placeholder="Ex: UFRN"') + campo('au-curso', 'Curso') + campo('au-ano', 'Período / Ano', 'placeholder="Ex: 2º ano"') : ''}
            ${campo('au-email', 'E-mail', `type="email" value="${cad ? '' : esc(localStorage.getItem(LS.ultimo) || '')}"`)}
            ${campo('au-senha', 'Senha (mín. 6 caracteres)', 'type="password" class="au-pw" minlength="6"')}
            ${cad ? campo('au-senha2', 'Confirmar senha', 'type="password" class="au-pw" minlength="6"') : ''}
            <label class="auth-ver"><input type="checkbox" onchange="document.querySelectorAll('.au-pw').forEach(i => i.type = this.checked ? 'text' : 'password')"> Mostrar senha</label>
            ${cad ? '' : '<label class="auth-ver"><input type="checkbox" id="au-manter"> Manter conectado neste computador</label>'}
            <p id="au-erro" class="auth-erro"></p>
            <button type="submit" class="btn-primary">${cad ? 'Criar conta' : 'Entrar'}</button>
            <p class="auth-troca"><label style="cursor:pointer; color:#2563eb; font-weight:600;">Restaurar backup<input type="file" accept=".json" hidden onchange="importarBackup(event)"></label></p>
            <p class="auth-troca">${cad ? 'Já tem conta?' : 'Primeira vez aqui?'}
                <a href="#" onclick="montarTelaAuth('${cad ? 'login' : 'cadastro'}')">${cad ? 'Entrar' : 'Criar conta'}</a></p>
        </form>`;
}

async function enviarAuth(e, modo) {
    e.preventDefault();
    const v = id => (document.getElementById(id)?.value || '').trim();
    const erro = m => { document.getElementById('au-erro').textContent = m; };
    const email = v('au-email').toLowerCase();
    const senha = document.getElementById('au-senha').value;
    const contas = lerLS(LS.contas, {});

    if (modo === 'cadastro') {
        if (contas[email]) return erro('Este e-mail já tem cadastro. Use a opção Entrar.');
        if (senha !== document.getElementById('au-senha2').value) return erro('As senhas não conferem.');
        const sal = Math.random().toString(36).slice(2);
        contas[email] = { sal, hash: await hashSenha(senha, sal) };
        gravarLS(LS.contas, contas);
        gravarLS(LS.dados(email), { perfil: { nome: v('au-nome'), universidade: v('au-uni'), curso: v('au-curso'), ano: v('au-ano') } });
    } else {
        const c = contas[email];
        if (!c || c.hash !== await hashSenha(senha, c.sal)) return erro('E-mail ou senha incorretos.');
    }
    localStorage.setItem(LS.ultimo, email);
    (document.getElementById('au-manter')?.checked ? localStorage : sessionStorage).setItem(LS.sessao, email);
    iniciarSessao(email);
}

function iniciarSessao(email) {
    appState.email = email;
    const d = lerLS(LS.dados(email), {});
    Object.assign(appState.usuario, d.perfil || {});
    appState.favoritos = d.favoritos || [];
    appState.avaliacoes = d.avaliacoes || [];
    appState.despesas = d.despesas || {};
    // conversas e notificações ficam salvas por conta (o contador de não lidas também)
    appState.conversas = d.conversas || JSON.parse(JSON.stringify(CONVERSAS_BASE));
    appState.notificacoes = d.notificacoes || JSON.parse(JSON.stringify(NOTIFICACOES_BASE));
    appState.chatAtivo = Object.keys(appState.conversas)[0];
    // anúncios são compartilhados entre todas as contas deste navegador
    const globais = lerLS(LS.anuncios, []);
    (d.criadas || []).forEach(m => { if (!globais.some(g => g.id === m.id)) globais.push({ ...m, dono: email }); });
    gravarLS(LS.anuncios, globais);
    appState.moradias = [...globais, ...MORADIAS_BASE];
    appState.admin = email === ADMIN_EMAIL;
    const itemAdmin = document.getElementById('side-admin');
    if (itemAdmin) itemAdmin.style.display = appState.admin ? '' : 'none';
    const cta = document.getElementById('btn-cta');
    if (cta) {
        cta.innerHTML = appState.admin ? 'Cadastrar local <i class="fa-solid fa-arrow-right"></i>' : 'Buscar moradia <i class="fa-solid fa-arrow-right"></i>';
        cta.onclick = () => navegarPara(appState.admin ? 'admin' : 'buscar');
    }
    document.getElementById('tela-auth')?.remove();
    atualizarInterfaceUsuario();
    navegarPara('inicio');
}

function salvarEstado() {
    if (!appState.email) return;
    gravarLS(LS.anuncios, appState.moradias.filter(m => m.criada));
    const u = appState.usuario;
    gravarLS(LS.dados(appState.email), {
        perfil: { nome: u.nome, universidade: u.universidade, curso: u.curso, ano: u.ano, avatar: u.avatar },
        favoritos: appState.favoritos,
        avaliacoes: appState.avaliacoes,
        despesas: appState.despesas,
        conversas: appState.conversas,
        notificacoes: appState.notificacoes
    });
}

function sair() {
    sessionStorage.removeItem(LS.sessao);
    localStorage.removeItem(LS.sessao);
    location.reload();
}

async function alterarSenha(e) {
    e.preventDefault();
    const msg = document.getElementById('sn-msg');
    const atual = document.getElementById('sn-atual').value;
    const nova = document.getElementById('sn-nova').value;
    const contas = lerLS(LS.contas, {});
    const c = contas[appState.email];
    if (c.hash !== await hashSenha(atual, c.sal)) { msg.style.color = '#dc2626'; return msg.textContent = 'Senha atual incorreta.'; }
    c.sal = Math.random().toString(36).slice(2);
    c.hash = await hashSenha(nova, c.sal);
    gravarLS(LS.contas, contas);
    msg.style.color = '#16a34a';
    msg.textContent = 'Senha alterada com sucesso!';
    e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const contas = lerLS(LS.contas, {});
    const email = sessionStorage.getItem(LS.sessao) || localStorage.getItem(LS.sessao);
    if (email && contas[email]) iniciarSessao(email);
    else montarTelaAuth(Object.keys(contas).length ? 'login' : 'cadastro');
});

// BACKUP (para levar seus dados para outro navegador ou computador)
function exportarBackup() {
    const dados = {};
    Object.keys(localStorage).filter(k => k.startsWith('cu_') && k !== LS.sessao).forEach(k => dados[k] = localStorage.getItem(k));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    a.download = 'conectauni-backup.json';
    a.click();
}

function importarBackup(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
        try {
            Object.entries(JSON.parse(ev.target.result)).forEach(([k, v]) => k.startsWith('cu_') && localStorage.setItem(k, v));
            alert('Backup restaurado! Agora é só entrar.');
            sair();
        } catch { alert('Arquivo de backup inválido.'); }
    };
    r.readAsText(f);
}