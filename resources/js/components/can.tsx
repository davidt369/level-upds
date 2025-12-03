import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface CanProps {
    role?: string | string[];
    permission?: string | string[];
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Componente para mostrar contenido basado en roles y permisos del usuario.
 * 
 * @example
 * // Mostrar solo para admin
 * <Can role="admin">
 *   <AdminPanel />
 * </Can>
 * 
 * @example
 * // Mostrar para múltiples roles
 * <Can role={["admin", "teacher"]}>
 *   <CreateButton />
 * </Can>
 * 
 * @example
 * // Mostrar basado en permiso
 * <Can permission="create-problems">
 *   <CreateProblemButton />
 * </Can>
 * 
 * @example
 * // Con contenido alternativo
 * <Can role="admin" fallback={<p>Acceso denegado</p>}>
 *   <AdminPanel />
 * </Can>
 */
export default function Can({ role, permission, children, fallback = null }: CanProps) {
    const pageProps = usePage().props as unknown as {
        auth?: {
            user?: {
                roles?: Array<{ name: string }>;
                permissions?: Array<{ name: string }>;
            };
        };
    };
    const auth = pageProps.auth ?? { user: { roles: [], permissions: [] } };

    // Verificar roles
    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        const userRoles = auth.user?.roles?.map(r => r.name) || [];
        const hasRole = roles.some(r => userRoles.includes(r));
        
        if (!hasRole) {
            return <>{fallback}</>;
        }
    }

    // Verificar permisos
    if (permission) {
        const permissions = Array.isArray(permission) ? permission : [permission];
        const userPermissions = auth.user?.permissions?.map(p => p.name) || [];
        const hasPermission = permissions.some(p => userPermissions.includes(p));
        
        if (!hasPermission) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}
