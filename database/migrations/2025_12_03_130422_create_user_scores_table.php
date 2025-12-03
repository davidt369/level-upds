<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Puntuación global por (usuario, problema).
     * Útil para rankings y estadísticas rápidas.
     * Se actualiza cada vez que hay un submission exitoso.
     */
    public function up(): void
    {
        Schema::create('user_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('problem_id')
                  ->constrained('problems')
                  ->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->timestamp('last_submission')->nullable();
            $table->timestamps();

            // Restricción única: un usuario solo puede tener una puntuación por problema
            $table->unique(['user_id', 'problem_id']);

            // Índices para consultas de ranking
            $table->index('problem_id');
            $table->index(['problem_id', 'score']); // Para ordenar por score en un problema
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_scores');
    }
};
