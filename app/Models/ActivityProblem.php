<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityProblem extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'problem_id',
    ];

    /**
     * Relación: Pertenece a una actividad
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Relación: Pertenece a un problema
     */
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
