(function () {

const STORAGE_KEY = "igarape_quadro_rh";
const STORAGE_TITLES = "igarape_quadro_titulos";
const STORAGE_SUBTITLES = "igarape_quadro_subtitulos";

let tasks = [];

let columnTitles = {
    "col-1": "Até 12/12",
    "col-2": "13 a 15/12",
    "col-3": "16 a 19/12",
    "col-4": "Até 20/12 / Pendências"
};

let columnSubtitles = {
    "col-1": "Atividades urgentes de folha, 13º e pagamentos.",
    "col-2": "Lançamentos, fechamentos e ajustes.",
    "col-3": "Projetos, CCT e harmonizações.",
    "col-4": "Encargos e pendências gerais."
};

let currentEditId = null;

const statusLabels = {
    "nao-iniciado": "Não iniciado",
    "andamento": "Em andamento",
    "concluido": "Concluído"
};

/* Tarefas padrão */
function getDefaultTasks() {
    return [
        { id:"t1", titulo:"Fazer as rescisões", deadline:"2025-12-10", responsavel:"Anderson", categoria:"Folha", colunaId:"col-1", status:"nao-iniciado" },
        { id:"t2", titulo:"Fazer Quinzenal (pgto 12/12)", deadline:"2025-12-12", responsavel:"Anderson", categoria:"Folha", colunaId:"col-1", status:"nao-iniciado" },
        { id:"t3", titulo:"Fazer 13º salário", deadline:"2025-12-12", responsavel:"Anderson", categoria:"Folha", colunaId:"col-1", status:"nao-iniciado" },
        { id:"t4", titulo:"Encargos do 13º", deadline:"2025-12-12", responsavel:"Anderson", categoria:"Encargos", colunaId:"col-1", status:"nao-iniciado" },
        { id:"t5", titulo:"Envio dos Cartões Ifood", deadline:"2025-12-12", responsavel:"Anderson", categoria:"Benefícios", colunaId:"col-1", status:"nao-iniciado" },
        { id:"t6", titulo:"Lançamentos de folha", deadline:"2025-12-15", responsavel:"Anderson", categoria:"Folha", colunaId:"col-2", status:"nao-iniciado" },
        { id:"t7", titulo:"Transferência CNPJ AR/Uniaudio/Conect/AudioClin", deadline:"2025-12-15", responsavel:"Anderson", categoria:"Projeto", colunaId:"col-2", status:"nao-iniciado" },
        { id:"t8", titulo:"Solicitações implantação G|AS", deadline:"2025-12-16", responsavel:"Anderson", categoria:"Projeto", colunaId:"col-3", status:"nao-iniciado" },
        { id:"t9", titulo:"Aplicação CCT SP", deadline:"2025-12-19", responsavel:"Anderson", categoria:"Jurídico", colunaId:"col-3", status:"nao-iniciado" },
        { id:"t10", titulo:"Custo Soulan 2024/2025", deadline:"2025-12-19", responsavel:"Anderson", categoria:"Projeto", colunaId:"col-3", status:"nao-iniciado" },
        { id:"t11", titulo:"Encargos 11/2025", deadline:"2025-12-20", responsavel:"Anderson", categoria:"Encargos", colunaId:"col-4", status:"nao-iniciado" },
        { id:"t12", titulo:"Transferir benefícios Alelo, VT, Drogaria", deadline:"2025-12-20", responsavel:"Anderson", categoria:"Benefícios", colunaId:"col-4", status:"nao-iniciado" }
    ];
}

/* Títulos */
function loadTitles() {
    const raw = localStorage.getItem(STORAGE_TITLES);
    if (!raw) return;
    try {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
            columnTitles = saved;
        }
    } catch {}
}

function saveTitles() {
    localStorage.setItem(STORAGE_TITLES, JSON.stringify(columnTitles));
}

/* Subtítulos */
function loadSubtitles() {
    const raw = localStorage.getItem(STORAGE_SUBTITLES);
    if (!raw) return;
    try {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
            columnSubtitles = saved;
        }
    } catch {}
}

function saveSubtitles() {
    localStorage.setItem(STORAGE_SUBTITLES, JSON.stringify(columnSubtitles));
}

