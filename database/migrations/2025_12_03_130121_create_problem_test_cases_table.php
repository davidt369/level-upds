<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Casos de prueba para cada problema.
     * Los casos ocultos (is_hidden=true) no se muestran al estudiante.
     */
    public function up(): void
    {
        Schema::create('problem_test_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')
                  ->constrained('problems')
                  ->onDelete('cascade');
            $table->text('input');
            $table->text('expected_output');
            $table->boolean('is_hidden')->default(true);
            $table->timestamps();

            // Índice para consultas por problema
            $table->index('problem_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_test_cases');
    }
};
