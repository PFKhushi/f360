
/**
 * =================================================================
 * 1. INICIALIZAÇÃO E CONSTANTES GLOBAIS
 * =================================================================
 */

const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token && window.location.pathname !== '/painel/login/') {
        window.location.href = '/painel/login/'; 
        return;
    }
    
    if (window.location.pathname.startsWith('/painel/')) {
        loadDashboard();
        setupEventListeners();
    }
});

/**
 * =================================================================
 * 2. LÓGICA PRINCIPAL DA APLICAÇÃO (Navegação e Eventos)
 * =================================================================
 */

function setupEventListeners() {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const section = this.getAttribute('data-section');
            if (section) navigateTo(section);
        });
    });

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/painel/login/';
    });

    const formModalElement = document.getElementById('formModal');
    if (formModalElement) {
        formModalElement.addEventListener('hidden.bs.modal', () => document.body.focus());
    }
}

function navigateTo(section) {
    console.log(`Navegando para: ${section}`);
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="d-flex justify-content-center mt-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    switch (section) {
        case 'dashboard': loadDashboard(); break;
        case 'usuarios': loadUsuarios(); break;
        case 'extensionistas': loadExtensionistas(); break;
        case 'projetos': loadProjetos(); break;
        case 'workshops': loadWorkshops(); break;
        case 'imersoes': loadImersoes(); break;
        case 'config': loadConfig(); break;
        default: render('<h2>Página não encontrada</h2>');
    }
}

function render(htmlContent) {
    document.getElementById('content-area').innerHTML = htmlContent;
}


/**
 * =================================================================
 * 3. COMUNICAÇÃO COM A API (Função Central)
 * =================================================================
 */

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/painel/login/';
        return Promise.reject('Token não encontrado'); 
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const finalOptions = { ...options, headers: { ...defaultHeaders, ...options.headers } };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);

        if (response.status === 204) return { sucesso: true, resultado: null }; 

        const data = await response.json();

        if (response.status === 401) {
            alert('Sua sessão expirou ou o token é inválido.');
            localStorage.clear();
            window.location.href = '/painel/login/';
            return Promise.reject('Não autorizado');
        }

        if (data.sucesso && data.resultado && typeof data.resultado.sucesso !== 'undefined') {
            return data.resultado; 
        }
        
        return data;
    } catch (error) {
        console.error('Erro de rede ou na chamada fetch:', error);
        if (error.name !== 'SyntaxError') { 
            return Promise.reject(error);
        }
        return { sucesso: true }; 
    }
}

/**
 * =================================================================
 * 4. SEÇÃO: DASHBOARD
 * =================================================================
 */

async function loadDashboard() {
    const [participantesRes, projetosRes] = await Promise.all([
        fetchAPI('/participante/'),
        fetchAPI('/projeto/')
    ]);

    const totalParticipantes = participantesRes.sucesso ? participantesRes.resultado.length : 0;
    const totalProjetos = projetosRes.sucesso ? projetosRes.resultado.length : 0;

    const html = `
        <h1>Dashboard</h1>
        <div class="row">
            <div class="col-md-6">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${totalParticipantes}</h5>
                        <p class="card-text">Total de Participantes</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-white bg-success mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${totalProjetos}</h5>
                        <p class="card-text">Total de Projetos</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    render(html);
}

/**
 * =================================================================
 * 5. SEÇÃO: USUÁRIOS
 * =================================================================
 */

async function loadUsuarios() {
    const [participantesRes, empresasRes, techleadersRes, excecoesRes] = await Promise.all([
        fetchAPI('/participante/'),
        fetchAPI('/empresa/'),
        fetchAPI('/techleader/'),
        fetchAPI('/excecao/') 
    ]);

    const participantes = participantesRes.sucesso ? participantesRes.resultado : [];
    const empresas = empresasRes.sucesso ? empresasRes.resultado : [];
    const techleaders = techleadersRes.sucesso ? techleadersRes.resultado : [];
    const excecoes = excecoesRes.sucesso ? excecoesRes.resultado : []; 

    const getRoleBadge = (item, type) => {
        let role = '';
        let badgeClass = 'bg-secondary';

        switch (type) {
            case 'participante':
            case 'excecao':
                if (item.membro?.extensionista) {
                    role = 'Extensionista';
                    badgeClass = 'bg-primary';
                } else if (item.membro?.imersionista) {
                    role = 'Imersionista';
                    badgeClass = 'bg-info text-dark';
                }
                break;
            case 'empresa':
                role = 'Cliente';
                badgeClass = 'bg-success';
                break;
            case 'techleader':
                role = 'Líder Técnico';
                badgeClass = 'bg-warning text-dark';
                break;
        }
        return role ? `<span class="badge ${badgeClass}">${role}</span>` : '';
    };
    
    const createTable = (title, data, type) => {
        if (!data || data.length === 0) return ''; 

        let rows = data.map(item => `
            <tr>
                <td>${item.id_usuario}</td>
                <td>${item.nome}</td>
                <td>${item.username}</td>
                <td>${getRoleBadge(item, type)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewUser(${item.id_usuario}, '${type}')"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-warning" onclick="editUser(${item.id_usuario}, '${type}')"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
        `).join('');

        return `
            <div class="card mb-4">
                <div class="card-header"><h5>${title}</h5></div>
                <div class="card-body table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID Usuário</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Papel</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    };
    
    const html = `
        <h1>Gerenciamento de Usuários</h1>
        ${createTable('Participantes', participantes, 'participante')}
        ${createTable('Exceções', excecoes, 'excecao')}
        ${createTable('Empresas', empresas, 'empresa')}
        ${createTable('Tech Leaders', techleaders, 'techleader')}
    `;
    render(html);
}

async function editUser(userId, userType) {
    const response = await fetchAPI(`/usuario/${userId}/perfil/`);
    if (!response.sucesso) {
        alert('Erro ao buscar dados do usuário.');
        return;
    }
    const user = response.resultado;

    const generateSpecificFields = () => {
        switch (userType) {
            case 'participante':
                return `
                    <div class="mb-3">
                        <label for="curso" class="form-label">Curso</label>
                        <input type="text" class="form-control" id="curso" value="${user.curso || ''}">
                    </div>
                    <div class="mb-3">
                        <label for="periodo" class="form-label">Período</label>
                        <input type="number" class="form-control" id="periodo" value="${user.periodo || ''}">
                    </div>
                `;
            case 'empresa':
                return `
                    <div class="mb-3">
                        <label for="cnpj" class="form-label">CNPJ</label>
                        <input type="text" class="form-control" id="cnpj" value="${user.cnpj || ''}">
                    </div>
                    <div class="mb-3">
                        <label for="representante" class="form-label">Representante</label>
                        <input type="text" class="form-control" id="representante" value="${user.representante || ''}">
                    </div>
                `;
            case 'techleader':
                return `
                    <div class="mb-3">
                        <label for="codigo" class="form-label">Código</label>
                        <input type="text" class="form-control" id="codigo" value="${user.codigo || ''}">
                    </div>
                `;
            default:
                return '';
        }
    };

    const formHtml = `
        <form id="edit-user-form">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome Completo</label>
                <input type="text" class="form-control" id="nome" value="${user.nome}" required>
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Email (não pode ser alterado)</label>
                <input type="email" class="form-control" id="username" value="${user.username}" disabled>
            </div>
            <div class="mb-3">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="text" class="form-control" id="telefone" value="${user.telefone || ''}">
            </div>
            
            ${generateSpecificFields()}
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
        </form>
    `;

    document.getElementById('formModalLabel').textContent = `Editar ${user.nome}`;
    document.getElementById('modal-body-content').innerHTML = formHtml;
    
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();
    
    document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dataToUpdate = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
        };
        
        if (userType === 'participante') {
            dataToUpdate.curso = document.getElementById('curso').value;
            dataToUpdate.periodo = document.getElementById('periodo').value;
        } else if (userType === 'empresa') {
            dataToUpdate.cnpj = document.getElementById('cnpj').value;
            dataToUpdate.representante = document.getElementById('representante').value;
        } else if (userType === 'techleader') {
            dataToUpdate.codigo = document.getElementById('codigo').value;
        }

        const updateResponse = await fetchAPI(`/usuario/${userId}/perfil/`, {
            method: 'PATCH',
            body: JSON.stringify(dataToUpdate)
        });

        if (updateResponse.sucesso) {
            alert('Usuário atualizado com sucesso!');
            formModal.hide();
            loadUsuarios();
        } else {
            const errorMsg = updateResponse.detalhes?.join(', ') || 'Erro ao atualizar.';
            alert(errorMsg);
        }
    });
}

