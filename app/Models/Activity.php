<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Relación: Una actividad pertenece a un curso
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Relación: Una actividad tiene muchos problemas
     */
    public function problems(): BelongsToMany
    {
        return $this->belongsToMany(Problem::class, 'activity_problems');
    }

    /**
     * Relación: Una actividad tiene muchas calificaciones
     */
    public function grades(): HasMany
    {
        return $this->hasMany(ActivityGrade::class);
    }

    /**
     * Verificar si la actividad está activa (dentro del rango de fechas)
     */
    public function isActive(): bool
    {
        $now = now();
        return $this->start_time <= $now && $now <= $this->end_time;
    }

    /**
     * Verificar si la actividad ha finalizado
     */
    public function hasEnded(): bool
    {
        return now() > $this->end_time;
    }

    /**
     * Verificar si la actividad no ha comenzado
     */
    public function notStarted(): bool
    {
        return now() < $this->start_time;
    }
}
