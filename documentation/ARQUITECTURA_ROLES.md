# 🏗️ Arquitectura Híbrida de Control de Acceso

## 📋 Resumen

Este proyecto implementa una **estrategia híbrida** para el control de acceso basado en roles:

1. **Restricción de Componentes** (Estrategia Principal): Una sola página compartida con componentes que se muestran u ocultan según el rol.
2. **Páginas Exclusivas** (Estrategia Secundaria): Rutas completamente separadas para funcionalidades 100% exclusivas de un rol.

---

## 🎯 Filosofía: "Una Casa con Diferentes Llaves"

- **La Casa (Páginas Compartidas)**: Todos los usuarios entran por `/dashboard`. La estructura es la misma para todos.
- **Las Llaves (Componentes Restringidos)**: Dentro hay "habitaciones" (componentes) que solo ciertos roles pueden ver.
- **Habitaciones Privadas (Páginas Exclusivas)**: Algunas áreas son 100% privadas, como `/admin/users` o `/teacher/problems/create`.

---

## 🚀 Componente `<Can>`

### Ubicación
`resources/js/components/can.tsx`

### Uso Básico

```tsx
import Can from '@/components/can';

// Mostrar solo para administradores
<Can role="admin">
    <AdminPanel />
</Can>

// Mostrar para múltiples roles
<Can role={["admin", "teacher"]}>
    <CreateButton />
</Can>

// Mostrar basado en permiso específico
<Can permission="create-problems">
    <CreateProblemButton />
</Can>

// Con contenido alternativo (fallback)
<Can role="admin" fallback={<p>Acceso denegado</p>}>
    <AdminPanel />
</Can>
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `role` | `string \| string[]` | Rol(es) requerido(s) para mostrar el contenido |
| `permission` | `string \| string[]` | Permiso(s) requerido(s) para mostrar el contenido |
| `children` | `ReactNode` | Contenido a mostrar si el usuario tiene acceso |
| `fallback` | `ReactNode` | Contenido alternativo si el usuario NO tiene acceso |

---

## 🛣️ Estructura de Rutas

### 1. Rutas Universales (Todos los roles autenticados)

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('problems', [ProblemController::class, 'index'])->name('problems.index');
    Route::get('problems/{id}', [ProblemController::class, 'show'])->name('problems.show');
    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
});
```

**Características:**
- Todos los usuarios autenticados pueden acceder
- Usan `<Can>` en el frontend para mostrar/ocultar componentes
- URL limpia: `/dashboard`, `/problems`, `/profile`

### 2. Rutas Exclusivas para Admin

```php
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('users', [AdminController::class, 'users'])->name('users');
        Route::get('roles', [AdminController::class, 'roles'])->name('roles');
        Route::get('analytics', [AdminController::class, 'analytics'])->name('analytics');
    });
```

**Características:**
- Solo accesibles para administradores
- Middleware `role:admin` bloquea el acceso a nivel de servidor
- Prefijo: `/admin/...`

### 3. Rutas Exclusivas para Teacher

```php
Route::middleware(['auth', 'verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('problems/create', [TeacherController::class, 'createProblem'])->name('problems.create');
        Route::post('problems', [TeacherController::class, 'storeProblem'])->name('problems.store');
        Route::get('submissions', [TeacherController::class, 'submissions'])->name('submissions');
    });
```

**Características:**
- Solo accesibles para profesores
- Middleware `role:teacher` protege las rutas
- Prefijo: `/teacher/...`

### 4. Rutas Exclusivas para Student

```php
Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('progress', [StudentController::class, 'progress'])->name('progress');
        Route::get('certificates', [StudentController::class, 'certificates'])->name('certificates');
    });
```

**Características:**
- Solo accesibles para estudiantes
- Middleware `role:student` protege las rutas
- Prefijo: `/student/...`

---

## 🔒 Middleware `CheckRole`

### Ubicación
`app/Http/Middleware/CheckRole.php`

### Características
- Integrado con **Spatie Permission**
- Soporta múltiples roles separados por pipe: `'role:admin|teacher'`
- Retorna `403 Forbidden` si el usuario no tiene el rol requerido

### Uso en Rutas

```php
// Un solo rol
Route::middleware(['auth', 'role:admin'])->group(function () {
    // ...
});

// Múltiples roles (cualquiera de ellos)
Route::middleware(['auth', 'role:admin|teacher'])->group(function () {
    // ...
});
```

---

## 📊 Ejemplo Completo: Dashboard