function viewUser(userId, userType) {
    editUser(userId, userType);
}

/**
 * =================================================================
 * 6. SEÇÃO: EXTENSIONISTAS
 * =================================================================
 */

async function loadExtensionistas() {
    const [extensionistasRes, imersionistasRes] = await Promise.all([
        fetchAPI('/extensionistas/'),
        fetchAPI('/imersionista/')
    ]);
    
    const extensionistas = extensionistasRes.sucesso ? extensionistasRes.resultado : [];
    const imersionistas = imersionistasRes.sucesso ? imersionistasRes.resultado : [];

    const extensionistasRows = extensionistas.map(e => `
        <tr>
            <td>${e.usuario_id}</td>
            <td>${e.nome}</td>
            <td>${e.email}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeExtensionista(${e.usuario_id})">Remover</button></td>
        </tr>
    `).join('');
    
    const imersionistasOptions = imersionistas.map(i => `<option value="${i.id}">${i.nome} (${i.tipo})</option>`).join('');

    const html = `
        <h1>Gerenciamento de Extensionistas</h1>
        <div class="row">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header"><h5>Extensionistas Atuais</h5></div>
                    <div class="card-body">
                        <table class="table">
                            <thead><tr><th>ID Usuário</th><th>Nome</th><th>Email</th><th>Ação</th></tr></thead>
                            <tbody>${extensionistasRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header"><h5>Adicionar Extensionistas</h5></div>
                    <div class="card-body">
                        <form id="add-extensionista-form">
                            <div class="mb-3">
                                <label for="imersionistas-select" class="form-label">Selecione usuários para promover:</label>
                                <select multiple class="form-select" id="imersionistas-select" size="10">
                                    ${imersionistasOptions}
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Promover a Extensionista</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    render(html);
    
    document.getElementById('add-extensionista-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedIds = Array.from(document.getElementById('imersionistas-select').selectedOptions).map(opt => opt.value);
        if(selectedIds.length === 0) {
            alert('Selecione pelo menos um usuário.');
            return;
        }

        const res = await fetchAPI('/extensionistas/', {
            method: 'POST',
            body: JSON.stringify({ usuarios: selectedIds.map(Number) })
        });
        
        if(res.sucesso) {
            alert('Usuários promovidos com sucesso!');
            loadExtensionistas(); 
        } else {
            alert('Falha ao promover usuários: ' + (res.detalhes || res.erro));
        }
    });
}

async function removeExtensionista(usuarioId) {
    if(!confirm(`Tem certeza que deseja remover o status de extensionista do usuário ${usuarioId}?`)) return;
    
    const res = await fetchAPI('/extensionistas/delete_bulk/', {
        method: 'POST', 
        body: JSON.stringify({ usuarios: [usuarioId] })
    });

    if(res.sucesso) {
        alert('Status de extensionista removido.');
        loadExtensionistas();
    } else {
        alert('Falha ao remover: ' + (res.detalhes || res.erro));
    }
}
/**
 * =================================================================
 * 7. SEÇÃO: PROJETOS
 * =================================================================
 */

async function loadProjetos() {
    try {
        const response = await fetchAPI('/projeto/');
        if (!response.sucesso) throw new Error(response.erro);

        const projetos = response.resultado;

        const rows = projetos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.nome}</strong></td>
                <td>${p.empresa_info?.nome || 'N/A'}</td>
                <td>${p.techleader_info?.nome || 'N/A'}</td>
                <td><span class="badge bg-primary">${p.status_display}</span></td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: ${p.progresso}%;" aria-valuenow="${p.progresso}" aria-valuemin="0" aria-valuemax="100">${p.progresso}%</div>
                    </div>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning" title="Editar Projeto" onclick="openEditProjectModal(${p.id})"><i class="bi bi-pencil-square"></i></button>
    
                    <button class="btn btn-sm btn-outline-danger ms-1" title="Excluir Projeto" onclick="deleteItem(${p.id}, 'projeto', loadProjetos)">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        const html = `
            <h1>Gerenciamento de Projetos</h1>
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Projetos Atuais</h5>
                    <button class="btn btn-success" id="btn-novo-projeto">
                        <i class="bi bi-plus-circle-fill me-2"></i>Novo Projeto
                    </button>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome do Projeto</th>
                                <th>Cliente</th>
                                <th>Líder Técnico</th>
                                <th>Status</th>
                                <th>Progresso</th>
                                <th class="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.length > 0 ? rows : '<tr><td colspan="7">Nenhum projeto cadastrado.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        render(html);
        document.getElementById('btn-novo-projeto').addEventListener('click', openCreateProjectModal);

    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        render('<h1>Projetos</h1><p class="text-danger">Não foi possível carregar os projetos.</p>');
    }
}

