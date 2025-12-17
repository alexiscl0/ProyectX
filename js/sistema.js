// ============================================
// NAVBAR - Efecto al hacer scroll
// ============================================
const header = document.querySelector('header');
const heroSection = document.querySelector('#hero');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// SMOOTH SCROLL - Navegación suave
// ============================================
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

// ============================================
// ANIMACIONES AL HACER SCROLL (Intersection Observer)
// ============================================
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

// Observar secciones
document.querySelectorAll('#somos-parkpro, #ventajas, #modalidades').forEach(section => {
    section.classList.add('fade-up');
    observer.observe(section);
});

// Observar items de ventajas individualmente
document.querySelectorAll('.item_ventaja').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Observar modalidades individualmente
document.querySelectorAll('.modalidad').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.15}s`;
    observer.observe(item);
});

// ============================================
// EFECTO PARALLAX en el hero
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroText = document.querySelector('#hero .text');
    const esfera3d = document.querySelector('.Esfera_3d');
    
    if (heroText) {
        heroText.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroText.style.opacity = 1 - (scrolled / 500);
    }
    
    if (esfera3d) {
        esfera3d.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// ============================================
// EFECTO TYPING en el título principal
// ============================================
const titleElement = document.querySelector('#hero h1');
if (titleElement) {
    const originalHTML = titleElement.innerHTML;
    titleElement.style.opacity = '0';
    
    setTimeout(() => {
        titleElement.style.opacity = '1';
        titleElement.classList.add('title-appear');
    }, 300);
}

// ============================================
// CONTADOR ANIMADO para las ventajas
// ============================================
function createStatsCounter() {
    const stats = [
        { value: 500, suffix: '+', label: 'Clientes Satisfechos' },
        { value: 24, suffix: '/7', label: 'Atención Continua' },
        { value: 100, suffix: '%', label: 'Seguridad Garantizada' }
    ];
    
    // Puedes agregar esto en el futuro si quieres mostrar estadísticas
}

// ============================================
// EFECTO HOVER MEJORADO en modalidades
// ============================================
document.querySelectorAll('.modalidad').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// EFECTO 3D en las cards de modalidades
// ============================================
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

// ============================================
// PARTÍCULAS DE FONDO (opcional - efecto premium)
// ============================================
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

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    createParticles();
});

// ============================================
// CURSOR PERSONALIZADO (efecto premium)
// ============================================
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

// Animación suave del follower
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
