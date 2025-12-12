/**
 * EJEMPLOS DE USO DE LA BASE DE DATOS
 *
 * Este archivo contiene ejemplos de cómo usar las funciones de queries
 * en tu aplicación Next.js
 */

// ============================================================================
// EJEMPLO 1: Crear un Usuario (Registro)
// ============================================================================

import {
  createUser,
  getUserByEmail,
  createCourse,
  getCoursesByTeacher,
  createActivity,
  createEnrollment,
  createSubmission,
  getSubmissionsByStudent,
  createGrade,
  getGradesByStudent,
  createProgrammingActivity,
  updateSubmission,
} from "@/db/queries";
import {
  UserRole,
  ActivityType,
  SubmissionStatus,
  GradeVerdict,
} from "@/db/types";

async function exampleCreateUser() {
  try {
    // Primero, verificar que el email no exista
    const existingUser = await getUserByEmail("estudiante@example.com");
    if (existingUser) {
      console.log("Usuario ya existe");
      return;
    }

    // Crear nuevo usuario
    const user = await createUser({
      name: "Juan Pérez",
      email: "estudiante@example.com",
      password: "hashed_password_here", // IMPORTANTE: usar bcrypt para hashear
      role: UserRole.STUDENT,
    });

    console.log("✅ Usuario creado:", user);
    return user;
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
  }
}

// ============================================================================
// EJEMPLO 2: Profesor crea un Curso
// ============================================================================

async function exampleCreateCourse() {
  try {
    const course = await createCourse({
      docenteId: 1, // ID del profesor
      nombre: "Introducción a JavaScript",
      descripcion: "Aprende los fundamentos de JavaScript desde cero",
      estado: "activo",
      fechaInicio: "2024-01-15", // formato YYYY-MM-DD
      fechaFin: "2024-03-15", // formato YYYY-MM-DD
    });

    console.log("✅ Curso creado:", course);
    return course;
  } catch (error) {
    console.error("❌ Error creando curso:", error);
  }
}

// ============================================================================
// EJEMPLO 3: Obtener todos los cursos de un profesor
// ============================================================================

async function exampleGetTeacherCourses() {
  try {
    const courses = await getCoursesByTeacher(1); // ID del profesor
    console.log("✅ Cursos del profesor:", courses);
    return courses;
  } catch (error) {
    console.error("❌ Error obteniendo cursos:", error);
  }
}

// ============================================================================
// EJEMPLO 4: Crear una Actividad de Teoría
// ============================================================================

async function exampleCreateTheoryActivity() {
  try {
    const activity = await createActivity({
      courseId: 1, // ID del curso
      docenteId: 1, // ID del profesor
      titulo: "Conceptos Básicos de JavaScript",
      descripcion: "Entiende variables, tipos de datos y funciones",
      tipo: ActivityType.THEORY,
      fechaLimite: new Date("2024-01-30"),
      puntuacionTotal: 100,
    } as any);

    console.log("✅ Actividad teórica creada:", activity);
    return activity;
  } catch (error) {
    console.error("❌ Error creando actividad:", error);
  }
}

// ============================================================================
// EJEMPLO 5: Crear una Actividad de Programación con Casos de Prueba
// ============================================================================

async function exampleCreateProgrammingActivity() {
  try {
    // Primero crear la actividad
    const activity = await createActivity({
      courseId: 1,
      docenteId: 1,
      titulo: "Sumar dos números",
      descripcion: "Escribe un programa que sume dos números",
      tipo: ActivityType.CODE,
      fechaLimite: new Date("2024-02-15"),
      puntuacionTotal: 100,
    } as any);

    // Luego crear la actividad de programación con casos de prueba
    const testCases = [
      {
        input: "5 3",
        output: "8",
        description: "Sumar 5 + 3",
      },
      {
        input: "10 20",
        output: "30",
        description: "Sumar 10 + 20",
      },
      {
        input: "0 0",
        output: "0",
        description: "Sumar 0 + 0",
      },
    ];

    const progActivity = await createProgrammingActivity({
      activityId: activity.id,
      lenguaje: "python",
      tiempoLimite: 1000, // 1 segundo
      memoriaLimite: 262144, // 256 MB
      casosPrueba: testCases,
    });

    console.log("✅ Actividad de programación creada:", progActivity);
    return progActivity;
  } catch (error) {
    console.error("❌ Error creando actividad de programación:", error);
  }
}

