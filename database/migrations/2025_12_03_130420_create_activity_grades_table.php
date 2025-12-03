<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Calificaciones finales de los estudiantes por actividad.
     * Se calculan automáticamente según los problemas resueltos.
     */
    public function up(): void
    {
        Schema::create('activity_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')
                  ->constrained('activities')
                  ->onDelete('cascade');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->integer('score')->default(0); // 0-100
            $table->timestamp('calculated_at')->useCurrent();

            // Restricción única: un usuario solo puede tener una nota por actividad
            $table->unique(['activity_id', 'user_id']);

            // Constraint check para score entre 0 y 100 (solo funciona en PostgreSQL/SQLite)
            // En MySQL puedes validarlo en el modelo
        });

        // Para PostgreSQL, agrega el CHECK constraint:
        // DB::statement('ALTER TABLE activity_grades ADD CONSTRAINT check_score_range CHECK (score BETWEEN 0 AND 100)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_grades');
    }
};
