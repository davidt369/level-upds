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

            // Nueva columna created_by
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps(); // created_at y updated_at
            $table->softDeletes(); // deleted_at

            // FK: created_by → users.id (ON DELETE SET NULL)
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });

        // 2. Tabla Pivot de Matrículas (course_user)
        Schema::create('course_user', function (Blueprint $table) {
            $table->id();

            // Claves foráneas que se eliminan en cascada
            $table->foreignId('course_id')
                ->constrained('courses')
                ->onDelete('cascade');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('role', ['teacher', 'student']);

            $table->timestamp('created_at')->useCurrent();

            // Evita duplicados
            $table->unique(['course_id', 'user_id', 'role']);
        });

        // 3. Índice compuesto en activities (course_id, weight)
        // Solo si la tabla activities ya existe (no rompe migraciones iniciales)
        if (Schema::hasTable('activities')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->index(['course_id', 'weight'], 'idx_activity_weight');
            });
        }
    }

    public function down()
    {
        // Eliminar índice si existe
        if (Schema::hasTable('activities')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->dropIndex('idx_activity_weight');
            });
        }

        Schema::dropIfExists('course_user');

        Schema::dropIfExists('courses');
    }
};