async function openCreateProjectModal() {
    try {
        const [empresasRes, techLeadersRes, extensionistasRes, areasRes] = await Promise.all([
            fetchAPI('/empresa/'),
            fetchAPI('/techleader/'),
            fetchAPI('/extensionistas/'),
            fetchAPI('/area_fabrica/')
        ]);

        if (!empresasRes.sucesso || !techLeadersRes.sucesso || !extensionistasRes.sucesso || !areasRes.sucesso) {
            alert('Erro ao carregar dados para o formulário de projeto.');
            return;
        }

        const empresas = empresasRes.resultado;
        const techLeaders = techLeadersRes.resultado;
        const extensionistas = extensionistasRes.resultado;
        const areas = areasRes.resultado;

        const empresaOptions = empresas.map(e => `<option value="${e.id_usuario}">${e.nome}</option>`).join('');
        const techLeaderOptions = techLeaders.map(t => `<option value="${t.id_usuario}">${t.nome}</option>`).join('');
        const extensionistaOptions = extensionistas.map(e => `<option value="${e.usuario_id}">${e.nome}</option>`).join('');
        const areaOptions = areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');

        const formHtml = `
            <form id="form-create-project">
                <h5>Detalhes do Projeto</h5>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nome do Projeto</label>
                        <input type="text" id="proj-nome" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Área do Projeto</label>
                        <input type="text" id="proj-area" class="form-control" placeholder="Ex: Educação, Finanças..." required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Prazo Final</label>
                        <input type="date" id="proj-prazo" class="form-control" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Descrição</label>
                    <textarea id="proj-descricao" class="form-control" rows="2"></textarea>
                </div>
                
                <hr>
                <h5>Responsáveis</h5>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Empresa Cliente</label>
                        <select id="proj-empresa" class="form-select" required><option value="" disabled selected>Selecione...</option>${empresaOptions}</select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Líder Técnico</label>
                        <select id="proj-techleader" class="form-select"><option value="">Nenhum</option>${techLeaderOptions}</select>
                    </div>
                </div>

                <hr>
                <h5>Equipe</h5>
                <div id="equipe-container">
                    </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="btn-add-membro">
                    <i class="bi bi-plus-circle"></i> Adicionar Membro
                </button>

                <div class="modal-footer mt-4">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Criar Projeto</button>
                </div>
            </form>
        `; 

        document.getElementById('formModalLabel').textContent = 'Criar Novo Projeto';
        document.getElementById('modal-body-content').innerHTML = formHtml;
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        const equipeContainer = document.getElementById('equipe-container');
        const addMembroBtn = document.getElementById('btn-add-membro');

        const addMembroRow = () => {
            const membroRow = document.createElement('div');
            membroRow.className = 'row g-2 align-items-center mb-2 membro-equipe-row';
            membroRow.innerHTML = `
                <div class="col-sm-5"><label class="form-label visually-hidden">Extensionista</label><select class="form-select select-extensionista">${extensionistaOptions}</select></div>
                <div class="col-sm-5"><label class="form-label visually-hidden">Cargo</label><select class="form-select select-cargo">${areaOptions}</select></div>
                <div class="col-sm-2"><button type="button" class="btn btn-sm btn-outline-danger btn-remove-membro w-100"><i class="bi bi-x-lg"></i></button></div>
            `;
            equipeContainer.appendChild(membroRow);
            membroRow.querySelector('.btn-remove-membro').addEventListener('click', () => membroRow.remove());
        };

        if (addMembroBtn) {
            addMembroBtn.addEventListener('click', addMembroRow);
        }
        
        const projectForm = document.getElementById('form-create-project');
        if (projectForm) {
            projectForm.addEventListener('submit', async e => {
                e.preventDefault();
                
                const equipe = [];
                document.querySelectorAll('.membro-equipe-row').forEach(row => {
                    equipe.push({
                        usuario_id: row.querySelector('.select-extensionista').value,
                        cargos_ids: [row.querySelector('.select-cargo').value]
                    });
                });

                const payload = {
                    nome: document.getElementById('proj-nome').value,
                    data_prazo: document.getElementById('proj-prazo').value,
                    descricao: document.getElementById('proj-descricao').value,
                    area: document.getElementById('proj-area').value,
                    empresa_usuario_id: parseInt(document.getElementById('proj-empresa').value),
                    techleader_usuario_id: parseInt(document.getElementById('proj-techleader').value) || null,
                    equipe: equipe
                };

                const response = await fetchAPI('/projeto/', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if(response.sucesso) {
                    alert('Projeto criado com sucesso!');
                    formModal.hide();
                    loadProjetos();
                } else {
                    alert('Erro ao criar projeto: ' + (response.detalhes?.join(', ') || response.erro));
                }
            });
        }
    } catch (error) {
        console.error("Erro ao abrir modal de criação de projeto:", error);
        alert("Ocorreu um erro inesperado ao preparar o formulário.");
    }
}

async function openEditProjectModal(projectId) {
    try {
        const [projectRes, empresasRes, techLeadersRes, extensionistasRes, areasRes] = await Promise.all([
            fetchAPI(`/projeto/${projectId}/`),
            fetchAPI('/empresa/'),
            fetchAPI('/techleader/'),
            fetchAPI('/extensionistas/'),
            fetchAPI('/area_fabrica/')
        ]);

        if (!projectRes.sucesso || !empresasRes.sucesso || !techLeadersRes.sucesso || !extensionistasRes.sucesso || !areasRes.sucesso) {
            alert('Erro ao carregar dados para edição.');
            return;
        }

        const projeto = projectRes.resultado;
        const empresas = empresasRes.resultado;
        const techLeaders = techLeadersRes.resultado;
        const extensionistas = extensionistasRes.resultado;
        const areas = areasRes.resultado;

        const createOptions = (items, selectedId, idField = 'id_usuario', nameField = 'nome') => {
            return items.map(item => 
                `<option value="${item[idField]}" ${item[idField] === selectedId ? 'selected' : ''}>${item[nameField]}</option>`
            ).join('');
        };
        
        const empresaOptions = createOptions(empresas, projeto.empresa_info.id);
        const techLeaderOptions = createOptions(techLeaders, projeto.techleader_info?.id); 
        const extensionistaOptions = extensionistas.map(e => `<option value="${e.usuario_id}">${e.nome}</option>`).join('');
        const areaOptions = areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');

        const formHtml = `
            <form id="form-edit-project">
                <h5>Detalhes do Projeto</h5>
                <div class="row">
                    <div class="col-md-6 mb-3"><label class="form-label">Nome</label><input type="text" id="proj-nome" class="form-control" value="${projeto.nome}" required></div>
                    <div class="col-md-6 mb-3"><label class="form-label">Área</label><input type="text" id="proj-area" class="form-control" value="${projeto.area}" required></div>
                </div>
                <div class="mb-3"><label class="form-label">Descrição</label><textarea id="proj-descricao" class="form-control" rows="2">${projeto.descricao}</textarea></div>
                <div class="row">
                    <div class="col-md-6 mb-3"><label class="form-label">Prazo Final</label><input type="date" id="proj-prazo" class="form-control" value="${projeto.data_prazo}" required></div>
                    <div class="col-md-6 mb-3"><label class="form-label">Progresso (%)</label><input type="number" id="proj-progresso" class="form-control" value="${projeto.progresso}" min="0" max="100"></div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3"><label class="form-label">Status</label><select id="proj-status" class="form-select">${createStatusOptions(projeto.status, 'ativo', 'pausado', 'concluido', 'cancelado')}</select></div>
                    <div class="col-md-6 mb-3"><label class="form-label">Etapa Atual</label><select id="proj-etapa" class="form-select">${createStatusOptions(projeto.etapa_atual, 'planejamento', 'desenvolvimento', 'testes', 'implantacao', 'concluido')}</select></div>
                </div>

                <hr>
                <h5>Responsáveis</h5>
                <div class="row">
                    <div class="col-md-6 mb-3"><label class="form-label">Cliente</label><select id="proj-empresa" class="form-select" required>${empresaOptions}</select></div>
                    <div class="col-md-6 mb-3"><label class="form-label">Líder Técnico</label><select id="proj-techleader" class="form-select"><option value="">Nenhum</option>${techLeaderOptions}</select></div>
                </div>

                <hr>
                <h5>Equipe</h5>
                <div id="equipe-container">
                    </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="btn-add-membro"><i class="bi bi-plus-circle"></i> Adicionar Membro</button>

                <div class="modal-footer mt-4">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </form>
        `;

        document.getElementById('formModalLabel').textContent = `Editar Projeto: ${projeto.nome}`;
        document.getElementById('modal-body-content').innerHTML = formHtml;
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        const equipeContainer = document.getElementById('equipe-container');
        
        const addMembroRow = (membro = null) => {
            const membroRow = document.createElement('div');
            membroRow.className = 'row g-2 align-items-center mb-2 membro-equipe-row';
            const extensionistaSelectOptions = extensionistas.map(e => `<option value="${e.usuario_id}" ${membro && membro.usuario_id === e.usuario_id ? 'selected' : ''}>${e.nome}</option>`).join('');
            const areaSelectOptions = areas.map(a => `<option value="${a.id}" ${membro && membro.cargos[0]?.id === a.id ? 'selected' : ''}>${a.nome}</option>`).join('');
            
            membroRow.innerHTML = `
                <div class="col-sm-5"><select class="form-select select-extensionista">${extensionistaSelectOptions}</select></div>
                <div class="col-sm-5"><select class="form-select select-cargo">${areaSelectOptions}</select></div>
                <div class="col-sm-2"><button type="button" class="btn btn-sm btn-outline-danger btn-remove-membro w-100"><i class="bi bi-x-lg"></i></button></div>
            `;
            equipeContainer.appendChild(membroRow);
            membroRow.querySelector('.btn-remove-membro').addEventListener('click', () => membroRow.remove());
        };

        projeto.equipe_info.forEach(membro => addMembroRow(membro));
        
        document.getElementById('btn-add-membro').addEventListener('click', () => addMembroRow());

        document.getElementById('form-edit-project').addEventListener('submit', async e => {
            e.preventDefault();
            
            const equipe = [];
            document.querySelectorAll('.membro-equipe-row').forEach(row => {
                equipe.push({
                    usuario_id: row.querySelector('.select-extensionista').value,
                    cargos_ids: [row.querySelector('.select-cargo').value]
                });
            });

            const payload = {
                nome: document.getElementById('proj-nome').value,
                area: document.getElementById('proj-area').value,
                data_prazo: document.getElementById('proj-prazo').value,
                descricao: document.getElementById('proj-descricao').value,
                status: document.getElementById('proj-status').value,
                etapa_atual: document.getElementById('proj-etapa').value,
                progresso: document.getElementById('proj-progresso').value,
                empresa_usuario_id: parseInt(document.getElementById('proj-empresa').value),
                techleader_usuario_id: parseInt(document.getElementById('proj-techleader').value) || null,
                equipe: equipe
            };

            const response = await fetchAPI(`/projeto/${projectId}/`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });

            if (response.sucesso) {
                alert('Projeto atualizado com sucesso!');
                formModal.hide();
                loadProjetos();
            } else {
                alert('Erro ao atualizar projeto: ' + (response.detalhes?.join(', ') || response.erro));
            }
        });
    } catch (error) {
        console.error("Erro ao abrir modal de edição de projeto:", error);
    }
}

