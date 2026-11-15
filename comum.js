// Funções comuns das páginas: chamada ao servidor (Apps Script) e atalhos.
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Envia {acao, ...} como texto simples (o Apps Script não aceita a pré-checagem de CORS de application/json). */
async function chamar(acao, dados) {
  const api = (window.REPOSICAO || {}).api;
  if (!api) return { erro: 'O sistema ainda não foi ligado ao servidor.' };
  try {
    const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ acao }, dados || {})) });
    return await r.json();
  } catch (e) { return { erro: 'Sem conexão com o servidor. Verifique a internet e tente de novo.' }; }
}
const TIPOS = { falta: ['Falta', 'O docente faltou e deve repor'], reposicao: ['Reposição', 'O docente repôs aulas que devia'], adiantamento: ['Antecipação', 'O docente deu a aula antes do dia'], permuta: ['Permuta', 'Dois docentes trocaram de aula'] };
const dataBR = s => { const p = String(s).split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : s; };