### Backend (`routes/web.php`)

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
```

### Frontend (`resources/js/pages/dashboard.tsx`)

```tsx
import Can from '@/components/can';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <h1>¡Bienvenido, {auth.user.name}!</h1>

            {/* Solo Administradores */}
            <Can role="admin">
                <a href="/admin/users" className="btn-red">
                    Gestionar Usuarios
                </a>
            </Can>

            {/* Solo Profesores */}
            <Can role="teacher">
                <a href="/teacher/problems/create" className="btn-blue">
                    Crear Nuevo Problema
                </a>
            </Can>

            {/* Solo Estudiantes */}
            <Can role="student">
                <a href="/student/progress" className="btn-green">
                    Ver Mi Progreso
                </a>
            </Can>

            {/* Visible para Todos */}
            <div>
                <p>Este panel es visible para todos los usuarios.</p>
            </div>

            {/* Admin y Teacher */}
            <Can role={["admin", "teacher"]}>
                <div className="management-panel">
                    Panel de Gestión (Admin & Teacher)
                </div>
            </Can>
        </AppLayout>
    );
}
```

---

## 🎯 Tabla de Decisiones

| **¿Qué necesitas hacer?** | **Estrategia** | **Ejemplo** |
|---------------------------|----------------|-------------|
| Mostrar un botón "Crear Problema" | **Restringir Componente** | En `/dashboard`, usa `<Can role="teacher">` |
| Panel completo de gestión de usuarios | **Página Exclusiva** | Crea `/admin/users` con `->middleware('role:admin')` |
| Listado de problemas disponibles | **Página Universal** | Crea `/problems` con `->middleware('auth')` |
| Formulario complejo para crear problemas | **Página Exclusiva** | Crea `/teacher/problems/create` con `->middleware('role:teacher')` |
| Mostrar estadísticas diferentes según rol | **Restringir Componente** | En `/dashboard`, usa múltiples `<Can>` |

---

## ✅ Beneficios de esta Arquitectura

### 1. **Código Limpio (DRY)**
- No repites el layout ni la navegación
- Un solo `Dashboard.tsx` en lugar de 3 archivos separados

### 2. **Fácil de Mantener**
- ¿Nuevo rol "tutor"? Solo añade condiciones `<Can role="tutor">`
- No necesitas crear páginas duplicadas

### 3. **Escalable**
- Añadir nuevas funcionalidades es simple
- La estructura crece orgánicamente

### 4. **Mejor UX**
- URLs limpias (`/dashboard` en lugar de `/dashboard/student`)
- Transiciones fluidas entre permisos
- Aplicación unificada

### 5. **Seguridad en Capas**
- **Frontend**: Componente `<Can>` oculta lo que el usuario no debe ver
- **Backend**: Middleware `CheckRole` impide el acceso a rutas prohibidas

---

## 🔧 Configuración Realizada

### 1. ✅ Componente `Can` creado
- `resources/js/components/can.tsx`
- Soporta roles y permisos
- Incluye fallback opcional

### 2. ✅ Middleware `CheckRole` actualizado
- `app/Http/Middleware/CheckRole.php`
- Usa Spatie Permission
- Registrado en `bootstrap/app.php`

### 3. ✅ Rutas organizadas
- `routes/web.php`
- Rutas universales con `auth`
- Rutas exclusivas con prefijos y `role:*`

### 4. ✅ Dashboard refactorizado
- `resources/js/pages/dashboard.tsx`
- Usa `<Can>` para mostrar contenido por rol
- Ejemplos completos de cada caso de uso

### 5. ✅ Inertia actualizado
- `app/Http/Middleware/HandleInertiaRequests.php`
- Comparte roles y permisos del usuario al frontend

---

## 📚 Próximos Pasos

### 1. Crear Controladores
```bash
php artisan make:controller AdminController
php artisan make:controller TeacherController
php artisan make:controller StudentController
```

### 2. Crear Páginas de Inertia
- `resources/js/pages/admin/users.tsx`
- `resources/js/pages/teacher/problems/create.tsx`
- `resources/js/pages/student/progress.tsx`

### 3. Asignar Roles a Usuarios
```php
// En un Seeder o Controller
$user = User::find(1);
$user->assignRole('admin');
```

### 4. Probar el Sistema
- Crear usuarios con diferentes roles
- Verificar que `<Can>` muestra/oculta correctamente
- Intentar acceder a rutas protegidas sin el rol adecuado

---

## 🎓 Conclusión

Has implementado una arquitectura **profesional, escalable y mantenible**. Esta es la base sólida que necesitabas para tu proyecto universitario.

**Recuerda la regla de oro:**
> Usa **restricción de componentes por defecto** (`<Can>`). Solo crea **páginas exclusivas** cuando la funcionalidad sea 100% privada de un rol.

¡Ahora tienes una aplicación de la que estar orgulloso! 🚀
