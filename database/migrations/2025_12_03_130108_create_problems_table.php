<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabla de problemas/ejercicios de programación.
     * Asumimos que existe una tabla 'courses' previa.
     */
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')
                  ->constrained('courses')
                  ->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('input_format')->nullable();
            $table->text('output_format')->nullable();
            $table->text('constraints')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->integer('time_limit')->default(2000); // milisegundos
            $table->integer('memory_limit')->default(256); // MB
            $table->timestamps();
            $table->softDeletes();

            // Índice para consultas por curso
            $table->index('course_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
