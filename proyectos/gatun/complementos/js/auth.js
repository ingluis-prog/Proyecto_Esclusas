/* ════════════════════════════════════════════════════════════════ */
/* Sistema de Autenticación - Login Modal + Roles de Usuario */
/* ════════════════════════════════════════════════════════════════ */

// Detectar si estamos en una página de complementos (vs el plano)
function enComplementos() {
   return window.location.pathname.toLowerCase().includes('/complementos/');
}

// Obtener rol actual del usuario
function obtenerRolActual() {
   const rol = sessionStorage.getItem('user-role-gatun') || null;
   return rol;
}

// Establecer rol del usuario
function establecerRol(rol) {
   if (['admin', 'guest'].includes(rol)) {
      sessionStorage.setItem('user-role-gatun', rol);
      cerrarLoginModal();
   }
}

// Verificar si el usuario es admin
function esAdmin() {
   return obtenerRolActual() === 'admin';
}

// Verificar si el usuario es invitado
function esInvitado() {
   return obtenerRolActual() === 'guest';
}

// Mostrar/ocultar elementos según permisos
function aplicarPermisos() {
   const rol = obtenerRolActual();
   const enComp = enComplementos();

   if (!enComp) {
      // ESTAMOS EN EL PLANO: enlazar el botón Complementos al modal
      const btnComplementos = document.querySelector('a[href="complementos/index.html"]');
      if (btnComplementos) {
         btnComplementos.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('user-role-gatun');
            sessionStorage.removeItem('admin-ip-gatun');
            mostrarLoginModal();
         });
      }
      return;
   }

   // ESTAMOS EN COMPLEMENTOS - si no hay rol, regresar al plano
   if (!rol) {
      window.location.href = '../index.html';
      return;
   }

   // Ocultar botones de agregar, editar, eliminar si es invitado
   if (rol === 'guest') {
      document.querySelectorAll('.btn-add-form, .item-edit, .item-delete, .btn-primary, .btn-danger').forEach(el => {
         el.style.display = 'none';
      });

      // Mostrar mensaje de solo lectura
      const mensaje = document.createElement('div');
      mensaje.style.cssText = 'background: #e8f4f8; border-left: 4px solid #0061c3; padding: 12px; margin-bottom: 16px; border-radius: 4px; color: #0061c3; font-size: 13px;';
      mensaje.textContent = '👁️ Modo de solo lectura - Contacta a un administrador para realizar cambios';

      const firstSection = document.querySelector('.form-section');
      if (firstSection) {
         firstSection.parentNode.insertBefore(mensaje, firstSection);
      }
   } else {
      // Admin - mostrar selector de rol
      mostrarSelectorRol();
   }
}

// ═══════════════════════════════════════════════════════════════════
// MODAL DE LOGIN
// ═══════════════════════════════════════════════════════════════════

function crearLoginModal() {
   const loginHTML = `
      <div id="login-modal" class="login-modal active">
         <div class="login-modal-content">
            <div class="login-header">
               <h2>🔐 Autenticación</h2>
               <p>Selecciona tu tipo de acceso</p>
            </div>

            <!-- Pantalla de selección de rol -->
            <div id="login-step-1" class="login-step active">
               <div class="login-options">
                  <button class="login-option-btn admin-btn" onclick="mostrarPantallaPassword()">
                     <span class="icon">👨‍💼</span>
                     <span class="text">
                        <strong>Administrador</strong>
                        <small>Acceso completo para agregar, editar y eliminar</small>
                     </span>
                  </button>

                  <button class="login-option-btn guest-btn" onclick="establecerRolDirecto('guest')">
                     <span class="icon">👁️</span>
                     <span class="text">
                        <strong>Invitado</strong>
                        <small>Solo lectura, sin permisos de edición</small>
                     </span>
                  </button>
               </div>
            </div>

            <!-- Pantalla de credenciales -->
            <div id="login-step-2" class="login-step">
               <form id="password-form" onsubmit="verificarCredenciales(event)">
                  <div class="login-form-group">
                     <label for="admin-ip">Número de Empleado</label>
                     <input
                        type="text"
                        id="admin-ip"
                        placeholder="Ej: 2843161"
                        required
                        autocomplete="off"
                     >
                  </div>
                  <div class="login-form-group">
                     <label for="admin-password">Contraseña</label>
                     <input
                        type="password"
                        id="admin-password"
                        placeholder="Ingresa tu contraseña"
                        required
                        autocomplete="off"
                     >
                  </div>
                  <div id="password-error" class="password-error" style="display:none;">
                     ❌ Número de empleado o contraseña incorrecta
                  </div>
                  <div class="login-buttons">
                     <button type="button" class="btn-back" onclick="volverSeleccionRol()">
                        ◀ Atrás
                     </button>
                     <button type="submit" class="btn-confirm">
                        ✓ Ingresar
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>

      <style>
         /* Modal Login */
         .login-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            align-items: center;
            justify-content: center;
         }

         .login-modal.active {
            display: flex;
         }

         .login-modal-content {
            background: white;
            padding: 40px;
            border-radius: 16px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 61, 130, 0.2);
            animation: slideInUp 0.3s ease-out;
         }

         @keyframes slideInUp {
            from {
               opacity: 0;
               transform: translateY(20px);
            }
            to {
               opacity: 1;
               transform: translateY(0);
            }
         }

         .login-header {
            text-align: center;
            margin-bottom: 32px;
         }

         .login-header h2 {
            color: #003d82;
            font-size: 24px;
            margin-bottom: 8px;
         }

         .login-header p {
            color: #64748b;
            font-size: 14px;
         }

         .login-step {
            display: none;
         }

         .login-step.active {
            display: block;
            animation: fadeIn 0.3s ease-out;
         }

         @keyframes fadeIn {
            from {
               opacity: 0;
            }
            to {
               opacity: 1;
            }
         }

         /* Opciones de login */
         .login-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
         }

         .login-option-btn {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            border: 2px solid #e0e7ff;
            border-radius: 12px;
            background: #f8fafc;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
         }

         .login-option-btn:hover {
            border-color: #003d82;
            background: #f0f4f8;
            transform: translateX(4px);
         }

         .login-option-btn .icon {
            font-size: 32px;
         }

         .login-option-btn .text {
            display: flex;
            flex-direction: column;
            gap: 4px;
         }

         .login-option-btn strong {
            color: #003d82;
            font-size: 14px;
         }

         .login-option-btn small {
            color: #64748b;
            font-size: 12px;
            font-weight: 400;
         }

         /* Formulario de contraseña */
         .login-form-group {
            margin-bottom: 16px;
         }

         .login-form-group label {
            display: block;
            color: #334155;
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 8px;
         }

         .login-form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
         }

         .login-form-group input:focus {
            outline: none;
            border-color: #003d82;
            box-shadow: 0 0 0 3px rgba(0, 61, 130, 0.1);
         }

         .password-error {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #dc2626;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 16px;
         }

         .login-buttons {
            display: flex;
            gap: 12px;
            margin-top: 24px;
         }

         .btn-back, .btn-confirm {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
         }

         .btn-back {
            background: #e0e7ff;
            color: #003d82;
         }

         .btn-back:hover {
            background: #cbd5e1;
         }

         .btn-confirm {
            background: #003d82;
            color: white;
         }

         .btn-confirm:hover {
            background: #00284a;
            transform: translateY(-2px);
         }
      </style>
   `;

   document.body.insertAdjacentHTML('afterbegin', loginHTML);
}

