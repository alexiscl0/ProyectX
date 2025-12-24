// Verificar si el usuario está logueado
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    mostrarNombreUsuario();
});
function verificarSesion() {
    const usuario = localStorage.getItem('usuario');
    const usuarioId = localStorage.getItem('usuario_id');
}

function mostrarNombreUsuario() {
    const usuarioNombre = localStorage.getItem('usuario_nombre');
    
    if (usuarioNombre) {
        const btnSigning = document.querySelector('.btn_signing');
        
        if (btnSigning) {
            btnSigning.textContent = `Hola, ${usuarioNombre}`;
            btnSigning.href = '#';
            btnSigning.addEventListener('click', function(e) {
                e.preventDefault();
                mostrarMenuUsuario(this);
            });
        }
    }
}

function mostrarMenuUsuario(boton) {
    let menu = document.querySelector('.menu-usuario');
    
    if (menu) {
        menu.remove();
        return;
    }
    
    // Crear menú desplegable
    menu = document.createElement('div');
    menu.className = 'menu-usuario';
    menu.innerHTML = `
        <a href="#" onclick="verMisReservas(); return false;">
            <i class="fas fa-calendar"></i> Mis Reservas
        </a>
        <a href="#" onclick="verMisVehiculos(); return false;">
            <i class="fas fa-car"></i> Mis Vehículos
        </a>
        <a href="#" onclick="cerrarSesion(); return false;">
            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </a>
    `;
    
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 10px;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(0, 136, 255, 0.3);
        border-radius: 10px;
        padding: 10px;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(0, 136, 255, 0.3);
        z-index: 1000;
    `;
    
    menu.querySelectorAll('a').forEach(a => {
        a.style.cssText = `
            display: block;
            padding: 10px 15px;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: all 0.3s;
            margin: 5px 0;
        `;
        
        a.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 136, 255, 0.2)';
        });
        
        a.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
    });
    
    boton.parentElement.style.position = 'relative';
    boton.parentElement.appendChild(menu);
    setTimeout(() => {
        document.addEventListener('click', function cerrarMenu(e) {
            if (!menu.contains(e.target) && e.target !== boton) {
                menu.remove();
                document.removeEventListener('click', cerrarMenu);
            }
        });
    }, 100);
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('usuario_nombre');
        
        alert('✓ Sesión cerrada exitosamente');
        window.location.href = 'Sistema.html';
    }
}

function verMisReservas() {
    const usuarioId = localStorage.getItem('usuario_id');
    
    if (!usuarioId) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html';
        return;
    }
    
    alert('Aquí verás tus reservas. Próximamente...');
}

function verMisVehiculos() {
    const usuarioId = localStorage.getItem('usuario_id');
    
    if (!usuarioId) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html';
        return;
    }
    
    alert('Aquí verás tus vehículos. Próximamente...');
}

// Efecto al hacer scroll
const header = document.querySelector('header');
const heroSection = document.querySelector('#hero');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animacion al hacer scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('#somos-parkpro, #ventajas, #modalidades').forEach(section => {
    section.classList.add('fade-up');
    observer.observe(section);
});

document.querySelectorAll('.item_ventaja').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

document.querySelectorAll('.modalidad').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.15}s`;
    observer.observe(item);
});

// EFECTO TYPING en el título principal
const titleElement = document.querySelector('#hero h1');
if (titleElement) {
    const originalHTML = titleElement.innerHTML;
    titleElement.style.opacity = '0';
    
    setTimeout(() => {
        titleElement.style.opacity = '1';
        titleElement.classList.add('title-appear');
    }, 300);
}

// CONTADOR ANIMADO para las ventajas
function createStatsCounter() {
    const stats = [
        { value: 500, suffix: '+', label: 'Clientes Satisfechos' },
        { value: 24, suffix: '/7', label: 'Atención Continua' },
        { value: 100, suffix: '%', label: 'Seguridad Garantizada' }
    ];
}

// EFECTO HOVER MEJORADO en modalidades
document.querySelectorAll('.modalidad').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// EFECTO 3D en las cards de modalidades
document.querySelectorAll('.modalidad').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Particulas de fondo
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

window.addEventListener('load', () => {
    createParticles();
});

// Cursor Personalizado
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'custom-cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Efecto al hacer hover en elementos clicables
document.querySelectorAll('a, button, .btn_signing, .btn_register, .button_info').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
    });
});
