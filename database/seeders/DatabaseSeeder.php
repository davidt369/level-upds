<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1️⃣ Ejecutar seeder de roles
        $this->call(RolesSeeder::class);

        // 2️⃣ Crear usuarios y asignar roles

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'erick@gmail.com'],
            [
                'name' => 'Erick Brayan Iraizos zanizo',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Docente
        $docente = User::firstOrCreate(
            ['email' => 'marcelo@gmail.com'],
            [
                'name' => 'Marcelo Flores Buendia',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $docente->assignRole('docente');

        // Estudiante
        $estudiante = User::firstOrCreate(
            ['email' => 'joel@gmail.com'],
            [
                'name' => 'Joel Benitez Paco',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $estudiante->assignRole('estudiante');
    }
}
