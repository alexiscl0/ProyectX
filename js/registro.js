/*Particulas*/
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-bg';
  document.body.appendChild(particlesContainer);

  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + 'vh';
    
    const duration = Math.random() * 15 + 10;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Elementos de formulario
const registerForm = document.querySelector('.register-form');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('correo');
const passwordInput = document.getElementById('contraseña');
const confirmPasswordInput = document.getElementById('confirmar');
const termsCheckbox = document.getElementById('terms');
const submitButton = document.querySelector('.btn-submit');

// ============================================
// VALIDACIONES
// ============================================

// Validar email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar nombre (solo letras y espacios)
function validateName(name) {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return nameRegex.test(name) && name.trim().length >= 3;
}

// Calcular fuerza de contraseña
function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

// ============================================
// VALIDACIÓN EN TIEMPO REAL
// ============================================

// Crear iconos de validación
function createValidationIcon(input) {
  const icon = document.createElement('span');
  icon.className = 'validation-icon';
  input.parentElement.appendChild(icon);
}

// Validar nombre
nombreInput.addEventListener('input', function() {
  const isValid = validateName(this.value);
  this.classList.remove('valid', 'invalid');
  
  if (this.value.length > 0) {
    this.classList.add(isValid ? 'valid' : 'invalid');
  }
});

// Validar email
emailInput.addEventListener('input', function() {
  const isValid = validateEmail(this.value);
  this.classList.remove('valid', 'invalid');
  
  if (this.value.length > 0) {
    this.classList.add(isValid ? 'valid' : 'invalid');
  }
});

// Validar contraseña
passwordInput.addEventListener('input', function() {
  const isValid = this.value.length >= 6;
  this.classList.remove('valid', 'invalid');
  
  if (this.value.length > 0) {
    this.classList.add(isValid ? 'valid' : 'invalid');
  }
  
  // Validar confirmación si ya tiene valor
  if (confirmPasswordInput.value.length > 0) {
    validatePasswordMatch();
  }
});

// Validar coincidencia de contraseñas
function validatePasswordMatch() {
  const isMatch = passwordInput.value === confirmPasswordInput.value;
  confirmPasswordInput.classList.remove('valid', 'invalid');
  
  if (confirmPasswordInput.value.length > 0) {
    confirmPasswordInput.classList.add(isMatch ? 'valid' : 'invalid');
  }
  
  return isMatch;
}

confirmPasswordInput.addEventListener('input', validatePasswordMatch);

// ============================================
// TOGGLE VISIBILIDAD DE CONTRASEÑAS
// ============================================
function createPasswordToggle(input) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'password-toggle';
  toggle.innerHTML = '👁️';
  toggle.style.cssText = `
    position: absolute;
    right: 45px;
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
    z-index: 10;
  `;
  
  toggle.addEventListener('click', function() {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    this.innerHTML = type === 'password' ? '👁️' : '🙈';
  });
  
  toggle.addEventListener('mouseenter', function() {
    this.style.color = 'rgba(255, 255, 255, 0.8)';
  });
  
  toggle.addEventListener('mouseleave', function() {
    this.style.color = 'rgba(255, 255, 255, 0.5)';
  });
  
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(toggle);
}

createPasswordToggle(passwordInput);
createPasswordToggle(confirmPasswordInput);

// Crear iconos de validación
createValidationIcon(nombreInput);
createValidationIcon(emailInput);
createValidationIcon(passwordInput);
createValidationIcon(confirmPasswordInput);

// ============================================
// MENSAJES
// ============================================
function showMessage(text, type = 'error') {
  let messageDiv = document.querySelector('.message');
  
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    registerForm.insertBefore(messageDiv, registerForm.firstChild);
  } else {
    messageDiv.className = `message ${type}`;
  }
  
  messageDiv.textContent = text;
  messageDiv.classList.add('show');
  
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 4000);
}

// Efecto shake
function shakeElement(element) {
  element.classList.add('shake-animation');
  setTimeout(() => {
    element.classList.remove('shake-animation');
  }, 500);
}