/* Tasks */
function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        tasks = getDefaultTasks();
        saveTasks();
        return;
    }
    try {
        const parsed = JSON.parse(raw);
        tasks = Array.isArray(parsed) ? parsed : [];
    } catch {
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* Util */
function formatDate(date) {
    if (!date) return "Sem prazo";
    const p = date.split("-");
    if (p.length !== 3) return date;
    return `${p[2]}/${p[1]}/${p[0]}`;
}

/* Criação de card */
function createTaskElement(task) {
    const card = document.createElement("article");
    card.className = "task-card";
    card.draggable = true;
    card.dataset.taskId = task.id;

    const header = document.createElement("div");
    header.className = "task-header";

    const title = document.createElement("div");
    title.textContent = task.titulo;

    const editBtn = document.createElement("button");
    editBtn.className = "task-edit-btn";
    editBtn.textContent = "Editar";
    editBtn.onclick = () => openEditModal(task.id);

    const delBtn = document.createElement("button");
    delBtn.className = "task-delete-btn";
    delBtn.textContent = "×";
    delBtn.onclick = () => deleteTask(task.id);

    header.appendChild(title);
    header.appendChild(editBtn);
    header.appendChild(delBtn);

    const meta = document.createElement("div");
    meta.textContent = `Prazo: ${formatDate(task.deadline)} • Resp: ${task.responsavel} • ${task.categoria}`;

    const footer = document.createElement("div");
    const statusBtn = document.createElement("button");
    statusBtn.className = `status-pill status-${task.status}`;
    statusBtn.textContent = statusLabels[task.status];
    statusBtn.onclick = () => toggleStatus(task.id);
    footer.appendChild(statusBtn);

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(footer);

    card.ondragstart = (ev) => {
        ev.dataTransfer.setData("text/plain", task.id);
        card.classList.add("dragging");
    };
    card.ondragend = () => card.classList.remove("dragging");

    return card;
}

/* Render geral */
function renderTasks() {
    // Aplica títulos e subtítulos
    document.querySelectorAll(".board-column").forEach(col => {
        const id = col.dataset.colunaId;
        const titleEl = col.querySelector(".editable-title");
        const subEl = col.querySelector(".editable-subtitle");
        if (titleEl && columnTitles[id]) {
            titleEl.textContent = columnTitles[id];
        }
        if (subEl && columnSubtitles[id]) {
            subEl.textContent = columnSubtitles[id];
        }
    });

    // Limpa colunas
    document.querySelectorAll(".column-body").forEach(c => c.innerHTML = "");

    const fs = document.getElementById("filter-status").value;
    const fc = document.getElementById("filter-categoria").value;

    tasks.forEach(t => {
        if (fs && t.status !== fs) return;
        if (fc && t.categoria !== fc) return;

        const col = document.querySelector(`[data-coluna-id="${t.colunaId}"] .column-body`);
        if (!col) return;
        col.appendChild(createTaskElement(t));
    });
}

/* Deletar */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

/* Trocar status */
function toggleStatus(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const order = ["nao-iniciado", "andamento", "concluido"];
    t.status = order[(order.indexOf(t.status) + 1) % order.length];
    saveTasks();
    renderTasks();
}

/* Adicionar nova task */
document.getElementById("task-form").onsubmit = (ev) => {
    ev.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    if (!titulo) return;

    const t = {
        id: String(Date.now()),
        titulo: titulo,
        deadline: document.getElementById("deadline").value,
        responsavel: document.getElementById("responsavel").value.trim(),
        categoria: document.getElementById("categoria").value,
        colunaId: document.getElementById("coluna").value,
        status: "nao-iniciado"
    };

    tasks.push(t);
    saveTasks();
    renderTasks();
    ev.target.reset();
    document.getElementById("responsavel").value = "Anderson";
};

/* Limpar quadro */
document.getElementById("clear-board").onclick = () => {
    if (confirm("Apagar todas as atividades do quadro?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
};

/* Modal edição */
function openEditModal(id) {
    currentEditId = id;
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    document.getElementById("edit-titulo").value = t.titulo;
    document.getElementById("edit-deadline").value = t.deadline;
    document.getElementById("edit-responsavel").value = t.responsavel;
    document.getElementById("edit-categoria").value = t.categoria;
    document.getElementById("edit-coluna").value = t.colunaId;

    document.getElementById("modal-edicao").classList.remove("hidden");
}

document.getElementById("btn-cancel-edit").onclick = () =>
    document.getElementById("modal-edicao").classList.add("hidden");

document.getElementById("btn-save-edit").onclick = () => {
    const t = tasks.find(x => x.id === currentEditId);
    if (!t) return;

    t.titulo = document.getElementById("edit-titulo").value.trim();
    t.deadline = document.getElementById("edit-deadline").value;
    t.responsavel = document.getElementById("edit-responsavel").value.trim();
    t.categoria = document.getElementById("edit-categoria").value;
    t.colunaId = document.getElementById("edit-coluna").value;

    saveTasks();
    renderTasks();
    document.getElementById("modal-edicao").classList.add("hidden");
};

/* Editar títulos e subtítulos */
function setupEditableHeaders() {
    document.querySelectorAll(".editable-title").forEach(el => {
        el.addEventListener("input", function () {
            const col = this.closest(".board-column");
            if (!col) return;
            const id = col.dataset.colunaId;
            columnTitles[id] = this.textContent.trim();
            saveTitles();
        });
    });

    document.querySelectorAll(".editable-subtitle").forEach(el => {
        el.addEventListener("input", function () {
            const col = this.closest(".board-column");
            if (!col) return;
            const id = col.dataset.colunaId;
            columnSubtitles[id] = this.textContent.trim();
            saveSubtitles();
        });
    });
}

/* Drag & Drop */
function setupDragAndDrop() {
    document.querySelectorAll(".board-column").forEach(col => {
        col.ondragover = ev => ev.preventDefault();
        col.ondrop = ev => {
            const id = ev.dataTransfer.getData("text/plain");
            const t = tasks.find(x => x.id === id);
            if (!t) return;
            t.colunaId = col.dataset.colunaId;
            saveTasks();
            renderTasks();
        };
    });
}

/* Filtros */
document.getElementById("filter-status").onchange = renderTasks;
document.getElementById("filter-categoria").onchange = renderTasks;

/* Init */
loadTasks();
loadTitles();
loadSubtitles();
setupDragAndDrop();
setupEditableHeaders();
renderTasks();

})();
