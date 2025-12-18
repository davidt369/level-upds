
import { DriveStep } from "driver.js";

// Helper type for Steps Configuration
type TourSteps = {
    [key: string]: DriveStep[];
};

export const tourSteps: {
    student: TourSteps;
    teacher: TourSteps;
    admin: TourSteps;
} = {
    student: {
        "/dashboard": [
            {
                element: "#dashboard-welcome",
                popover: {
                    title: "Bienvenido a tu Dashboard",
                    description: "Aquí encontrarás un resumen general de tu progreso académico en Level UPDS.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                element: "#student-stats",
                popover: {
                    title: "Estadísticas Rápidas",
                    description: "Visualiza tus cursos inscritos, actividades completadas y tu promedio general al instante.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                element: "#upcoming-deadlines",
                popover: {
                    title: "Actividades Pendientes",
                    description: "Mantente al día con las actividades que vencen pronto. ¡No dejes que se te pase la fecha!",
                    side: "top",
                    align: "start",
                },
            },
        ],
        "/dashboard/courses": [
            {
                element: "#courses-header",
                popover: {
                    title: "Cursos Disponibles",
                    description: "Explora los cursos en los que estás inscrito.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#courses-table",
                popover: {
                    title: "Listado",
                    description: "Aquí verás el estado de tus materias.",
                    side: "top",
                    align: "start",
                }
            }
        ],
        "/dashboard/activities": [
            {
                element: "#activities-header",
                popover: {
                    title: "Panel de Actividades",
                    description: "Gestiona todas tus tareas desde aquí.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                element: "#activities-tabs",
                popover: {
                    title: "Pendientes vs Historial",
                    description: "Alterna entre las actividades que aún debes entregar y las que ya has completado para ver tus notas.",
                    side: "bottom",
                    align: "start",
                }
            }
        ],
        // Default Course View for Student
        "/courses-detail": [
            {
                element: "#course-detail-header",
                popover: {
                    title: "Detalle del Curso",
                    description: "Información y contenido del curso seleccionado.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#course-tabs",
                popover: {
                    title: "Contenido y Ranking",
                    description: "Accede a las actividades del curso o revisa el ranking de los mejores estudiantes.",
                    side: "bottom",
                    align: "start",
                }
            }
        ],
        // Programming activity
        "/activity-code": [
            {
                element: "#programming-view",
                popover: {
                    title: "Entorno de Programación",
                    description: "Bienvenido a tu área de trabajo. Aquí resolverás el ejercicio propuesto.",
                    side: "left",
                    align: "start",
                }
            },
            {
                element: "#tab-instructions",
                popover: {
                    title: "Instrucciones",
                    description: "Lee atentamente el problema. Aquí encontrarás la descripción, los límites de tiempo y memoria.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#example-test-case",
                popover: {
                    title: "Casos de Ejemplo",
                    description: "Analiza los ejemplos de entrada y salida para entender qué se espera de tu código.",
                    side: "top",
                    align: "start",
                }
            },
            {
                element: "#code-editor-wrapper",
                popover: {
                    title: "Editor de Código",
                    description: "Escribe tu solución aquí. Tienes un editor profesional con resaltado de sintaxis.",
                    side: "right",
                    align: "start",
                }
            },
            {
                element: "#language-selector",
                popover: {
                    title: "Selector de Lenguaje",
                    description: "Puedes cambiar el lenguaje de programación si el ejercicio lo permite (Java, Python, JS, PHP).",
                    side: "bottom",
                    align: "center",
                }
            },
            {
                element: "#submit-solution-btn",
                popover: {
                    title: "Enviar Solución",
                    description: "Cuando estés listo, envía tu código. El juez automático evaluará tu solución con múltiples casos de prueba.",
                    side: "top",
                    align: "end",
                }
            },
            {
                element: "#tab-results",
                popover: {
                    title: "Resultados",
                    description: "Después de enviar, esta pestaña se activará automáticamente mostrando qué casos de prueba pasaste y cuáles fallaron.",
                    side: "bottom",
                    align: "start",
                }
            }
        ]
    },
    teacher: {
        "/dashboard": [
            {
                element: "#teacher-welcome",
                popover: {
                    title: "Panel de Profesor",
                    description: "Bienvenido, profesor. Aquí tiene las herramientas para gestionar sus clases.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                element: "#teacher-stats",
                popover: {
                    title: "Resumen Académico",
                    description: "Vea rápidamente cuántos cursos tiene activos y el total de estudiantes.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                element: "#recent-activities",
                popover: {
                    title: "Actividades Recientes",
                    description: "Las últimas tareas que ha asignado a sus estudiantes aparecerán aquí.",
                    side: "top",
                    align: "start",
                },
            }
        ],
        "/dashboard/courses": [
            {
                element: "#courses-header",
                popover: {
                    title: "Gestión de Cursos",
                    description: "Cree nuevos cursos o administre los existentes.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#courses-table",
                popover: {
                    title: "Lista de Cursos",
                    description: "Aquí puede ver, editar o archivar sus cursos. Use el menú de acciones en cada fila.",
                    side: "top",
                    align: "start",
                }
            }
        ],
        "/courses-detail": [
            {
                element: "#course-detail-header",
                popover: {
                    title: "Administración del Curso",
                    description: "Gestione el contenido de este curso específico.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#create-activity-button",
                popover: {
                    title: "Crear Actividad",
                    description: "Use este botón para añadir nuevas tareas o exámenes a este curso.",
                    side: "left",
                    align: "center",
                }
            },
            {
                element: "#course-tabs",
                popover: {
                    title: "Pestañas de Navegación",
                    description: "Navegue entre el contenido del curso y el ranking de estudiantes.",
                    side: "bottom",
                    align: "start",
                }
            }
        ],
        "/activity-code": [
            {
                element: "#programming-view",
                popover: {
                    title: "Vista de Programación",
                    description: "Así verán sus estudiantes el entorno de código. Puede probar los casos de uso.",
                    side: "left",
                    align: "start",
                }
            }
        ]
    },
    admin: {
        "/dashboard/users": [
            {
                element: "#users-header",
                popover: {
                    title: "Control de Usuarios",
                    description: "Administre todos los usuarios de la plataforma.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#users-table",
                popover: {
                    title: "Directorio",
                    description: "Filtre por rol, edite información o elimine usuarios si es necesario.",
                    side: "top",
                    align: "start",
                }
            }
        ],
        "/dashboard/courses": [
            {
                element: "#courses-header",
                popover: {
                    title: "Administración de Cursos",
                    description: "Gestione todos los cursos de la plataforma.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#courses-table",
                popover: {
                    title: "Listado Global",
                    description: "Visualice el estado de todos los cursos.",
                    side: "top",
                    align: "start",
                }
            }
        ],
        "/courses-detail": [
            {
                element: "#course-detail-header",
                popover: {
                    title: "Detalle del Curso",
                    description: "Vista administrativa del curso.",
                    side: "bottom",
                    align: "start",
                }
            },
            {
                element: "#course-tabs",
                popover: {
                    title: "Contenido",
                    description: "Revise las actividades y rankings.",
                    side: "bottom",
                    align: "start",
                }
            }
        ],
        "/activity-code": [
            {
                element: "#programming-view",
                popover: {
                    title: "Revisión de Código",
                    description: "Vista de depuración para administradores.",
                    side: "left",
                    align: "start",
                }
            }
        ]
    }
};