// ============================================
// MANEJO DEL FORMULARIO
// ============================================
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener valores
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const acceptedTerms = termsCheckbox ? termsCheckbox.checked : true;
    
    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      showMessage('⚠️ Por favor, completa todos los campos', 'error');
      return;
    }
    
    if (!validateName(nombre)) {
      showMessage('⚠️ El nombre debe contener solo letras y al menos 3 caracteres', 'error');
      shakeElement(nombreInput.parentElement);
      return;
    }
    
    if (!validateEmail(email)) {
      showMessage('⚠️ Por favor, ingresa un correo válido', 'error');
      shakeElement(emailInput.parentElement);
      return;
    }
    
    if (password.length < 6) {
      showMessage('⚠️ La contraseña debe tener al menos 6 caracteres', 'error');
      shakeElement(passwordInput.parentElement);
      return;
    }
    
    if (password !== confirmPassword) {
      showMessage('⚠️ Las contraseñas no coinciden', 'error');
      shakeElement(confirmPasswordInput.parentElement);
      return;
    }
    
    if (!acceptedTerms && termsCheckbox) {
      showMessage('⚠️ Debes aceptar los términos y condiciones', 'error');
      return;
    }
    
    // Verificar fuerza de contraseña
    const strength = calculatePasswordStrength(password);
    if (strength === 'weak') {
      const confirmed = confirm('Tu contraseña es débil. ¿Deseas continuar de todos modos?');
      if (!confirmed) return;
    }
    
    // Animación de carga
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Registrando...';
    submitButton.classList.add('loading');
    
    // Simular proceso de registro
    setTimeout(() => {
      // Aquí irá tu lógica real de registro
      console.log('Registro exitoso:', { nombre, email, password });
      
      // Éxito
      submitButton.textContent = '✓ ¡Registrado!';
      submitButton.classList.remove('loading');
      submitButton.classList.add('success-animation');
      
      showMessage('✓ ¡Cuenta creada exitosamente! Redirigiendo...', 'success');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        // window.location.href = 'login.html'; // Descomenta para redirigir
        console.log('Redirigiendo al login...');
      }, 2000);
      
    }, 2500);
  });
}

// ============================================
// NAVEGACIÓN CON TECLADO
// ============================================
const inputs = [nombreInput, emailInput, passwordInput, confirmPasswordInput];

inputs.forEach((input, index) => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        registerForm.dispatchEvent(new Event('submit'));
      }
    }
  });
});

// ============================================
// EFECTOS EN INPUTS
// ============================================
inputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.01)';
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
});

// ============================================
// CURSOR PERSONALIZADO
// ============================================
function createCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor-register';
  document.body.appendChild(cursor);
  
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower-register';
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
  
  // Efecto hover
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

// ============================================
// VERIFICAR DISPONIBILIDAD DE EMAIL (simulado)
// ============================================
let emailCheckTimeout;
emailInput.addEventListener('input', function() {
  clearTimeout(emailCheckTimeout);
  
  if (validateEmail(this.value)) {
    emailCheckTimeout = setTimeout(() => {
      // Aquí puedes hacer una petición al servidor para verificar si el email existe
      console.log('Verificando disponibilidad del email:', this.value);
    }, 1000);
  }
});

// ============================================
// ANIMACIÓN DE ENTRADA
// ============================================
window.addEventListener('load', () => {
  const container = document.querySelector('.register-container');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(50px) scale(0.95)';
    
    setTimeout(() => {
      container.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }
});

// ============================================
// HABILITAR/DESHABILITAR BOTÓN
// ============================================
function checkFormValidity() {
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const terms = termsCheckbox ? termsCheckbox.checked : true;
  
  const isValid = 
    validateName(nombre) &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword &&
    terms;
  
  submitButton.disabled = !isValid;
  submitButton.style.opacity = isValid ? '1' : '0.6';
}

// Verificar validez en cada cambio
[nombreInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
  input.addEventListener('input', checkFormValidity);
});

if (termsCheckbox) {
  termsCheckbox.addEventListener('change', checkFormValidity);
}

// ============================================
// INICIALIZAR TODO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createGradients();
  createCustomCursor();
  checkFormValidity();
  
  console.log('🚗 ParkPro Registro inicializado correctamente');
});

// Deshabilitar scroll
document.body.style.overflow = 'hidden';

// ============================================
// EFECTO RIPPLE EN BOTÓN
// ============================================
submitButton?.addEventListener('click', function(e) {
  if (this.disabled) return;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    width: 10px;
    height: 10px;
    animation: rippleEffect 0.6s ease-out;
    pointer-events: none;
  `;
  
  const rect = this.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left - 5) + 'px';
  ripple.style.top = (e.clientY - rect.top - 5) + 'px';
  
  this.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
});

// Agregar estilos para ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleEffect {
    to {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);