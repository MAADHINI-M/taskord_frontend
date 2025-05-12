let projects = [
    { id: 1, name: "Website Redesign", tasks: 25, dueDate: "2025-05-01", progress: 70, team: ["John Doe", "Jane Smith"], description: "Redesign company website" },
    { id: 2, name: "Mobile App", tasks: 18, dueDate: "2025-06-15", progress: 45, team: ["Mike Johnson"], description: "Develop mobile app" }
];

let teamMembers = [
    { name: "John Doe", role: "Project Manager", workload: 75, status: "online", tasks: 10, completed: 7 },
    { name: "Jane Smith", role: "UI/UX Designer", workload: 90, status: "busy", tasks: 15, completed: 12 },
    { name: "Mike Johnson", role: "Backend Developer", workload: 60, status: "online", tasks: 8, completed: 4 },
    { name: "Sarah Williams", role: "QA Engineer", workload: 40, status: "offline", tasks: 5, completed: 3 }
];

let tasks = [
    { id: 1, title: "Design Homepage", projectId: 1, assignedTo: "Jane Smith", dueDate: "2025-04-15", priority: "high", progress: 80 },
    { id: 2, title: "API Integration", projectId: 2, assignedTo: "Mike Johnson", dueDate: "2025-05-01", priority: "medium", progress: 50 }
];

let activities = [
    { user: "Jane Smith", action: "approved project", task: "Website Redesign", time: "1 hour ago" },
    { user: "Mike Johnson", action: "reported issue in", task: "Mobile App", time: "3 hours ago" }
];

let messages = [
    { user: "John Doe", message: "Please review the latest design mockups.", time: "2 hours ago" },
    { user: "Jane Smith", message: "API endpoints are ready for testing.", time: "1 hour ago" }
];

let editingProjectId = null;
let isTeamMembersCollapsed = false;

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderManagerDashboard();
    showManagerDashboard();
    updateNotificationCount();
});

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function showManagerDashboard() {
    hideAllViews();
    document.getElementById('managerDashboardView').classList.remove('hidden');
    renderManagerDashboard();
    updateActiveNavItem('showManagerDashboard');
}

function showTeamPerformance() {
    hideAllViews();
    document.getElementById('teamPerformanceView').classList.remove('hidden');
    renderTeamPerformance();
    updateActiveNavItem('showTeamPerformance');
}

function showProjectOverview() {
    hideAllViews();
    document.getElementById('projectOverviewView').classList.remove('hidden');
    renderProjectList();
    updateActiveNavItem('showProjectOverview');
}

function showResourceAllocation() {
    hideAllViews();
    document.getElementById('resourceAllocationView').classList.remove('hidden');
    renderResourceAllocation();
    updateActiveNavItem('showResourceAllocation');
}

function showReports() {
    hideAllViews();
    document.getElementById('reportsView').classList.remove('hidden');
    renderReports();
    updateActiveNavItem('showReports');
}

function showChat() {
    hideAllViews();
    document.getElementById('chatView').classList.remove('hidden');
    renderChat();
    updateActiveNavItem('showChat');
}

function showSettings() {
    hideAllViews();
    document.getElementById('settingsView').classList.remove('hidden');
    renderSettings();
    updateActiveNavItem('showSettings');
}

function hideAllViews() {
    document.querySelectorAll('main > div').forEach(view => view.classList.add('hidden'));
}

function updateActiveNavItem(activeItem) {
    document.querySelectorAll('.sidebar a').forEach(item => {
        item.classList.remove('active');
        if (item.onclick.toString().includes(activeItem)) item.classList.add('active');
    });
}

function renderSidebar() {
    const teamContent = document.getElementById('teamMembersContent');
    teamContent.innerHTML = teamMembers.map(member => `
        <div class="team-member" onclick="toggleMemberStatus('${member.name}')">
            <div class="avatar-container">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}">
                <div class="status ${member.status}" title="${member.status}"></div>
            </div>
            <span>${member.name}</span>
        </div>
    `).join('');
    // Ensure visibility based on collapse state
    teamContent.style.display = isTeamMembersCollapsed ? 'none' : 'block';
    document.querySelector('.team-members .fa-chevron-down').classList.toggle('fa-chevron-up', isTeamMembersCollapsed);
}

