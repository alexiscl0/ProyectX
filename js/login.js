// Particulas de fondo
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-bg';
  document.body.appendChild(particlesContainer);

  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tamaño aleatorio entre 1px y 4px
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + 'vh';
    
    // Duración de animación aleatoria
    const duration = Math.random() * 15 + 10;
    particle.style.animationDuration = duration + 's';
    
    // Delay aleatorio
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Crear gradiente de fondo
function createGradient() {
  const gradient = document.createElement('div');
  gradient.className = 'gradient-bg';
  document.body.appendChild(gradient);
}

//Validacion del formulario
const loginForm = document.querySelector('.login-form');
const emailInput = document.getElementById('correo');
const passwordInput = document.getElementById('contraseña');
const submitButton = document.querySelector('.btn-submit');
const errorMessage = document.querySelector('.error-message');

// Validar email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mostrar mensaje de error
function showError(message) {
  if (!errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    setTimeout(() => {
      errorDiv.classList.remove('show');
      setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
  } else {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 3000);
  }
}

// Efecto de shake en inputs
function shakeInput(input) {
  input.parentElement.classList.add('shake-animation');
  setTimeout(() => {
    input.parentElement.classList.remove('shake-animation');
  }, 500);
}

// Efecto de escritura inputs
const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');

inputs.forEach(input => {
  // Efecto al escribir
  input.addEventListener('input', function() {
    if (this.value.length > 0) {
      this.parentElement.classList.add('has-content');
    } else {
      this.parentElement.classList.remove('has-content');
    }
  });

  // Efecto al hacer foco
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
});

// Manejo de formulario
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validaciones
    if (!email || !password) {
      showError('⚠️ Por favor, completa todos los campos');
      if (!email) shakeInput(emailInput);
      if (!password) shakeInput(passwordInput);
      return;
    }
    
    if (!validateEmail(email)) {
      showError('⚠️ Por favor, ingresa un correo válido');
      shakeInput(emailInput);
      return;
    }
    
    if (password.length < 6) {
      showError('⚠️ La contraseña debe tener al menos 6 caracteres');
      shakeInput(passwordInput);
      return;
    }
    
    // Animación de carga
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Ingresando...';
    submitButton.classList.add('loading');
    
    // Simular proceso de login (aquí irá tu lógica real)
    setTimeout(() => {
      // Aquí puedes agregar tu lógica de autenticación
      console.log('Login exitoso:', { email, password });
      
      // Animación de éxito
      submitButton.textContent = '✓ ¡Bienvenido!';
      submitButton.classList.remove('loading');
      submitButton.classList.add('success-animation');
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        // window.location.href = 'dashboard.html'; // Descomenta para redirigir
        console.log('Redirigiendo al dashboard...');
      }, 1000);
      
    }, 2000);
  });
}

// Efecto de tecla
inputs.forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this === emailInput) {
        passwordInput.focus();
      } else if (this === passwordInput) {
        loginForm.dispatchEvent(new Event('submit'));
      }
    }
  });
});

// ============================================
// TOGGLE PASSWORD VISIBILITY (opcional)
// ============================================
function createPasswordToggle() {
  const passwordGroup = passwordInput.parentElement;
  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'password-toggle';
  toggleButton.innerHTML = '👁️';
  toggleButton.style.cssText = `
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 1.2rem;
    transition: color 0.3s ease;
    padding: 5px;
    margin-top: 12px;
  `;
  
  toggleButton.addEventListener('click', function() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.innerHTML = type === 'password' ? '👁️' : '🙈';
  });
  
  toggleButton.addEventListener('mouseenter', function() {
    this.style.color = 'rgba(255, 255, 255, 0.8)';
  });
  
  toggleButton.addEventListener('mouseleave', function() {
    this.style.color = 'rgba(255, 255, 255, 0.5)';
  });
  
  passwordGroup.style.position = 'relative';
  passwordGroup.appendChild(toggleButton);
}

// Efecto de cursor personalizado
function createCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor-login';
  cursor.style.cssText = `
    width: 8px;
    height: 8px;
    border: 2px solid #fff;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.2s ease;
  `;
  document.body.appendChild(cursor);
  
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower-login';
  cursorFollower.style.cssText = `
    width: 35px;
    height: 35px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.3s ease;
  `;
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
  
  // Efecto hover en elementos clicables
  const clickables = document.querySelectorAll('a, button, input[type="submit"], input[type="checkbox"]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursorFollower.style.transform = 'scale(1)';
    });
  });
}


// Inicializar todo al cargar

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createGradient();
  createPasswordToggle();
  createCustomCursor();
});
