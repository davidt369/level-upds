<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Tabla Cursos (con soft-delete)
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps(); // Crea created_at y updated_at
            $table->softDeletes(); // Crea deleted_at para soft-deletes

            // El índice parcial de tu SQL se crea automáticamente en PostgreSQL
            // con softDeletes(). En otras BD, el índice estándar es suficiente.
        });

        // 2. Tabla Pivot de Matrículas (course_user)
        Schema::create('course_user', function (Blueprint $table) {
            $table->id();

            // Claves foráneas que se eliminan en cascada
            $table->foreignId('course_id')
                  ->constrained('courses') // Referencia a la tabla 'courses'
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->constrained('users') // Referencia a la tabla 'users'
                  ->onDelete('cascade');

            // Usamos ENUM en lugar de VARCHAR + CHECK, es más idiomático en Laravel
            $table->enum('role', ['teacher', 'student']);

            $table->timestamp('created_at')->useCurrent();

            // Restricción única para evitar duplicados
            $table->unique(['course_id', 'user_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Se debe eliminar primero la tabla que tiene las claves foráneas
        Schema::dropIfExists('course_user');
        Schema::dropIfExists('courses');
    }
};