function filterTeamMembers(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMembers = teamMembers.filter(member => member.name.toLowerCase().includes(searchTerm));
    const teamContent = document.getElementById('teamMembersContent');
    teamContent.innerHTML = filteredMembers.map(member => `
        <div class="team-member" onclick="toggleMemberStatus('${member.name}')">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}">
            <span>${member.name}</span>
            <div class="status ${member.status}" title="${member.status}"></div>
        </div>
    `).join('');
}

function toggleTeamMembers() {
    isTeamMembersCollapsed = !isTeamMembersCollapsed;
    const teamContent = document.getElementById('teamMembersContent');
    teamContent.style.display = isTeamMembersCollapsed ? 'none' : 'block';
    const icon = document.querySelector('.team-members .fa-chevron-down');
    icon.classList.toggle('fa-chevron-up', isTeamMembersCollapsed);
    icon.classList.toggle('fa-chevron-down', !isTeamMembersCollapsed);
}

function toggleMemberStatus(name) {
    const member = teamMembers.find(m => m.name === name);
    if (member) {
        if (member.status === 'online') member.status = 'busy';
        else if (member.status === 'busy') member.status = 'offline';
        else member.status = 'online';
        renderSidebar();
        renderTeamPerformance();
        renderResourceAllocation();
        showToast(`${member.name}'s status updated to ${member.status}`, 'success');
    }
}

function addTeamMember() {
    const name = prompt("Enter new team member's name:");
    if (name && !teamMembers.some(m => m.name === name)) {
        const newMember = {
            name,
            role: "Team Member",
            workload: 0,
            status: "offline",
            tasks: 0,
            completed: 0
        };
        teamMembers.push(newMember);
        renderSidebar();
        renderTeamPerformance();
        renderResourceAllocation();
        showToast(`${name} added to the team`, 'success');
    } else if (name) {
        showToast('Team member already exists', 'error');
    }
}

