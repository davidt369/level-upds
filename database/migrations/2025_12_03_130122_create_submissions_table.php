<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabla de envíos/submissions de código.
     * NOTA: PostgreSQL soporta particionamiento nativo, pero Laravel/MySQL no lo soportan bien.
     * Por simplicidad, creamos una tabla normal. Si usas PostgreSQL en producción,
     * puedes ejecutar el particionamiento manualmente con DB::statement().
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')
                ->constrained('problems')
                ->onDelete('cascade');
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->integer('score ')->default(0);
            $table->enum('language', ['cpp', 'python', 'php', 'node', 'csharp', 'java']);
            $table->text('code_url'); // URL a S3/MinIO donde se almacena el código
            $table->enum('status', [
                'pending',
                'running',
                'accepted',
                'wrong_answer',
                'runtime_error',
                'time_limit',
                'compile_error'
            ])->default('pending');
            $table->float('execution_time')->nullable(); // en segundos
            $table->integer('memory_usage')->nullable(); // en KB o MB
            $table->timestamp('created_at')->useCurrent();

            // Índices para consultas frecuentes
            $table->index(['user_id', 'problem_id']);
            $table->index(['problem_id', 'status']);
        });

        // Si usas PostgreSQL y quieres particionamiento, descomenta esto:
        // DB::statement("ALTER TABLE submissions PARTITION BY RANGE (created_at)");
        // DB::statement(
        //     "CREATE TABLE submissions_2025_12 PARTITION OF submissions " .
        //     "FOR VALUES FROM ('2025-12-01') TO ('2026-01-01')"
        // );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
