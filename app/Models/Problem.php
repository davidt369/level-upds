<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Problem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'input_format',
        'output_format',
        'constraints',
        'difficulty',
        'time_limit',
        'memory_limit',
    ];

    protected $casts = [
        'time_limit' => 'integer',
        'memory_limit' => 'integer',
    ];

    /**
     * Relación: Un problema pertenece a un curso
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Relación: Un problema tiene muchos casos de prueba
     */
    public function testCases(): HasMany
    {
        return $this->hasMany(ProblemTestCase::class);
    }

    /**
     * Relación: Casos de prueba visibles (no ocultos)
     */
    public function visibleTestCases(): HasMany
    {
        return $this->hasMany(ProblemTestCase::class)->where('is_hidden', false);
    }

    /**
     * Relación: Casos de prueba ocultos
     */
    public function hiddenTestCases(): HasMany
    {
        return $this->hasMany(ProblemTestCase::class)->where('is_hidden', true);
    }

    /**
     * Relación: Un problema tiene muchos envíos (submissions)
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Relación: Un problema tiene estadísticas
     */
    public function stats(): HasOne
    {
        return $this->hasOne(ProblemStat::class);
    }

    /**
     * Relación: Un problema pertenece a muchas actividades
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_problems');
    }

    /**
     * Relación: Puntuaciones de usuarios en este problema
     */
    public function userScores(): HasMany
    {
        return $this->hasMany(UserScore::class);
    }

    /**
     * Obtener el porcentaje de aceptación del problema
     */
    public function getAcceptanceRateAttribute(): float
    {
        if (!$this->stats || $this->stats->total_submissions === 0) {
            return 0.0;
        }

        return ($this->stats->total_accepted / $this->stats->total_submissions) * 100;
    }
}