function renderManagerDashboard() {
    const container = document.getElementById('dashboardContainer');
    const completed = projects.reduce((sum, p) => sum + (p.progress === 100 ? 1 : 0), 0);
    const inProgress = projects.reduce((sum, p) => sum + (p.progress > 0 && p.progress < 100 ? 1 : 0), 0);
    const pending = projects.length - completed - inProgress;
    const overdue = projects.filter(p => new Date(p.dueDate) < new Date()).length;
    const progressPercentage = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) || 0;

    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-project-diagram"></i> Overall Project Status</h3>
            <div class="progress-circle">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#3a3a3a" stroke-width="10" fill="none"/>
                    <circle cx="50" cy="50" r="40" stroke="#a100ff" stroke-width="10" fill="none" stroke-dasharray="${progressPercentage * 2.51} 251" stroke-linecap="round"/>
                    <text x="50" y="55" text-anchor="middle">${progressPercentage}%</text>
                </svg>
            </div>
            <div class="progress-stats">
                <div class="blue"><div class="count">${completed}</div><div>Completed</div></div>
                <div class="green"><div class="count">${inProgress}</div><div>In Progress</div></div>
                <div class="purple"><div class="count">${pending}</div><div>Pending</div></div>
                <div class="red"><div class="count">${overdue}</div><div>Overdue</div></div>
            </div>
        </div>
        <div class="dashboard-card">
            <h3><i class="fas fa-users-cog"></i> Team Workload</h3>
            <div class="team-performance">
                ${teamMembers.slice(0, 3).map(member => `
                    <div class="team-member-perf">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}">
                        <div class="team-member-info">
                            <div class="team-member-name">${member.name}</div>
                            <div class="team-member-role">${member.role}</div>
                            <div class="performance-bar"><div style="width: ${member.workload}%"></div></div>
                        </div>
                        <div class="performance-value">${member.workload}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="dashboard-card">
            <h3><i class="fas fa-rss"></i> Recent Activity</h3>
            <ul class="activity-feed">
                ${activities.map(activity => `
                    <li class="activity-item">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user)}" class="activity-avatar" alt="${activity.user}">
                        <div class="activity-content">
                            <span class="activity-user">${activity.user}</span>
                            <span class="activity-action">${activity.action}</span>
                            <span class="activity-task">${activity.task}</span>
                            <div class="activity-time"><i class="far fa-clock"></i><span>${activity.time}</span></div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function renderTeamPerformance() {
    const container = document.getElementById('teamPerformanceContainer');
    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-medal"></i> Team Performance Overview</h3>
            <div class="team-performance">
                ${teamMembers.map(member => `
                    <div class="team-member-perf">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}">
                        <div class="team-member-info">
                            <div class="team-member-name">${member.name}</div>
                            <div class="team-member-role">${member.role}</div>
                            <div class="performance-bar"><div style="width: ${member.workload}%"></div></div>
                        </div>
                        <div class="performance-value">${member.workload}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProjectList(filter = 'all') {
    const list = document.getElementById('projectList');
    const select = document.querySelector('.dashboard-select');
    select.innerHTML = '<option value="all">All Projects</option>' + projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('');

    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.name === filter);
    list.innerHTML = filteredProjects.map(project => `
        <div class="list-item">
            <div class="details">
                <div class="title">${project.name}</div>
                <div class="meta">
                    <div class="meta-item"><i class="fas fa-tasks"></i> ${project.tasks} Tasks</div>
                    <div class="meta-item"><i class="fas fa-calendar"></i> Due: ${project.dueDate}</div>
                </div>
                <div class="progress-container">
                    <div class="progress-info"><span>Progress</span><span>${project.progress}%</span></div>
                    <div class="progress-bar"><div style="width: ${project.progress}%"></div></div>
                </div>
            </div>
            <div class="actions">
                <button class="primary" onclick="viewProjectDetails(${project.id})"><i class="fas fa-eye"></i> View</button>
                <button onclick="editProject(${project.id})"><i class="fas fa-edit"></i> Edit</button>
            </div>
        </div>
    `).join('');
}

function renderResourceAllocation() {
    const container = document.getElementById('resourceAllocationContainer');
    const taskDistribution = teamMembers.map(member => ({
        name: member.name,
        tasks: tasks.filter(t => t.assignedTo === member.name).length
    }));

    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-tasks"></i> Task Assignment & Monitoring</h3>
            <table class="resource-table">
                <thead>
                    <tr>
                        <th>Team Member</th>
                        <th>Assigned Tasks</th>
                        <th>Completed</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    ${teamMembers.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.tasks}</td>
                            <td>${member.completed}</td>
                            <td>
                                <div class="progress-bar"><div style="width: ${(member.completed / member.tasks * 100) || 0}%"></div></div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="dashboard-card">
            <h3><i class="fas fa-chart-bar"></i> Resource Utilization</h3>
            <div class="task-progress">
                ${taskDistribution.map(dist => `
                    <div data-value="${dist.tasks}" style="height: ${dist.tasks * 10}px;"></div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                ${taskDistribution.map(dist => `<span>${dist.name.split(' ')[0]}</span>`).join('')}
            </div>
        </div>
    `;
}

function renderReports() {
    const container = document.getElementById('reportsContainer');
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.progress === 100).length;
    const avgCompletionTime = tasks.reduce((sum, t) => sum + (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24), 0) / tasks.length || 0;
    const teamEfficiency = Math.round(teamMembers.reduce((sum, m) => sum + (m.completed / m.tasks * 100 || 0), 0) / teamMembers.length);

    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-chart-pie"></i> Performance Analysis</h3>
            <div class="progress-circle">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#3a3a3a" stroke-width="10" fill="none"/>
                    <circle cx="50" cy="50" r="40" stroke="#a100ff" stroke-width="10" fill="none" stroke-dasharray="${teamEfficiency * 2.51} 251" stroke-linecap="round"/>
                    <text x="50" y="55" text-anchor="middle">${teamEfficiency}%</text>
                </svg>
            </div>
            <div class="progress-stats">
                <div class="blue"><div class="count">${totalTasks}</div><div>Total Tasks</div></div>
                <div class="green"><div class="count">${completedTasks}</div><div>Completed</div></div>
                <div class="red"><div class="count">${totalTasks - completedTasks}</div><div>Pending</div></div>
            </div>
        </div>
        <div class="dashboard-card">
            <h3><i class="fas fa-clock"></i> Productivity Analytics</h3>
            <div class="task-list">
                <li>
                    <div class="task-info">
                        <div class="task-title">Average Completion Time</div>
                        <div class="task-due">${Math.abs(avgCompletionTime.toFixed(1))} days ${avgCompletionTime < 0 ? 'overdue' : 'remaining'}</div>
                    </div>
                </li>
                <li>
                    <div class="task-info">
                        <div class="task-title">Team Efficiency</div>
                        <div class="task-due">${teamEfficiency}%</div>
                    </div>
                </li>
            </div>
        </div>
    `;
}

function renderChat() {
    const container = document.getElementById('chatContainerView');
    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-comments"></i> Team Communication</h3>
            <div class="chat-container" id="chatMessages">
                ${messages.map(msg => `
                    <div class="chat-message">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user)}" class="activity-avatar" alt="${msg.user}">
                        <div class="activity-content">
                            <span class="activity-user">${msg.user}</span>
                            <span class="activity-action">${msg.message}</span>
                            <div class="activity-time"><i class="far fa-clock"></i><span>${msg.time}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="chat-input">
                <textarea id="chatMessage" placeholder="Type your message..."></textarea>
                <button class="dashboard-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i> Send</button>
            </div>
        </div>
    `;
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to latest message
}

function renderSettings() {
    const container = document.getElementById('settingsContainer');
    container.innerHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-cog"></i> General Settings</h3>
            <form class="settings-form">
                <div class="form-group">
                    <label for="notificationPref">Notification Preference</label>
                    <select id="notificationPref">
                        <option value="all">All Updates</option>
                        <option value="important">Important Only</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reportFreq">Report Frequency</label>
                    <select id="reportFreq">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <button type="button" class="dashboard-btn" onclick="saveSettings()">Save Settings</button>
            </form>
        </div>
    `;
}

function openAddProjectModal() {
    editingProjectId = null;
    const modal = document.getElementById('projectModal');
    document.getElementById('projectModalTitle').textContent = 'Add New Project';
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectDueDate').value = '';
    document.getElementById('deleteProjectBtn').classList.add('hidden');
    renderTeamSelect([]);
    modal.style.display = 'flex';
}

function editProject(id) {
    editingProjectId = id;
    const project = projects.find(p => p.id === id);
    const modal = document.getElementById('projectModal');
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectDueDate').value = project.dueDate;
    document.getElementById('deleteProjectBtn').classList.remove('hidden');
    renderTeamSelect(project.team);
    modal.style.display = 'flex';
}

function renderTeamSelect(selectedTeam) {
    const teamSelect = document.getElementById('teamSelect');
    teamSelect.innerHTML = teamMembers.map(member => `
        <label class="teamSelectLabel">
            <input type="checkbox" name="teamMembers" class="teamSelectCheckBox" value="${member.name}" ${selectedTeam.includes(member.name) ? 'checked' : ''}>
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}"> ${member.name}
        </label>
    `).join('');
}

function saveProject() {
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const dueDate = document.getElementById('projectDueDate').value;
    const team = Array.from(document.querySelectorAll('input[name="teamMembers"]:checked')).map(input => input.value);

    if (!name || !dueDate) {
        showToast('Project name and due date are required', 'error');
        return;
    }

    if (editingProjectId) {
        const project = projects.find(p => p.id === editingProjectId);
        project.name = name;
        project.description = description;
        project.dueDate = dueDate;
        project.team = team;
        showToast('Project updated successfully', 'success');
    } else {
        const newProject = {
            id: projects.length + 1,
            name,
            description,
            dueDate,
            tasks: 0,
            progress: 0,
            team
        };
        projects.push(newProject);
        showToast('Project added successfully', 'success');
    }

    closeModal();
    renderManagerDashboard();
    renderProjectList();
    renderResourceAllocation();
    renderReports();
}

function deleteProject() {
    projects = projects.filter(p => p.id !== editingProjectId);
    tasks = tasks.filter(t => t.projectId !== editingProjectId);
    showToast('Project deleted successfully', 'success');
    closeModal();
    renderManagerDashboard();
    renderProjectList();
    renderResourceAllocation();
    renderReports();
}

function openAssignTaskModal() {
    const modal = document.getElementById('taskModal');
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskPriority').value = 'medium';
    renderTaskTeamSelect([]);
    modal.style.display = 'flex';
}

function renderTaskTeamSelect(selectedTeam) {
    const teamSelect = document.getElementById('taskTeamSelect');
    teamSelect.innerHTML = teamMembers.map(member => `
        <label>
            <input type="checkbox" name="taskTeamMembers" value="${member.name}" ${selectedTeam.includes(member.name) ? 'checked' : ''}>
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}" alt="${member.name}"> ${member.name}
        </label>
    `).join('');
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const assignedTo = Array.from(document.querySelectorAll('input[name="taskTeamMembers"]:checked')).map(input => input.value);

    if (!title || !dueDate || assignedTo.length === 0) {
        showToast('Task title, due date, and at least one assignee are required', 'error');
        return;
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        projectId: projects.length > 0 ? projects[0].id : null, // Assign to first project by default
        assignedTo: assignedTo[0], // Simplification: first assignee for now
        dueDate,
        priority,
        progress: 0
    };
    tasks.push(newTask);
    teamMembers.find(m => m.name === newTask.assignedTo).tasks += 1;
    showToast('Task assigned successfully', 'success');
    closeModal();
    renderResourceAllocation();
    renderReports();
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('taskModal').style.display = 'none';
}

function filterProjects(event) {
    const searchTerm = event.target.value.toLowerCase();
    renderProjectList();
    const items = document.querySelectorAll('.list-item');
    items.forEach(item => {
        const title = item.querySelector('.title').textContent.toLowerCase();
        item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
    });
}

function filterByProject(value) {
    renderProjectList(value);
}

function viewMemberDetails(name) {
    const member = teamMembers.find(m => m.name === name);
    showToast(`${member.name} - ${member.role}, Workload: ${member.workload}%, Tasks: ${member.tasks}, Completed: ${member.completed}`, 'info');
}

function viewProjectDetails(id) {
    const project = projects.find(p => p.id === id);
    showToast(`Viewing ${project.name}: ${project.tasks} tasks, ${project.progress}% complete, Team: ${project.team.join(', ')}`, 'info');
}

function generateReport() {
    showToast('Report generation would be implemented here (e.g., PDF/CSV export)', 'info');
}

function sendMessage() {
    const message = document.getElementById('chatMessage').value.trim();
    if (!message) {
        showToast('Message cannot be empty', 'error');
        return;
    }
    messages.push({ user: "Manager Name", message, time: "Just now" });
    document.getElementById('chatMessage').value = '';
    renderChat();
    showToast('Message sent successfully', 'success');
}

function saveSettings() {
    const notificationPref = document.getElementById('notificationPref').value;
    const reportFreq = document.getElementById('reportFreq').value;
    showToast(`Settings saved: Notifications - ${notificationPref}, Report Frequency - ${reportFreq}`, 'success');
}

function showNotifications() {
    showToast(`You have ${activities.length} recent activities`, 'info');
}

function updateNotificationCount() {
    document.getElementById('notificationCount').textContent = activities.length;
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="close-toast" onclick="this.parentElement.remove()">×</button>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Dynamic responsiveness
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    if (width <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});

function showCurrentTimeInPage(){
    let el = document.getElementById("profileDate");
    const date = new Date();
    let mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    let rs = `${date.getHours() > 12 ? (date.getHours()-12).toString().padStart(2,'0') : date.getHours().toString().padStart(2,'0')}:${date.getMinutes() > 12 ? date.getMinutes().toString().padStart(2,'0') : date.getMinutes().toString().padStart(2,'0')} ${date.getHours() > 12 ? "PM" : "AM"} • ${days[date.getDay()]}, ${mons[date.getMonth()]} ${date.getDate()} `
    el.innerText = rs
}
showCurrentTimeInPage()
setInterval(showCurrentTimeInPage, 10000);

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    document.getElementsByTagName('main')[0].classList.toggle('active');
}
