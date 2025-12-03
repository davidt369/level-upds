<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Logs de ejecución de cada submission (stdout, stderr).
     * Almacenados en S3/MinIO como URLs.
     */
    public function up(): void
    {
        Schema::create('submission_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')
                  ->constrained('submissions')
                  ->onDelete('cascade');
            $table->text('stdout_url')->nullable(); // URL a S3/MinIO
            $table->text('stderr_url')->nullable(); // URL a S3/MinIO
            $table->timestamp('created_at')->useCurrent();

            // Índice para consultas por submission
            $table->index('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_logs');
    }
};
