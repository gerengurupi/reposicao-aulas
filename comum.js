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

/** Nome da turma a partir do curso e do código do SUAP (mesmo padrão da avaliação docente):
 *  técnico: "1º Agropecuária"; demais: "Licenciatura em Matemática – 1º Período". letra: "A" ou "B" quando há duas turmas. */
function nomeTurma(curso, codigo, letra) {
  const p = String(codigo || '').split('.');
  if (p.length < 4 || !/^\d{5}$/.test(p[0])) return codigo || '';
  const per = parseInt(p[1], 10) || 0;
  const c = String(curso || '').replace(/^T[ée]cnico em /i, '').replace(/^Bacharelado em /i, '')
    .replace(/^Curso Superior de Tecnologia em /i, '').replace(/ Integrado ao Ensino M[ée]dio$/i, '').trim();
  const tec = /^t[ée]cnico/i.test(String(curso || ''));
  const n = tec ? `${per}º ${c}` : `${c} – ${per}º Período`;
  return letra ? `${n} – Turma ${letra}` : n;
}
/** Letra da turma (A/B) quando o mesmo curso e período têm duas turmas na lista. */
function letraTurma(codigo, todos) {
  const p = String(codigo || '').split('.'); if (p.length < 4) return '';
  const pref = p.slice(0, 4).join('.');
  const seqs = [...new Set((todos || []).map(String).filter(c => c.split('.').slice(0, 4).join('.') === pref)
    .map(c => { const m = c.split('.').pop().match(/(\d+)/); return m ? Number(m[1]) : 1; }))].sort((a, b) => a - b);
  if (seqs.length < 2) return '';
  const seq = (String(codigo).split('.').pop().match(/(\d+)/) || [0, 1])[1];
  return String.fromCharCode(64 + seqs.indexOf(Number(seq)) + 1);
}
/** Nome que a página mostra: o do servidor quando ele existe e é nome (não só o código), senão o montado aqui. */
function nomeMostrado(nomeServidor, curso, codigo, letra) {
  return nomeServidor && nomeServidor !== codigo ? nomeServidor : nomeTurma(curso, codigo, letra);
}
