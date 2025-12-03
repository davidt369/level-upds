<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Estadísticas agregadas por problema (para mejorar performance).
     * Se actualizan mediante triggers o jobs programados.
     */
    public function up(): void
    {
        Schema::create('problem_stats', function (Blueprint $table) {
            $table->foreignId('problem_id')
                  ->primary()
                  ->constrained('problems')
                  ->onDelete('cascade');
            $table->bigInteger('total_submissions')->default(0);
            $table->bigInteger('total_accepted')->default(0);
            $table->bigInteger('unique_accepted')->default(0); // Usuarios únicos que lo resolvieron
            $table->timestamp('last_updated')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_stats');
    }
};
