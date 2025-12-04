<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Course;
use OwenIt\Auditing\Contracts\Auditable;

class User extends Authenticatable implements Auditable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes, HasRoles, \OwenIt\Auditing\Auditable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'submissions_last_minute',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)
            ->as('enrollment')
            ->withPivot('role', 'created_at')
            ->wherePivot('role', 'student');
    }

    /**
     * Obtiene los cursos que el usuario imparte como profesor.
     */
    public function teachingCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)
            ->as('enrollment')
            ->withPivot('role', 'created_at')
            ->wherePivot('role', 'teacher');
    }

    /**
     * Obtiene todos los cursos asociados al usuario (como estudiante o profesor).
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)
            ->as('enrollment')
            ->withPivot('role', 'created_at');
    }

    /**
     * Relación: Los envíos (submissions) del usuario
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Relación: Las puntuaciones del usuario en diferentes problemas
     */
    public function scores(): HasMany
    {
        return $this->hasMany(UserScore::class);
    }

    /**
     * Relación: Las calificaciones del usuario en actividades
     */
    public function activityGrades(): HasMany
    {
        return $this->hasMany(ActivityGrade::class);
    }
}
