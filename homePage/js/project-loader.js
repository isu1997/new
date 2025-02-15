import projects from './projects-data.js';

function loadProject() {
   // חילוץ ישיר של הערך מהכתובת
const projectId = window.location.search.substring(1).replace('project=', '');

console.log('Raw Project ID:', projectId);

const project = projects[projectId];

if (!project) {
    console.error(`Project not found. Tried: ${projectId}`);
    console.log('Available projects:', Object.keys(projects));
    return;
}
document.title = `Link to ${project.title}`;
document.querySelector('#headline h1').textContent = project.title;
document.querySelector('#headline p').textContent = project.description;
document.querySelector('#project-img-div img').src = project.image;
document.getElementById('projectPageLink').href = project.projectPath;
document.getElementById('downloadLink').href = project.downloadPath;

function getColumnClass(numTechnologies) {
    switch(numTechnologies) {
        case 2:
            return 'col-12 col-md-6';  // במובייל - שורה אחת, בדסקטופ - 2 בשורה
        case 3:
            return 'col-12 col-md-4';  // במובייל - שורה אחת, בדסקטופ - 3 בשורה
        case 4:
            return 'col-12 col-md-3';  // במובייל - שורה אחת, בדסקטופ - 4 בשורה
        default:
            return 'col-12 col-md-3';  // ברירת מחדל
    }
}

const technologiesContainer = document.querySelector('.row');
technologiesContainer.innerHTML = project.technologies.map(tech => `
    <div class="${getColumnClass(project.technologies.length)} d-flex justify-content-center mb-3 text-center">
        <div class="card" id="card-link">
            <i class="fa-brands fa-${tech}" style="color: ${getTechColor(tech)}; font-size: 50px;"></i>
            <h2><br>${tech.toUpperCase()}</h2>
        </div>
    </div>
`).join('');
}

function getTechColor(tech) {
    const colors = {
    'html5': '#e06925',
    'css3-alt': '#1970ae',
    'sass': '#ba4176',
    'js': '#f7df1e',
    'bootstrap': '#7952B3'
};
    return colors[tech] || '#000000';
}

document.addEventListener('DOMContentLoaded', loadProject);