<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProblemTestCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'problem_id',
        'input',
        'expected_output',
        'is_hidden',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
    ];

    /**
     * Relación: Un caso de prueba pertenece a un problema
     */
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
