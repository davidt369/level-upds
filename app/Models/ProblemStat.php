<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProblemStat extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'problem_id';

    protected $fillable = [
        'problem_id',
        'total_submissions',
        'total_accepted',
        'unique_accepted',
    ];

    protected $casts = [
        'total_submissions' => 'integer',
        'total_accepted' => 'integer',
        'unique_accepted' => 'integer',
        'last_updated' => 'datetime',
    ];

    /**
     * Relación: Las estadísticas pertenecen a un problema
     */
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }

    /**
     * Calcular la tasa de aceptación
     */
    public function getAcceptanceRateAttribute(): float
    {
        if ($this->total_submissions === 0) {
            return 0.0;
        }

        return ($this->total_accepted / $this->total_submissions) * 100;
    }
}
