<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'course_user';

    /**
     * Indica si el modelo debe usar timestamps.
     * La tabla solo tiene 'created_at', así que desactivamos el manejo automático.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'course_id',
        'user_id',
        'role',
    ];

    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array
     */
    protected $casts = [
        'role' => 'string',
        'created_at' => 'datetime',
    ];

    /**
     * Obtiene el usuario de esta matrícula.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtiene el curso de esta matrícula.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}