function createStatusOptions(currentValue, ...options) {
    return options.map(opt => `<option value="${opt.toLowerCase()}" ${currentValue === opt.toLowerCase() ? 'selected' : ''}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`).join('');
}



/**
 * =================================================================
 * 8. SEÇÃO: IMERSÕES E PALESTRAS
 * =================================================================
 */

async function loadImersoes() {
    try {
        const response = await fetchAPI('/imersao/');
        if (!response.sucesso) throw new Error(response.erro);
        
        const imersoes = response.resultado;

        const rows = imersoes.map(im => `
            <tr>
                <td>${im.id}</td>
                <td><span class="badge bg-primary">${im.iteracao_nome}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-info" title="Gerenciar Palestras" onclick="openManagePalestrasModal(${im.id})">
                        <i class="bi bi-mic-fill"></i> Palestras
                    </button>
                    <button class="btn btn-sm btn-outline-danger ms-1" title="Excluir Imersão" onclick="deleteItem(${im.id}, 'imersao', loadImersoes)">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        const html = `
            <h1>Gerenciamento de Imersões</h1>
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Imersões Criadas</h5>
                    <button class="btn btn-success" id="btn-nova-imersao">
                        <i class="bi bi-plus-circle-fill me-2"></i>Nova Imersão
                    </button>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Iteração Vinculada</th>
                                <th class="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.length > 0 ? rows : '<tr><td colspan="3">Nenhuma imersão cadastrada.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        render(html);
        document.getElementById('btn-nova-imersao').addEventListener('click', openCreateImersaoModal);

    } catch (error) {
        console.error("Erro ao carregar imersões:", error);
        render('<h1>Imersões</h1><p class="text-danger">Não foi possível carregar as imersões.</p>');
    }
}

async function openCreateImersaoModal() {
    try {
        const [iteracoesRes, imersoesRes] = await Promise.all([
            fetchAPI('/iteracao/'),
            fetchAPI('/imersao/')
        ]);

        if (!iteracoesRes.sucesso || !imersoesRes.sucesso) {
            alert('Erro ao carregar dados para o formulário.');
            return;
        }

        const todasIteracoes = iteracoesRes.resultado;
        const imersoesExistentes = imersoesRes.resultado;
        const idsIteracoesUsadas = imersoesExistentes.map(im => im.iteracao);
        const iteracoesDisponiveis = todasIteracoes.filter(it => !idsIteracoesUsadas.includes(it.id));

        const iteracaoOptions = iteracoesDisponiveis.map(it => 
            `<option value="${it.id}">${it.ano}.${it.semestre} ${it.ativa ? '(Ativa)' : ''}</option>`
        ).join('');

        const formHtml = `
            <form id="form-create-imersao">
                <div class="mb-3">
                    <label class="form-label">Como deseja criar a Imersão?</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="creation-method" id="method-existing" value="existing" checked>
                        <label class="form-check-label" for="method-existing">
                            Vincular a uma Iteração Existente
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="creation-method" id="method-new" value="new">
                        <label class="form-check-label" for="method-new">
                            Criar Nova Iteração junto com a Imersão
                        </label>
                    </div>
                </div>

                <div id="select-existing-iteracao" class="mb-3">
                    <label for="im-iteracao" class="form-label">Selecione uma Iteração Disponível</label>
                    <select class="form-select" id="im-iteracao">
                        ${iteracaoOptions.length > 0 ? iteracaoOptions : '<option disabled>Nenhuma disponível</option>'}
                    </select>
                </div>

                <div id="create-new-iteracao" class="row d-none">
                    <div class="col-md-6 mb-3">
                        <label for="iteracao-ano" class="form-label">Ano</label>
                        <input type="number" class="form-control" placeholder="Ex: 2025" id="iteracao-ano">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="iteracao-semestre" class="form-label">Semestre</label>
                        <select class="form-select" id="iteracao-semestre">
                            <option value="1">1º Semestre</option>
                            <option value="2">2º Semestre</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Criar Imersão</button>
                </div>
            </form>
        `;

        document.getElementById('formModalLabel').textContent = 'Criar Nova Imersão';
        document.getElementById('modal-body-content').innerHTML = formHtml;
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        const methodRadios = document.querySelectorAll('input[name="creation-method"]');
        const existingDiv = document.getElementById('select-existing-iteracao');
        const newDiv = document.getElementById('create-new-iteracao');

        methodRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'existing') {
                    existingDiv.classList.remove('d-none');
                    newDiv.classList.add('d-none');
                } else {
                    existingDiv.classList.add('d-none');
                    newDiv.classList.remove('d-none');
                }
            });
        });

        document.getElementById('form-create-imersao').addEventListener('submit', async e => {
            e.preventDefault();
            let payload = {};
            const selectedMethod = document.querySelector('input[name="creation-method"]:checked').value;

            if (selectedMethod === 'existing') {
                const iteracaoId = document.getElementById('im-iteracao').value;
                if (!iteracaoId) {
                    alert('Por favor, selecione uma iteração existente.');
                    return;
                }
                payload = { iteracao: iteracaoId };
            } else { 
                const ano = document.getElementById('iteracao-ano').value;
                const semestre = document.getElementById('iteracao-semestre').value;
                if (!ano) {
                    alert('Por favor, informe o ano da nova iteração.');
                    return;
                }
                payload = { ano, semestre };
            }

            const createResponse = await fetchAPI('/imersao/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (createResponse.sucesso) {
                alert('Imersão criada com sucesso!');
                formModal.hide();
                loadImersoes(); 
            } else {
                const errorMsg = createResponse.detalhes?.join(', ') || 'Erro ao criar imersão.';
                alert(errorMsg);
            }
        });

    } catch(error) {
        console.error("Erro ao abrir modal de criação de imersão:", error);
        alert("Ocorreu um erro inesperado.");
    }
}

