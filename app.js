const API = 'api/subjects.php';

let subjects = [];
let currentDetailId = null;
let deleteTargetId = null;
document.addEventListener('DOMContentLoaded', () => {
  loadSubjects();
});
async function api(method, params = '', body = null) {
  const url = params ? `${API}?${params}` : API;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}
async function loadSubjects() {
  try {
    subjects = await api('GET');
    renderList();
    updateCounter();
  } catch (e) {
    console.error('Failed to load subjects:', e);
    showToast('Erro ao carregar assuntos.');
  }
}

async function loadStats() {
  try {
    const stats = await api('GET', 'stats=1');
    document.getElementById('logoCounter').textContent =
      `${stats.reviewed}/${stats.total} revisados`;
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getDisciplineClass(discipline) {
  const map = {
    'Matemática': 'discipline-matematica',
    'Português': 'discipline-portugues',
    'História': 'discipline-historia',
    'Geografia': 'discipline-geografia',
    'Biologia': 'discipline-biologia',
    'Física': 'discipline-fisica',
    'Química': 'discipline-quimica',
    'Inglês': 'discipline-ingles',
    'Literatura': 'discipline-literatura',
    'Filosofia': 'discipline-filosofia',
    'Sociologia': 'discipline-sociologia',
    'Redação': 'discipline-redacao'
  };
  return map[discipline] || 'discipline-matematica';
}

function getBgClass(discipline) {
  return `detail-bg-${getDisciplineClass(discipline).replace('discipline-', '')}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
async function updateCounter() {
  try {
    const stats = await api('GET', 'stats=1');
    document.getElementById('logoCounter').textContent =
      `${stats.reviewed}/${stats.total} revisados`;

    const total = stats.total;
    document.getElementById('listSubtitle').textContent =
      total === 0
        ? '0 assuntos cadastrados \u2014 bora revisar?'
        : `${total} assunto${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''} \u2014 bora revisar?`;
  } catch (e) {
    console.error('Failed to update counter:', e);
  }
}
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
  });
  const page = document.getElementById(pageId);
  page.style.display = 'block';
  page.style.animation = 'none';
  page.offsetHeight;
  page.style.animation = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showList() {
  showPage('pageList');
  loadSubjects();
}
function renderList() {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  let filtered = subjects;
  if (query) {
    filtered = subjects.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.discipline.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    if (subjects.length === 0) {
      empty.querySelector('p').textContent = 'Nada por aqui ainda \u2014 comece adicionando um assunto.';
    } else {
      empty.querySelector('p').textContent = 'Nenhum resultado encontrado para sua busca.';
    }
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = filtered.map(s => `
    <div class="subject-card" onclick="showDetail(${s.id})" id="card-${s.id}">
      <div class="card-top">
        <span class="badge-discipline ${getDisciplineClass(s.discipline)}">${escapeHtml(s.discipline)}</span>
        <span class="badge-status ${s.status === 'Revisado' ? 'reviewed' : 'pending'}">${s.status === 'Revisado' ? 'REVISADO' : 'PENDENTE'}</span>
      </div>
      <h3 class="card-title">${escapeHtml(s.title)}</h3>
      <p class="card-date">${formatDate(s.study_date)}</p>
      <div class="card-actions">
        <button class="card-btn card-btn-edit" onclick="event.stopPropagation(); editSubject(${s.id})" title="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </button>
        <button class="card-btn card-btn-delete" onclick="event.stopPropagation(); openDeleteModal(${s.id})" title="Excluir">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function filterSubjects() {
  renderList();
}
async function showDetail(id) {
  try {
    const subject = await api('GET', `id=${id}`);
    currentDetailId = id;

    document.getElementById('detailDiscipline').textContent = subject.discipline;
    document.getElementById('detailDiscipline').className =
      `badge-discipline ${getDisciplineClass(subject.discipline)}`;
    document.getElementById('detailCard').className =
      `detail-card ${getBgClass(subject.discipline)}`;

    const statusEl = document.getElementById('detailStatus');
    statusEl.textContent = subject.status === 'Revisado' ? 'REVISADO' : 'PENDENTE';
    statusEl.className = `badge-status ${subject.status === 'Revisado' ? 'reviewed' : 'pending'}`;

    document.getElementById('detailTitle').textContent = subject.title;
    document.getElementById('detailDate').textContent = formatDate(subject.study_date);
    document.getElementById('detailNotes').textContent = subject.notes || 'Sem notas.';

    const btnReview = document.getElementById('btnReview');
    const btnReviewText = document.getElementById('btnReviewText');
    if (subject.status === 'Revisado') {
      btnReview.classList.add('reviewed');
      btnReviewText.textContent = 'Revisado';
    } else {
      btnReview.classList.remove('reviewed');
      btnReviewText.textContent = 'Marcar como revisado';
    }

    showPage('pageDetail');
  } catch (e) {
    console.error('Failed to load detail:', e);
    showToast('Erro ao carregar detalhes.');
  }
}

function editCurrentSubject() {
  if (currentDetailId) editSubject(currentDetailId);
}

async function toggleReview() {
  if (!currentDetailId) return;
  try {
    const updated = await api('PATCH', `id=${currentDetailId}`);
    showToast(updated.status === 'Revisado'
      ? 'Assunto marcado como revisado!'
      : 'Assunto marcado como pendente.');
    showDetail(currentDetailId);
  } catch (e) {
    console.error('Failed to toggle review:', e);
    showToast('Erro ao atualizar status.');
  }
}
function showNewForm() {
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').textContent = 'Novo assunto';
  document.getElementById('inputTitle').value = '';
  document.getElementById('inputDiscipline').value = '';
  document.getElementById('inputDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('inputStatus').value = 'Pendente';
  document.getElementById('inputNotes').value = '';
  document.querySelector('.form-card').className = 'form-card';
  showPage('pageForm');
  document.getElementById('inputTitle').focus();
}

async function editSubject(id) {
  try {
    const subject = await api('GET', `id=${id}`);

    document.getElementById('editId').value = id;
    document.getElementById('formTitle').textContent = 'Editar assunto';
    document.getElementById('inputTitle').value = subject.title;
    document.getElementById('inputDiscipline').value = subject.discipline;
    document.getElementById('inputDate').value = subject.study_date;
    document.getElementById('inputStatus').value = subject.status;
    document.getElementById('inputNotes').value = subject.notes || '';
    document.querySelector('.form-card').className = `form-card ${getBgClass(subject.discipline)}`;
    showPage('pageForm');
    document.getElementById('inputTitle').focus();
  } catch (e) {
    console.error('Failed to load subject for editing:', e);
    showToast('Erro ao carregar assunto.');
  }
}

async function saveSubject(event) {
  event.preventDefault();

  const id = document.getElementById('editId').value;
  const title = document.getElementById('inputTitle').value.trim();
  const discipline = document.getElementById('inputDiscipline').value;
  const study_date = document.getElementById('inputDate').value;
  const status = document.getElementById('inputStatus').value;
  const notes = document.getElementById('inputNotes').value.trim();

  if (!title || !discipline || !study_date) return;

  const payload = { title, discipline, study_date, status, notes };

  try {
    if (id) {
      await api('PUT', `id=${id}`, payload);
      showToast('Assunto atualizado com sucesso!');
    } else {
      await api('POST', '', payload);
      showToast('Assunto adicionado com sucesso!');
    }
    showList();
  } catch (e) {
    console.error('Failed to save subject:', e);
    showToast('Erro ao salvar assunto.');
  }
}

function cancelForm() {
  const id = document.getElementById('editId').value;
  if (id && currentDetailId == id) {
    showDetail(parseInt(id));
  } else {
    showList();
  }
}
function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').style.display = 'none';
}

async function confirmDelete() {
  if (!deleteTargetId) return;
  try {
    await api('DELETE', `id=${deleteTargetId}`);
    closeDeleteModal();
    showList();
    showToast('Assunto excluido.');
  } catch (e) {
    console.error('Failed to delete subject:', e);
    showToast('Erro ao excluir assunto.');
  }
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

