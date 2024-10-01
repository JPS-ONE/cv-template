let cvData = {};

async function loadCV() {
    const response = await fetch('cv-data.json');
    cvData = await response.json();
    renderCV(cvData);
}

function renderCV(data) {
    document.getElementById('foto').src = data.foto || 'placeholder.jpg';
    document.getElementById('nombre').textContent = data.nombre;
    document.getElementById('email').textContent = data.email;
    document.getElementById('telefono').textContent = data.telefono;

    const experienciaList = document.getElementById('experiencia');
    experienciaList.innerHTML = '';
    data.experiencia.forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${exp.puesto}</strong> en ${exp.empresa}<br>
                        ${exp.periodo}<br>
                        ${exp.descripcion}`;
        experienciaList.appendChild(li);
    });

    const educacionList = document.getElementById('educacion');
    educacionList.innerHTML = '';
    data.educacion.forEach(edu => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${edu.titulo}</strong><br>
                        ${edu.institucion}, ${edu.año}`;
        educacionList.appendChild(li);
    });

    const habilidadesList = document.getElementById('habilidades');
    habilidadesList.innerHTML = '';
    data.habilidades.forEach(hab => {
        const li = document.createElement('li');
        li.textContent = hab;
        habilidadesList.appendChild(li);
    });

    applyCustomStyles(data.styles);
}

function applyCustomStyles(styles) {
    if (styles) {
        document.documentElement.style.setProperty('--font-size-p', styles.fontSizeP + 'px');
        document.documentElement.style.setProperty('--font-size-h1', styles.fontSizeH1 + 'px');
        document.documentElement.style.setProperty('--font-size-h2', styles.fontSizeH2 + 'px');
    }
}

function showForm() {
    document.getElementById('cv-container').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
    
    document.getElementById('foto-preview').src = cvData.foto || 'placeholder.jpg';
    document.getElementById('foto-preview').style.display = 'block';
    document.getElementById('nombre-input').value = cvData.nombre;
    document.getElementById('email-input').value = cvData.email;
    document.getElementById('telefono-input').value = cvData.telefono;

    const experienciaInputs = document.getElementById('experiencia-inputs');
    experienciaInputs.innerHTML = '';
    cvData.experiencia.forEach((exp, index) => {
        addExperienciaInput(exp, index);
    });

    const educacionInputs = document.getElementById('educacion-inputs');
    educacionInputs.innerHTML = '';
    cvData.educacion.forEach((edu, index) => {
        addEducacionInput(edu, index);
    });

    const habilidadesInputs = document.getElementById('habilidades-inputs');
    habilidadesInputs.innerHTML = '';
    cvData.habilidades.forEach((hab, index) => {
        addHabilidadInput(hab, index);
    });

    if (cvData.styles) {
        document.getElementById('font-size-p').value = cvData.styles.fontSizeP;
        document.getElementById('font-size-h1').value = cvData.styles.fontSizeH1;
        document.getElementById('font-size-h2').value = cvData.styles.fontSizeH2;
    }
}

function addExperienciaInput(exp = {}, index) {
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" name="experiencia[${index}][puesto]" placeholder="Puesto" value="${exp.puesto || ''}" required>
        <input type="text" name="experiencia[${index}][empresa]" placeholder="Empresa" value="${exp.empresa || ''}" required>
        <input type="text" name="experiencia[${index}][periodo]" placeholder="Periodo" value="${exp.periodo || ''}" required>
        <textarea name="experiencia[${index}][descripcion]" placeholder="Descripción" required>${exp.descripcion || ''}</textarea>
        <button class="delete-btn">Eliminar</button> 
        <hr>
        `;
    document.getElementById('experiencia-inputs').appendChild(div);
}

function addEducacionInput(edu = {}, index) {
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" name="educacion[${index}][titulo]" placeholder="Título" value="${edu.titulo || ''}" required>
        <input type="text" name="educacion[${index}][institucion]" placeholder="Institución" value="${edu.institucion || ''}" required>
        <input type="text" name="educacion[${index}][año]" placeholder="Año" value="${edu.año || ''}" required>
        <button class="delete-btn">Eliminar</button> 
        <hr>
        `;
    document.getElementById('educacion-inputs').appendChild(div);
}

function addHabilidadInput(hab = '', index) {
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" name="habilidades[]" placeholder="Habilidad" value="${hab}" required>
        <button class="delete-btn">Eliminar</button> 
        `;
    document.getElementById('habilidades-inputs').appendChild(div);
}

function saveCV(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newData = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        experiencia: [],
        educacion: [],
        habilidades: formData.getAll('habilidades[]'),
        styles: {
            fontSizeP: parseInt(formData.get('font-size-p')),
            fontSizeH1: parseInt(formData.get('font-size-h1')),
            fontSizeH2: parseInt(formData.get('font-size-h2'))
        }
    };

    const experienciaInputs = document.querySelectorAll('#experiencia-inputs > div');
    experienciaInputs.forEach((div, index) => {
        newData.experiencia.push({
            puesto: formData.get(`experiencia[${index}][puesto]`),
            empresa: formData.get(`experiencia[${index}][empresa]`),
            periodo: formData.get(`experiencia[${index}][periodo]`),
            descripcion: formData.get(`experiencia[${index}][descripcion]`)
        });
    });

    const educacionInputs = document.querySelectorAll('#educacion-inputs > div');
    educacionInputs.forEach((div, index) => {
        newData.educacion.push({
            titulo: formData.get(`educacion[${index}][titulo]`),
            institucion: formData.get(`educacion[${index}][institucion]`),
            año: formData.get(`educacion[${index}][año]`)
        });
    });

    // Manejar la foto
    const fotoFile = formData.get('foto');
    if (fotoFile.size > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newData.foto = e.target.result;
            cvData = newData;
            renderCV(cvData);
            hideForm();
        };
        reader.readAsDataURL(fotoFile);
    } else {
        newData.foto = cvData.foto;
        cvData = newData;
        renderCV(cvData);
        hideForm();
    }

    console.log('Datos del CV actualizados:', cvData);
}

function hideForm() {
    document.getElementById('cv-container').style.display = 'block';
    document.getElementById('edit-btn').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';
}

function handleFotoInput(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('foto-preview').src = e.target.result;
            document.getElementById('foto-preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const inputDiv = event.target.parentNode;
      inputDiv.remove();
    }
  });

document.addEventListener('DOMContentLoaded', () => {
    loadCV();
    document.getElementById('edit-btn').addEventListener('click', showForm);
    document.getElementById('cv-form').addEventListener('submit', saveCV);
    document.getElementById('add-experiencia').addEventListener('click', () => addExperienciaInput({}, document.querySelectorAll('#experiencia-inputs > div').length));
    document.getElementById('add-educacion').addEventListener('click', () => addEducacionInput({}, document.querySelectorAll('#educacion-inputs > div').length));
    document.getElementById('add-habilidad').addEventListener('click', () => addHabilidadInput('', document.querySelectorAll('#habilidades-inputs > div').length));
    document.getElementById('foto-input').addEventListener('change', handleFotoInput);
});