async function openManagePalestrasModal(imersaoId) {
    try {
        const palestrasRes = await fetchAPI(`/palestra/?imersao_id=${imersaoId}`);
        if (!palestrasRes.sucesso) throw new Error(palestrasRes.erro);

        const palestras = palestrasRes.resultado;
        const palestraRows = palestras.map(p => `
            <tr>
                <td>${p.titulo}</td>
                <td>${p.palestrante}</td>
                <td>${new Date(p.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${p.id}, 'palestra', () => openManagePalestrasModal(${imersaoId}))"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');

        const modalHtml = `
            <h6>Palestras Cadastradas</h6>
            <div class="table-responsive mb-4" style="max-height: 200px; overflow-y: auto;">
                <table class="table table-sm">
                    <thead><tr><th>Título</th><th>Palestrante</th><th>Data</th><th class="text-end">Ações</th></tr></thead>
                    <tbody>${palestraRows.length > 0 ? palestraRows : '<tr><td colspan="4">Nenhuma palestra.</td></tr>'}</tbody>
                </table>
            </div>
            <hr>
            <h6>Adicionar Nova Palestra</h6>
            <form id="form-add-palestra">
                <div class="row">
                    <div class="col-md-8 mb-2"><label class="form-label">Título</label><input type="text" id="palestra-titulo" class="form-control" required></div>
                    <div class="col-md-4 mb-2"><label class="form-label">Palestrante</label><input type="text" id="palestra-palestrante" class="form-control" required></div>
                </div>
                <div class="mb-2"><label class="form-label">Data e Hora</label><input type="datetime-local" id="palestra-data" class="form-control" required></div>
                <div class="modal-footer mt-3"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button><button type="submit" class="btn btn-primary">Adicionar</button></div>
            </form>
        `;

        document.getElementById('formModalLabel').textContent = `Gerenciar Palestras da Imersão #${imersaoId}`;
        document.getElementById('modal-body-content').innerHTML = modalHtml;
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        document.getElementById('form-add-palestra').addEventListener('submit', async e => {
            e.preventDefault();
            const payload = {
                titulo: document.getElementById('palestra-titulo').value,
                palestrante: document.getElementById('palestra-palestrante').value,
                data: document.getElementById('palestra-data').value,
                imersao: imersaoId
            };
            const createResponse = await fetchAPI('/palestra/', { method: 'POST', body: JSON.stringify(payload) });
            if (createResponse.sucesso) openManagePalestrasModal(imersaoId); 
            else alert('Erro ao adicionar palestra.');
        });
    } catch (error) {
        console.error("Erro ao abrir modal de palestras:", error);
    }
}

/**
 * =================================================================
 * 9. SEÇÃO: WORKSHOPS
 * =================================================================
 */

async function loadWorkshops() {
    console.log('Iniciando loadWorkshops...'); 
    try {
        const response = await fetchAPI('/workshop/');
        
        if (!response || !response.sucesso) {
            const errorDetail = response ? (response.detalhes?.join(', ') || response.erro) : "Erro de conexão.";
            render(`<h1>Workshops</h1><p>Não foi possível carregar os workshops: ${errorDetail}</p>`);
            return;
        }

        const workshops = response.resultado;
        if (!Array.isArray(workshops)) {
            render(`<h1>Workshops</h1><p>Ocorreu um erro no formato dos dados recebidos.</p>`);
            return;
        }

        const rows = workshops.map(ws => {
            const instrutores = (ws.instrutores && ws.instrutores.length > 0) 
            ? ws.instrutores.map(i => i.nome).join(', ') 
            : 'N/A';

            return `
                <tr>
                    <td>${ws.id}</td>
                    <td>${ws.titulo}</td>
                    <td>${instrutores}</td>
                    <td><span class="badge bg-secondary">${ws.iteracao_info}</span></td>
                    <td class="text-end">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-info" title="Visualizar Detalhes"><i class="bi bi-eye"></i></button>
                            
                            <button class="btn btn-sm btn-secondary" title="Gerenciar Instrutores" onclick="openManageInstructorsModal(${ws.id})">
                                <i class="bi bi-person-video3"></i>
                            </button>

                            <button class="btn btn-sm btn-primary" title="Gerenciar Participantes" onclick="openManageParticipantsModal(${ws.id})">
                                <i class="bi bi-people-fill"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const html = `
            <h1>Gerenciamento de Workshops</h1>
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Lista de Workshops</h5>
                    <button class="btn btn-success" id="btn-novo-workshop"><i class="bi bi-plus-circle-fill me-2"></i>Novo Workshop</button>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-hover">
                        <thead><tr><th>ID</th><th>Título</th><th>Instrutor(es)</th><th>Iteração</th><th>Ações</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
        render(html);
        document.getElementById('btn-novo-workshop').addEventListener('click', openCreateWorkshopModal);
    } catch (error) {
        console.error("Erro crítico ao carregar workshops:", error);
        render(`<h1>Workshops</h1><p>Ocorreu um erro inesperado. Verifique o console do navegador.</p>`);
    }
}

async function openCreateWorkshopModal() {
    const [areasRes, extensionistasRes] = await Promise.all([
        fetchAPI('/area_fabrica/'),
        fetchAPI('/extensionistas/') 
    ]);

    if (!areasRes.sucesso || !extensionistasRes.sucesso) {
        alert('Erro ao carregar dados para o formulário.');
        return;
    }

    const areas = areasRes.resultado;
    const extensionistas = extensionistasRes.resultado;

    const areaOptions = areas.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
    const instrutorOptions = extensionistas.map(e => `<option value="${e.usuario_id}">${e.nome}</option>`).join('');

    const formHtml = `
        <form id="form-create-workshop">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="ws-titulo" class="form-label">Título do Workshop</label>
                    <input type="text" class="form-control" id="ws-titulo" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="ws-area" class="form-label">Área da Fábrica</label>
                    <select class="form-select" id="ws-area" required>
                        <option value="" disabled selected>Selecione uma área...</option>
                        ${areaOptions}
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label for="ws-descricao" class="form-label">Descrição</label>
                <textarea class="form-control" id="ws-descricao" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="ws-instrutores" class="form-label">Instrutor(es)</label>
                <select multiple class="form-select" id="ws-instrutores" size="5">
                    ${instrutorOptions}
                </select>
                <small class="form-text text-muted">Segure Ctrl (ou Cmd) para selecionar mais de um.</small>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="ws-sala" class="form-label">Sala</label>
                    <input type="text" class="form-control" id="ws-sala">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="ws-bloco" class="form-label">Bloco</label>
                    <input type="text" class="form-control" id="ws-bloco">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Criar Workshop</button>
            </div>
        </form>
    `;

    document.getElementById('formModalLabel').textContent = 'Criar Novo Workshop';
    document.getElementById('modal-body-content').innerHTML = formHtml;
    
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();

    document.getElementById('form-create-workshop').addEventListener('submit', async e => {
        e.preventDefault();

        const selectedInstrutores = Array.from(document.getElementById('ws-instrutores').selectedOptions).map(opt => Number(opt.value));

        const payload = {
            titulo: document.getElementById('ws-titulo').value,
            area: document.getElementById('ws-area').value,
            descricao: document.getElementById('ws-descricao').value,
            sala: document.getElementById('ws-sala').value,
            bloco: document.getElementById('ws-bloco').value,
            instrutores: selectedInstrutores,
        };

        const createResponse = await fetchAPI('/workshop/', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (createResponse.sucesso) {
            alert('Workshop criado com sucesso!');
            formModal.hide();
            loadWorkshops(); 
        } else {
            const errorMsg = createResponse.detalhes?.join(', ') || 'Erro ao criar workshop.';
            alert(errorMsg);
        }
    });
}

async function openManageInstructorsModal(workshopId) {
    try {
        const [workshopRes, extensionistasRes] = await Promise.all([
            fetchAPI(`/workshop/${workshopId}/`),
            fetchAPI('/extensionistas/') 
        ]);

        if (!workshopRes.sucesso || !extensionistasRes.sucesso) {
            alert('Erro ao carregar dados para o gerenciamento.');
            return;
        }

        const workshop = workshopRes.resultado;
        const todosExtensionistas = extensionistasRes.resultado;

        const instrutoresAtuaisDoWorkshop = workshop.instrutores || [];
        const idsInstrutoresAtuais = instrutoresAtuaisDoWorkshop.map(i => i.usuario_id);

        const instrutoresAtuais = todosExtensionistas.filter(e => idsInstrutoresAtuais.includes(e.usuario_id));
        const instrutoresDisponiveis = todosExtensionistas.filter(e => !idsInstrutoresAtuais.includes(e.usuario_id));


        const renderList = (instrutores) => instrutores.map(i => 
            `<li class="list-group-item" data-id="${i.usuario_id}">${i.nome}</li>`
        ).join('');

        const formHtml = `
            <form id="form-manage-instructors">
                <div class="row">
                    <div class="col-md-5">
                        <h6>Extensionistas Disponíveis</h6>
                        <ul id="lista-disponiveis" class="list-group" style="height: 300px; overflow-y: auto;">
                            ${renderList(instrutoresDisponiveis)}
                        </ul>
                    </div>
                    <div class="col-md-2 d-flex flex-column align-items-center justify-content-center">
                        <button type="button" id="btn-add" class="btn btn-success mb-2 w-100">&gt;&gt;</button>
                        <button type="button" id="btn-remove" class="btn btn-danger mt-2 w-100">&lt;&lt;</button>
                    </div>
                    <div class="col-md-5">
                        <h6>Instrutores no Workshop</h6>
                        <ul id="lista-adicionados" class="list-group" style="height: 300px; overflow-y: auto;">
                            ${renderList(instrutoresAtuais)}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer mt-3">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </form>
        `;
        
        document.getElementById('formModalLabel').textContent = `Gerenciar Instrutores - ${workshop.titulo}`;
        document.getElementById('modal-body-content').innerHTML = formHtml;
        
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        const listaDisponiveis = document.getElementById('lista-disponiveis');
        const listaAdicionados = document.getElementById('lista-adicionados');
        let selectedItem = null;
        const selectItem = (item) => {
            document.querySelectorAll('#form-manage-instructors .list-group-item').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            selectedItem = item;
        };
        listaDisponiveis.addEventListener('click', e => e.target.tagName === 'LI' && selectItem(e.target));
        listaAdicionados.addEventListener('click', e => e.target.tagName === 'LI' && selectItem(e.target));
        document.getElementById('btn-add').addEventListener('click', () => { if (selectedItem && selectedItem.parentElement.id === 'lista-disponiveis') listaAdicionados.appendChild(selectedItem); });
        document.getElementById('btn-remove').addEventListener('click', () => { if (selectedItem && selectedItem.parentElement.id === 'lista-adicionados') listaDisponiveis.appendChild(selectedItem); });

        document.getElementById('form-manage-instructors').addEventListener('submit', async e => {
            e.preventDefault();
            const finalInstructorIds = Array.from(listaAdicionados.children).map(li => Number(li.dataset.id));
            const updateResponse = await fetchAPI(`/workshop/${workshopId}/`, {
                method: 'PATCH',
                body: JSON.stringify({ instrutores: finalInstructorIds })
            });

            if (updateResponse.sucesso) {
                alert('Lista de instrutores atualizada!');
                formModal.hide();
                loadWorkshops();
            } else {
                alert('Falha ao atualizar instrutores.');
            }
        });

    } catch (error) {
        console.error("Erro ao abrir modal de instrutores:", error);
        alert('Ocorreu um erro inesperado.');
    }
}

async function openManageParticipantsModal(workshopId) {
    try {
        const [workshopRes, imersionistasRes] = await Promise.all([
            fetchAPI(`/workshop/${workshopId}/`),
            fetchAPI('/imersionista/') 
        ]);

        if (!workshopRes.sucesso || !imersionistasRes.sucesso) {
            alert('Erro ao carregar dados para o gerenciamento.');
            return;
        }

        const workshop = workshopRes.resultado;
        const todosImersionistas = imersionistasRes.resultado;
        const idsParticipantesAtuais = workshop.participantes || [];

        const participantesAtuais = todosImersionistas.filter(p => idsParticipantesAtuais.includes(p.id));
        const participantesDisponiveis = todosImersionistas.filter(p => !idsParticipantesAtuais.includes(p.id));

        const renderList = (participantes) => participantes.map(p => 
            `<li class="list-group-item" data-id="${p.id}">${p.nome} <small class="text-muted">(${p.tipo})</small></li>`
        ).join('');

        const formHtml = `
            <form id="form-manage-participants">
                <div class="row">
                    <div class="col-md-5">
                        <h6>Disponíveis</h6>
                        <ul id="lista-disponiveis" class="list-group" style="height: 300px; overflow-y: auto;">
                            ${renderList(participantesDisponiveis)}
                        </ul>
                    </div>
                    <div class="col-md-2 d-flex flex-column align-items-center justify-content-center">
                        <button type="button" id="btn-add" class="btn btn-success mb-2 w-100">&gt;&gt;</button>
                        <button type="button" id="btn-remove" class="btn btn-danger mt-2 w-100">&lt;&lt;</button>
                    </div>
                    <div class="col-md-5">
                        <h6>No Workshop</h6>
                        <ul id="lista-adicionados" class="list-group" style="height: 300px; overflow-y: auto;">
                            ${renderList(participantesAtuais)}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer mt-3">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </form>
        `;
        
        document.getElementById('formModalLabel').textContent = `Gerenciar Participantes - ${workshop.titulo}`;
        document.getElementById('modal-body-content').innerHTML = formHtml;
        
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();

        const listaDisponiveis = document.getElementById('lista-disponiveis');
        const listaAdicionados = document.getElementById('lista-adicionados');
        let selectedItem = null;

        const selectItem = (item) => {
            document.querySelectorAll('.list-group-item').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            selectedItem = item;
        };

        listaDisponiveis.addEventListener('click', e => e.target.tagName === 'LI' && selectItem(e.target));
        listaAdicionados.addEventListener('click', e => e.target.tagName === 'LI' && selectItem(e.target));

        document.getElementById('btn-add').addEventListener('click', () => {
            if (selectedItem && selectedItem.parentElement.id === 'lista-disponiveis') {
                listaAdicionados.appendChild(selectedItem);
                selectedItem.classList.remove('active');
                selectedItem = null;
            }
        });

        document.getElementById('btn-remove').addEventListener('click', () => {
            if (selectedItem && selectedItem.parentElement.id === 'lista-adicionados') {
                listaDisponiveis.appendChild(selectedItem);
                selectedItem.classList.remove('active');
                selectedItem = null;
            }
        });

        document.getElementById('form-manage-participants').addEventListener('submit', async e => {
            e.preventDefault();
            
            const finalParticipantIds = Array.from(listaAdicionados.children).map(li => Number(li.dataset.id));
            
            const updateResponse = await fetchAPI(`/workshop/${workshopId}/`, {
                method: 'PATCH',
                body: JSON.stringify({ participantes: finalParticipantIds })
            });

            if (updateResponse.sucesso) {
                alert('Lista de participantes atualizada com sucesso!');
                formModal.hide();
                loadWorkshops(); 
            } else {
                alert('Falha ao atualizar participantes.');
            }
        });

    } catch (error) {
        console.error("Erro ao abrir modal de participantes:", error);
        alert('Ocorreu um erro inesperado.');
    }
}


/**
 * =================================================================
 * 10. SEÇÃO: CONFIGURAÇÕES (Itens Globais e Emails)
 * =================================================================
 */

async function toggleItemStatus(itemId, type, newStatus) {
    console.log(`Alterando status para ${type} #${itemId} para: ${newStatus}`);
    try {
        const payload = { ativa: newStatus };
        const response = await fetchAPI(`/${type}/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        if (!response.sucesso) {
            alert('Erro ao alterar o status.');
            loadConfig();
        }
        loadConfig();

    } catch (error) {
        alert('Ocorreu um erro de comunicação com a API.');
        loadConfig(); 
    }
}


async function loadConfig() {
    try {
        const results = await Promise.allSettled([
            fetchAPI('/emails_admins/'),
            fetchAPI('/emails_membros/'),
            fetchAPI('/emails_participantes/'),
            loadIteracoes(),
            fetchAPI('/area_fabrica/'),
            fetchAPI('/tecnologia/')
        ]);

        const getResult = (result, defaultVal = []) => {
            if (result.status === 'fulfilled' && result.value && result.value.sucesso) {
                return result.value.resultado;
            }
            if (result.status === 'fulfilled' && typeof result.value === 'string') {
                return result.value;
            }
            return defaultVal;
        };
        
        const getError = (result) => {
            if (result.status === 'rejected') return 'Erro de conexão ou na API.';
            if (result.value && !result.value.sucesso) return result.value.erro || 'Falha ao carregar dados.';
            return null;
        };

        const admins = getResult(results[0]);
        const membros = getResult(results[1]);
        const participantes = getResult(results[2]);
        const iteracoesHtml = getResult(results[3], '<h3 class="text-danger">Erro ao carregar Iterações</h3>');
        const areas = getResult(results[4]);
        const techs = getResult(results[5]);

        const createEmailList = (title, data, error, type) => {
            const listContent = error 
                ? `<li class="list-group-item"><span class="text-danger">${error}</span></li>`
                : (data && data.length > 0 ? data.map(e => `<li class="list-group-item py-1">${e.email} ${e.iteracao ? `(${e.iteracao})` : ''}</li>`).join('') : '<li class="list-group-item py-1">Nenhum email cadastrado.</li>');
            
            return `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-header"><h5>${title}</h5></div>
                    <div class="card-body" style="max-height: 250px; overflow-y: auto;">
                        <ul class="list-group list-group-flush">${listContent}</ul>
                    </div>
                    <div class="card-footer">
                        <form class="email-form-add" data-type="${type}">
                            <div class="form-group">
                                <label class="form-label small">Adicionar Emails</label>
                                <textarea class="form-control" rows="3" name="add_emails_${type}" placeholder="Cole um ou mais emails para adicionar..."></textarea>
                            </div>
                            <button class="btn btn-secondary btn-sm mt-2" type="submit">Adicionar</button>
                        </form>
                        <hr>
                        <form class="email-form-delete" data-type="${type}">
                            <div class="form-group">
                                <label class="form-label small">Remover Emails</label>
                                <textarea class="form-control" rows="3" name="delete_emails_${type}" placeholder="Cole um ou mais emails para remover..."></textarea>
                            </div>
                            <button class="btn btn-danger btn-sm mt-2" type="submit">Remover</button>
                        </form>
                    </div>
                </div>
            </div>`;
        };
        
        const createSimpleManagementTable = (title, items, error, type) => {
            const tableContent = error
                ? `<tr><td colspan="4" class="text-danger">${error}</td></tr>`
                : (items && items.length > 0 ? items.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="status-switch-${type}-${item.id}" onchange="toggleItemStatus(${item.id}, '${type}', this.checked)" ${item.ativa ? 'checked' : ''}>
                                <label class="form-check-label" for="status-switch-${type}-${item.id}">${item.ativa ? 'Ativa' : 'Inativa'}</label>
                            </div>
                        </td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${item.id}, '${type}', loadConfig)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>`).join('') : '<tr><td colspan="4">Nenhum item cadastrado.</td></tr>');

            return `
            <div class="col-md-6">
                <div class="card h-100">
                    <div class="card-header"><h5>${title}</h5></div>
                    <div class="card-body" style="max-height: 250px; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableContent}
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                        <form class="form-add-simple-item" data-type="${type}">
                            <div class="input-group">
                                <input type="text" class="form-control" name="nome" placeholder="Adicionar novo item..." required>
                                <button class="btn btn-secondary" type="submit">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;
        };

        console.log("4. Montando o HTML...");
        const html = `
            <h1>Configurações do Sistema</h1>
            <div class="mb-4">${iteracoesHtml}</div>
            <h5 class="mt-4">Itens Globais</h5>
            <div class="row mb-4 g-4">
                ${createSimpleManagementTable('Áreas da Fábrica', areas, getError(results[4]), 'area_fabrica')}
                ${createSimpleManagementTable('Tecnologias', techs, getError(results[5]), 'tecnologia')}
            </div>
            <h5 class="mt-4">Listas de Acesso por Email</h5>
            <div class="row g-4">
                ${createEmailList('Admins', admins, getError(results[0]), 'admins')}
                ${createEmailList('Membros (Empresa/TL)', membros, getError(results[1]), 'membros')}
                ${createEmailList('Participantes', participantes, getError(results[2]), 'participantes')}
            </div>
        `;

        render(html);
        console.log("5. HTML renderizado na tela.");
        
        setupConfigEventListeners();
        console.log("6. Listeners de eventos configurados.");

    } catch (error) {
        console.error("Erro crítico ao carregar configurações:", error);
        render(`<h1>Configurações</h1><p>Ocorreu um erro inesperado.</p>`);
    }
}

function setupConfigEventListeners() {
    const novaIteracaoForm = document.getElementById('form-nova-iteracao');
    if (novaIteracaoForm) {
        novaIteracaoForm.addEventListener('submit', async e => {
            e.preventDefault();
            const ano = document.getElementById('iteracao-ano').value;
            const semestre = document.getElementById('iteracao-semestre').value;
            const response = await fetchAPI('/iteracao/', {
                method: 'POST',
                body: JSON.stringify({ ano, semestre, ativa: true })
            });
            if (response.sucesso) {
                alert('Iteração criada com sucesso!');
                loadConfig();
            } else {
                alert('Erro ao criar iteração: ' + (response.detalhes?.join(', ') || response.erro));
            }
        });
    }
    
    document.querySelectorAll('.email-form-add').forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const textarea = form.querySelector('textarea');
            const rawText = textarea.value;
            const type = form.dataset.type;
            const endpoint = `/emails_${type}/`;

            const emails = rawText.replace(/,|\n|;/g, ' ').split(' ').filter(email => email && email.includes('@'));

            if (emails.length === 0) {
                alert('Por favor, insira pelo menos um email válido para adicionar.');
                return;
            }
            
            const res = await fetchAPI(endpoint, {
                method: 'POST',
                body: JSON.stringify({ emails: emails })
            });
            
            if(res.sucesso && res.resultado) {
                const criadosCount = res.resultado.criados?.length || 0;
                const rejeitadosCount = res.resultado.rejeitados?.length || 0;
                alert(`${criadosCount} email(s) adicionado(s) com sucesso.\n${rejeitadosCount} email(s) foram rejeitados (provavelmente já existiam).`);
                loadConfig();
            } else {
                alert('Ocorreu uma falha ao adicionar os emails.');
            }
        });
    });

    document.querySelectorAll('.email-form-delete').forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const textarea = form.querySelector('textarea');
            const rawText = textarea.value;
            const type = form.dataset.type;
            const endpoint = `/emails_${type}/delete_bulk/`;

            const emails = rawText.replace(/,|\n|;/g, ' ').split(' ').filter(email => email && email.includes('@'));

            if (emails.length === 0) {
                alert('Por favor, insira pelo menos um email válido para remover.');
                return;
            }

            if (!confirm(`Tem certeza que deseja tentar remover ${emails.length} email(s) desta lista?`)) {
                return;
            }
            
            const res = await fetchAPI(endpoint, {
                method: 'POST',
                body: JSON.stringify({ emails: emails })
            });
            
            if(res.sucesso && res.resultado) {
                const removidosCount = res.resultado.removidos?.length || 0;
                const falhasCount = res.resultado.falhas?.length || 0;
                alert(`${removidosCount} email(s) removido(s) com sucesso.\n${falhasCount} email(s) não foram encontrados na lista.`);
                loadConfig();
            } else {
                alert('Ocorreu uma falha ao remover os emails.');
            }
        });
    });
    
    document.querySelectorAll('.form-add-simple-item').forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const type = form.dataset.type;
            const input = form.querySelector('input');
            const nome = input.value;
            if (!nome) return;
            const response = await fetchAPI(`/${type}/`, {
                method: 'POST',
                body: JSON.stringify({ nome: nome, ativa: true })
            });
            if(response.sucesso) {
                loadConfig();
            } else {
                alert('Erro ao adicionar item: ' + (response.detalhes?.join(', ') || response.erro));
            }
        });
    });
}

async function loadIteracoes() {
    const response = await fetchAPI('/iteracao/');
    if (!response || !response.sucesso) {
        return '<h3>Iterações</h3><p>Erro ao carregar iterações.</p>';
    }

    const iteracoes = response.resultado;
    const rows = iteracoes.map(it => `
        <tr>
            <td>${it.id}</td>
            <td>${it.ano}.${it.semestre}</td>
            <td>
                ${it.ativa 
                    ? '<span class="badge bg-success">Ativa</span>' 
                    : `<button class="btn btn-sm btn-outline-success" onclick="ativarIteracao(${it.id})">Ativar</button>`
                }
            </td>
        </tr>
    `).join('');

    return `
        <div class="card">
            <div class="card-header">
                <h5>Gerenciamento de Iterações</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-7">
                        <table class="table">
                            <thead><tr><th>ID</th><th>Ciclo</th><th>Status</th></tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                    <div class="col-md-5">
                        <h6>Nova Iteração</h6>
                        <form id="form-nova-iteracao">
                            <div class="input-group">
                                <input type="number" class="form-control" placeholder="Ano (ex: 2025)" id="iteracao-ano" required>
                                <select class="form-select" id="iteracao-semestre" required>
                                    <option value="1">1º Sem</option>
                                    <option value="2">2º Sem</option>
                                </select>
                                <button class="btn btn-primary" type="submit">Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function ativarIteracao(iteracaoId) {
    if (!confirm('Deseja ativar esta iteração? A outra será desativada automaticamente.')) return;

    const response = await fetchAPI(`/iteracao/${iteracaoId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ ativa: true })
    });

    if (response.sucesso) {
        alert('Iteração ativada com sucesso!');
        loadConfig(); 
    } else {
        alert('Falha ao ativar iteração.');
    }
}

/**
 * =================================================================
 * 11. FUNÇÕES AUXILIARES GLOBAIS
 * =================================================================
 */

async function deleteItem(itemId, type, callbackOnSuccess) {
    const endpoint = `/${type}/${itemId}/`;
    if (!confirm(`Tem certeza que deseja excluir o item #${itemId}? Esta ação não pode ser desfeita.`)) return;
    
    try {
        const response = await fetchAPI(endpoint, { method: 'DELETE' });
        if (response.sucesso) {
            alert('Item excluído com sucesso.');
            if (callbackOnSuccess) callbackOnSuccess();
        } else {
            alert('Erro ao excluir item: ' + (response.detalhes?.join(', ') || response.erro || 'Erro desconhecido.'));
        }
    } catch(e) {
        console.error(`Erro ao deletar ${type}:`, e);
        alert('Ocorreu um erro na exclusão.');
    }
}