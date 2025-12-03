<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Submission extends Model
{
    use HasFactory;

    public $timestamps = false; // Solo usamos created_at

    protected $fillable = [
        'problem_id',
        'user_id',
        'language',
        'code_url',
        'status',
        'execution_time',
        'memory_usage',
    ];

    protected $casts = [
        'execution_time' => 'float',
        'memory_usage' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * Relación: Un envío pertenece a un problema
     */
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }

    /**
     * Relación: Un envío pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Un envío tiene logs de ejecución
     */
    public function log(): HasOne
    {
        return $this->hasOne(SubmissionLog::class);
    }

    /**
     * Verificar si el envío fue aceptado
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Verificar si el envío está pendiente o en ejecución
     */
    public function isPending(): bool
    {
        return in_array($this->status, ['pending', 'running']);
    }
}