function mostrarLoginModal() {
   if (!document.getElementById('login-modal')) {
      crearLoginModal();
   }
   document.getElementById('login-modal').classList.add('active');
}

function cerrarLoginModal() {
   const modal = document.getElementById('login-modal');
   if (modal) {
      modal.classList.remove('active');
      // Ocultar modal después de la animación
      setTimeout(() => {
         modal.style.display = 'none';
      }, 300);
   }
   // Si estamos en el plano y se eligió un rol, navegar a complementos
   if (!enComplementos() && obtenerRolActual()) {
      window.location.href = 'complementos/index.html';
   } else {
      aplicarPermisos();
   }
}

function mostrarPantallaPassword() {
   document.getElementById('login-step-1').classList.remove('active');
   document.getElementById('login-step-2').classList.add('active');
   // Enfocar el campo de IP
   setTimeout(() => {
      document.getElementById('admin-ip').focus();
   }, 100);
}

function volverSeleccionRol() {
   document.getElementById('login-step-2').classList.remove('active');
   document.getElementById('login-step-1').classList.add('active');
   document.getElementById('admin-ip').value = '';
   document.getElementById('admin-password').value = '';
   document.getElementById('password-error').style.display = 'none';
}

// Lista de números de empleado autorizados como administrador
const ADMINS_AUTORIZADOS = ['2843161'];

function verificarCredenciales(event) {
   event.preventDefault();
   const numeroEmpleado = document.getElementById('admin-ip').value.trim();
   const password = document.getElementById('admin-password').value;
   const errorElement = document.getElementById('password-error');

   // Validar que el número de empleado esté en la lista autorizada y la contraseña sea "admin"
   if (ADMINS_AUTORIZADOS.includes(numeroEmpleado) && password === 'admin') {
      errorElement.style.display = 'none';
      // Guardar el número de empleado del admin en localStorage para mostrarla en el selector de rol
      sessionStorage.setItem('admin-ip-gatun', numeroEmpleado);
      establecerRol('admin');
   } else {
      errorElement.style.display = 'block';
      document.getElementById('admin-password').value = '';
      document.getElementById('admin-ip').focus();
   }
}

function establecerRolDirecto(rol) {
   establecerRol(rol);
}

// Mostrar selector de rol en la esquina (para cambiar rol siendo admin)
function mostrarSelectorRol() {
   if (document.getElementById('role-selector')) return; // Ya existe

   const adminEmpleado = sessionStorage.getItem('admin-ip-gatun') || 'Desconocida';
   const selectorHTML = `
      <div id="role-selector" style="position: fixed; top: 80px; right: 16px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 99; font-size: 12px;">
         <p style="margin: 0 0 8px 0; font-weight: 600; color: #003d82;">👨‍💼 ${adminEmpleado}</p>
         <button onclick="cambiarRol('guest')" style="background: #cbd5e1; color: #333; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 4px; font-size: 12px;">👁️ Ver como Invitado</button>
         <button onclick="cerrarSesion()" style="background: #ff4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 12px;">🚪 Cerrar Sesión</button>
      </div>
   `;

   document.body.insertAdjacentHTML('beforeend', selectorHTML);
}

function cambiarRol(nuevoRol) {
   if (['admin', 'guest'].includes(nuevoRol)) {
      sessionStorage.setItem('user-role-gatun', nuevoRol);
      location.reload();
   }
}

function cerrarSesion() {
   sessionStorage.removeItem('user-role-gatun');
   sessionStorage.removeItem('admin-ip-gatun');
   location.reload();
}

// Inicializar permisos al cargar la página
document.addEventListener('DOMContentLoaded', aplicarPermisos);
