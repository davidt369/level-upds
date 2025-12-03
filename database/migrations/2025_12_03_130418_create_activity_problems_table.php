<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Relación muchos a muchos entre actividades y problemas.
     * Una actividad puede tener múltiples problemas.
     */
    public function up(): void
    {
        Schema::create('activity_problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')
                  ->constrained('activities')
                  ->onDelete('cascade');
            $table->foreignId('problem_id')
                  ->constrained('problems')
                  ->onDelete('cascade');
            $table->timestamps();

            // Restricción única: un problema no puede estar duplicado en una actividad
            $table->unique(['activity_id', 'problem_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_problems');
    }
};
