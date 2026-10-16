// AUTENTICAÇÃO E PERSISTÊNCIA (demonstração: dados ficam no localStorage do navegador)
const LS = { contas: 'cu_contas', sessao: 'cu_sessao', dados: e => 'cu_dados_' + e };
const MORADIAS_BASE = appState.moradias.slice();
Object.assign(appState, { email: null, favoritos: [], avaliacoes: [], despesas: {}, filtros: {} });

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
            ${campo('au-email', 'E-mail', 'type="email"')}
            ${campo('au-senha', 'Senha (mín. 6 caracteres)', 'type="password" class="au-pw" minlength="6"')}
            ${cad ? campo('au-senha2', 'Confirmar senha', 'type="password" class="au-pw" minlength="6"') : ''}
            <label class="auth-ver"><input type="checkbox" onchange="document.querySelectorAll('.au-pw').forEach(i => i.type = this.checked ? 'text' : 'password')"> Mostrar senha</label>
            <p id="au-erro" class="auth-erro"></p>
            <button type="submit" class="btn-primary">${cad ? 'Criar conta' : 'Entrar'}</button>
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
    sessionStorage.setItem(LS.sessao, email);
    iniciarSessao(email);
}

function iniciarSessao(email) {
    appState.email = email;
    const d = lerLS(LS.dados(email), {});
    Object.assign(appState.usuario, d.perfil || {});
    appState.favoritos = d.favoritos || [];
    appState.avaliacoes = d.avaliacoes || [];
    appState.despesas = d.despesas || {};
    appState.moradias = [...(d.criadas || []), ...MORADIAS_BASE];
    document.getElementById('tela-auth')?.remove();
    atualizarInterfaceUsuario();
    navegarPara('inicio');
}

function salvarEstado() {
    if (!appState.email) return;
    const u = appState.usuario;
    gravarLS(LS.dados(appState.email), {
        perfil: { nome: u.nome, universidade: u.universidade, curso: u.curso, ano: u.ano, avatar: u.avatar },
        favoritos: appState.favoritos,
        criadas: appState.moradias.filter(m => m.criada),
        avaliacoes: appState.avaliacoes,
        despesas: appState.despesas
    });
}

function sair() {
    sessionStorage.removeItem(LS.sessao);
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
    const email = sessionStorage.getItem(LS.sessao);
    if (email && contas[email]) iniciarSessao(email);
    else montarTelaAuth(Object.keys(contas).length ? 'login' : 'cadastro');
});