// ============================================================================
// EJEMPLO 6: Estudiante se Inscribe en un Curso
// ============================================================================

async function exampleEnrollStudent() {
  try {
    const enrollment = await createEnrollment({
      userId: 2, // ID del estudiante
      courseId: 1, // ID del curso
    });

    console.log("✅ Estudiante inscrito:", enrollment);
    return enrollment;
  } catch (error) {
    console.error("❌ Error inscribiendo estudiante:", error);
  }
}

// ============================================================================
// EJEMPLO 7: Estudiante Envía Solución
// ============================================================================

async function exampleSubmitCode() {
  try {
    const submission = await createSubmission({
      activityId: 1, // ID de la actividad de programación
      studentId: 2, // ID del estudiante
      lenguaje: "python",
      codigoFuente: `
def suma(a, b):
    return a + b

# Leer entrada
entrada = input().split()
x = int(entrada[0])
y = int(entrada[1])

# Imprimir resultado
print(suma(x, y))
      `.trim(),
      estado: SubmissionStatus.PENDING,
      resultado: null, // Se llenará después de ejecutar tests
    });

    console.log("✅ Envío creado:", submission);
    return submission;
  } catch (error) {
    console.error("❌ Error enviando código:", error);
  }
}

// ============================================================================
// EJEMPLO 8: Actualizar Envío con Resultados de Tests
// ============================================================================

async function exampleUpdateSubmissionWithResults() {
  try {
    const submissionResults = [
      {
        testCaseId: 0,
        passed: true,
        expected: "8",
        actual: "8",
        executionTime: 45,
        memoryUsed: 1024,
      },
      {
        testCaseId: 1,
        passed: true,
        expected: "30",
        actual: "30",
        executionTime: 42,
        memoryUsed: 1024,
      },
      {
        testCaseId: 2,
        passed: true,
        expected: "0",
        actual: "0",
        executionTime: 41,
        memoryUsed: 1024,
      },
    ];

    const updatedSubmission = await updateSubmission(1, {
      estado: SubmissionStatus.DONE,
      resultado: submissionResults,
      puntuacion: 100, // 3/3 tests pasados
    });

    console.log("✅ Envío actualizado:", updatedSubmission);
    return updatedSubmission;
  } catch (error) {
    console.error("❌ Error actualizando envío:", error);
  }
}

// ============================================================================
// EJEMPLO 9: Crear Calificación Final
// ============================================================================

async function exampleCreateGrade() {
  try {
    const grade = await createGrade({
      submissionId: 1, // ID del envío
      studentId: 2, // ID del estudiante
      activityId: 1, // ID de la actividad
      courseId: 1, // ID del curso
      score: 100,
      verdict: GradeVerdict.PASSED,
    });

    console.log("✅ Calificación creada:", grade);
    return grade;
  } catch (error) {
    console.error("❌ Error creando calificación:", error);
  }
}

// ============================================================================
// EJEMPLO 10: Obtener Todas las Calificaciones de un Estudiante
// ============================================================================

async function exampleGetStudentGrades() {
  try {
    const grades = await getGradesByStudent(2); // ID del estudiante
    console.log("✅ Calificaciones del estudiante:", grades);

    // Calcular promedio
    if (grades.length > 0) {
      const promedio =
        grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
      console.log(`📊 Promedio: ${promedio.toFixed(2)}`);
    }

    return grades;
  } catch (error) {
    console.error("❌ Error obteniendo calificaciones:", error);
  }
}

// ============================================================================
// EJEMPLO 11: Obtener Envíos de un Estudiante
// ============================================================================

async function exampleGetStudentSubmissions() {
  try {
    const submissions = await getSubmissionsByStudent(2); // ID del estudiante
    console.log("✅ Envíos del estudiante:", submissions);
    return submissions;
  } catch (error) {
    console.error("❌ Error obteniendo envíos:", error);
  }
}

// Exportar para usar en rutas API
export {
  exampleCreateUser,
  exampleCreateCourse,
  exampleGetTeacherCourses,
  exampleCreateTheoryActivity,
  exampleCreateProgrammingActivity,
  exampleEnrollStudent,
  exampleSubmitCode,
  exampleUpdateSubmissionWithResults,
  exampleCreateGrade,
  exampleGetStudentGrades,
  exampleGetStudentSubmissions,
};
