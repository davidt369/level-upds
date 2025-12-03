<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'problem_id',
        'score',
        'last_submission',
    ];

    protected $casts = [
        'score' => 'integer',
        'last_submission' => 'datetime',
    ];

    /**
     * Relación: Un score pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Un score pertenece a un problema
     */
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
