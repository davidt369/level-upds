<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Obtiene los usuarios que son estudiantes de este curso.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->as('enrollment') // Nombra la relación pivot como 'enrollment'
            ->withPivot('role', 'created_at') // Incluye columnas de la tabla pivot
            ->wherePivot('role', 'student');   // Filtra por el rol 'student'
    }

    /**
     * Obtiene los usuarios que son profesores de este curso.
     */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->as('enrollment')
            ->withPivot('role', 'created_at')
            ->wherePivot('role', 'teacher'); // Filtra por el rol 'teacher'
    }

    /**
     * Obtiene todos los usuarios asociados al curso (profesores y estudiantes).
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->as('enrollment')
            ->withPivot('role', 'created_at');
    }
}