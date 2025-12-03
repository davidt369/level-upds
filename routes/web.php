<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// ============================================
// RUTAS UNIVERSALES (Todos los roles autenticados)
// ============================================
// Estas páginas usan restricción de componentes en el frontend
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard principal - todos los roles lo ven, pero con diferentes componentes
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Aquí puedes añadir más rutas universales como:
    // Route::get('problems', [ProblemController::class, 'index'])->name('problems.index');
    // Route::get('problems/{id}', [ProblemController::class, 'show'])->name('problems.show');
    // Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
});

// ============================================
// RUTAS EXCLUSIVAS PARA ADMINISTRADORES
// ============================================
// Solo los administradores pueden acceder a estas URLs
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Ejemplo: Gestión completa de usuarios
    // Route::get('users', [AdminController::class, 'users'])->name('users');
    // Route::get('users/{id}/edit', [AdminController::class, 'editUser'])->name('users.edit');
    // Route::get('roles', [AdminController::class, 'roles'])->name('roles');
    // Route::get('analytics', [AdminController::class, 'analytics'])->name('analytics');
});

// ============================================
// RUTAS EXCLUSIVAS PARA PROFESORES
// ============================================
// Solo los profesores pueden acceder a estas URLs
Route::middleware(['auth', 'verified', 'role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    // Ejemplo: Crear y gestionar problemas
    // Route::get('problems/create', [TeacherController::class, 'createProblem'])->name('problems.create');
    // Route::post('problems', [TeacherController::class, 'storeProblem'])->name('problems.store');
    // Route::get('problems/{id}/edit', [TeacherController::class, 'editProblem'])->name('problems.edit');
    // Route::get('submissions', [TeacherController::class, 'submissions'])->name('submissions');
});

// ============================================
// RUTAS EXCLUSIVAS PARA ESTUDIANTES
// ============================================
// Solo los estudiantes pueden acceder a estas URLs (si es necesario)
Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->name('student.')->group(function () {
    // Ejemplo: Funcionalidades exclusivas de estudiantes
    // Route::get('progress', [StudentController::class, 'progress'])->name('progress');
    // Route::get('certificates', [StudentController::class, 'certificates'])->name('certificates');
});

require __DIR__.'/settings.php';
