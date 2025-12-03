<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * 
     * Verifica que el usuario tenga el rol requerido usando Spatie Permission.
     * Acepta múltiples roles separados por pipe (|).
     * 
     * @param string $role Rol requerido o roles separados por pipe (ej: "admin|teacher")
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Asegúrate de que el usuario esté autenticado
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Separar múltiples roles si están separados por pipe
        $roles = explode('|', $role);

        // Comprueba si el usuario tiene alguno de los roles requeridos (usando Spatie)
        if (!$request->user()->hasAnyRole($roles)) {
            // Abortar con error 403 (Prohibido)
            abort(Response::HTTP_FORBIDDEN, 'No tienes permiso para acceder a esta página.');
        }

        return $next($request);
    }
}