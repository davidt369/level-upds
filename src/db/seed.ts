import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Cargar .env.local explícitamente
dotenv.config({ path: ".env.local" });

import { db } from "./client";
import {
  users,
  courses,
  enrollments,
  activities,
  programmingActivities,
  submissions,
  grades,
} from "./schema";

// Datos de prueba
const seedData = async () => {
  try {
    console.log("🌱 Iniciando seed de datos...\n");

    // ============================================================================
    // 1. CREAR USUARIOS
    // ============================================================================
    console.log("👥 Creando usuarios...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const profesores = await db
      .insert(users)
      .values([
        {
          name: "Dr. Carlos Mendoza",
          email: "carlos.mendoza@example.com",
          password: hashedPassword,
          role: "teacher",
        },
        {
          name: "Ing. María García",
          email: "maria.garcia@example.com",
          password: hashedPassword,
          role: "teacher",
        },
      ])
      .returning();

    const estudiantes = await db
      .insert(users)
      .values([
        {
          name: "Juan Pérez",
          email: "juan.perez@example.com",
          password: hashedPassword,
          role: "student",
        },
        {
          name: "Ana Rodríguez",
          email: "ana.rodriguez@example.com",
          password: hashedPassword,
          role: "student",
        },
        {
          name: "Luis Martínez",
          email: "luis.martinez@example.com",
          password: hashedPassword,
          role: "student",
        },
        {
          name: "Sofia López",
          email: "sofia.lopez@example.com",
          password: hashedPassword,
          role: "student",
        },
      ])
      .returning();

    const admin = await db
      .insert(users)
      .values({
        name: "Admin System",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      })
      .returning();

    console.log(`  ✓ ${profesores.length} profesores creados`);
    console.log(`  ✓ ${estudiantes.length} estudiantes creados`);
    console.log(`  ✓ 1 admin creado\n`);

    // ============================================================================
    // 2. CREAR CURSOS
    // ============================================================================
    console.log("📚 Creando cursos...");

    const miCursos = await db
      .insert(courses)
      .values([
        {
          docenteId: profesores[0].id,
          nombre: "Introducción a JavaScript",
          descripcion:
            "Aprende los fundamentos de JavaScript desde cero. Cubriremos variables, tipos de datos, funciones, callbacks y promesas.",
          estado: "activo",
          fechaInicio: "2025-01-01",
          fechaFin: "2025-03-31",
        },
        {
          docenteId: profesores[0].id,
          nombre: "JavaScript Avanzado",
          descripcion:
            "Domina conceptos avanzados de JavaScript: asincronía, closures, prototipos, módulos y patrones de diseño.",
          estado: "activo",
          fechaInicio: "2025-02-01",
          fechaFin: "2025-04-30",
        },
        {
          docenteId: profesores[1].id,
          nombre: "Python para Principiantes",
          descripcion:
            "Introducción a la programación con Python. Conceptos básicos, estructuras de datos y programación funcional.",
          estado: "activo",
          fechaInicio: "2025-01-15",
          fechaFin: "2025-05-15",
        },
      ])
      .returning();

    console.log(`  ✓ ${miCursos.length} cursos creados\n`);

    // ============================================================================
    // 3. CREAR INSCRIPCIONES
    // ============================================================================
    console.log("📝 Creando inscripciones...");

    const misInscripciones = await db
      .insert(enrollments)
      .values([
        // Curso 1: JavaScript intro
        { userId: estudiantes[0].id, courseId: miCursos[0].id },
        { userId: estudiantes[1].id, courseId: miCursos[0].id },
        { userId: estudiantes[2].id, courseId: miCursos[0].id },
        { userId: estudiantes[3].id, courseId: miCursos[0].id },

        // Curso 2: JavaScript avanzado
        { userId: estudiantes[0].id, courseId: miCursos[1].id },
        { userId: estudiantes[1].id, courseId: miCursos[1].id },

        // Curso 3: Python
        { userId: estudiantes[2].id, courseId: miCursos[2].id },
        { userId: estudiantes[3].id, courseId: miCursos[2].id },
      ])
      .returning();

    console.log(`  ✓ ${misInscripciones.length} inscripciones creadas\n`);

    // ============================================================================
    // 4. CREAR ACTIVIDADES TEÓRICAS
    // ============================================================================
    console.log("📖 Creando actividades teóricas...");

    const actividadesTeoria = await db
      .insert(activities)
      .values([
        {
          courseId: miCursos[0].id,
          docenteId: profesores[0].id,
          titulo: "Conceptos Básicos de JavaScript",
          descripcion:
            "Aprende sobre variables, tipos de datos, operadores y declaraciones de control.",
          tipo: "theory",
          fechaLimite: new Date("2025-01-15T23:59:59Z"),
          puntuacionTotal: 100,
        },
        {
          courseId: miCursos[0].id,
          docenteId: profesores[0].id,
          titulo: "Funciones y Callbacks",
          descripcion:
            "Entiende cómo funcionan las funciones y los callbacks en JavaScript.",
          tipo: "theory",
          fechaLimite: new Date("2025-01-30T23:59:59Z"),
          puntuacionTotal: 100,
        },
        {
          courseId: miCursos[1].id,
          docenteId: profesores[0].id,
          titulo: "Closures y Scope",
          descripcion:
            "Domina el concepto de closures y el scope en JavaScript.",
          tipo: "theory",
          fechaLimite: new Date("2025-02-15T23:59:59Z"),
          puntuacionTotal: 100,
        },
      ])
      .returning();

    console.log(
      `  ✓ ${actividadesTeoria.length} actividades teóricas creadas\n`
    );

    // ============================================================================
    // 5. CREAR ACTIVIDADES DE PROGRAMACIÓN
    // ============================================================================
    console.log("💻 Creando actividades de programación...");

    const actividadesProgramacion = await db
      .insert(activities)
      .values([
        {
          courseId: miCursos[0].id,
          docenteId: profesores[0].id,
          titulo: "Ejercicio 1: Suma de Números",
          descripcion:
            "Escribe un programa que sume dos números ingresados por el usuario.",
          tipo: "code",
          fechaLimite: new Date("2025-01-20T23:59:59Z"),
          puntuacionTotal: 100,
        },
        {
          courseId: miCursos[0].id,
          docenteId: profesores[0].id,
          titulo: "Ejercicio 2: Contador",
          descripcion:
            "Crea una función que cuente hasta N y retorne el resultado.",
          tipo: "code",
          fechaLimite: new Date("2025-02-05T23:59:59Z"),
          puntuacionTotal: 100,
        },
        {
          courseId: miCursos[2].id,
          docenteId: profesores[1].id,
          titulo: "Python: Fibonacci",
          descripcion: "Implementa la serie de Fibonacci en Python.",
          tipo: "code",
          fechaLimite: new Date("2025-02-10T23:59:59Z"),
          puntuacionTotal: 100,
        },
      ])
      .returning();

    console.log(
      `  ✓ ${actividadesProgramacion.length} actividades de programación creadas\n`
    );

    // ============================================================================
    // 6. CREAR DETALLES DE ACTIVIDADES DE PROGRAMACIÓN
    // ============================================================================
    console.log("🧪 Creando detalles de test cases...");

    const testCases = await db
      .insert(programmingActivities)
      .values([
        {
          activityId: actividadesProgramacion[0].id,
          lenguaje: "javascript",
          tiempoLimite: 1000,
          memoriaLimite: 262144,
          casosPrueba: [
            {
              input: "5 3",
              output: "8",
              description: "Suma de 5 + 3",
            },
            {
              input: "10 20",
              output: "30",
              description: "Suma de 10 + 20",
            },
            {
              input: "0 0",
              output: "0",
              description: "Suma de 0 + 0",
            },
          ],
        },
        {
          activityId: actividadesProgramacion[1].id,
          lenguaje: "javascript",
          tiempoLimite: 1500,
          memoriaLimite: 262144,
          casosPrueba: [
            {
              input: "3",
              output: "3",
              description: "Contar hasta 3",
            },
            {
              input: "5",
              output: "5",
              description: "Contar hasta 5",
            },
            {
              input: "10",
              output: "10",
              description: "Contar hasta 10",
            },
          ],
        },
        {
          activityId: actividadesProgramacion[2].id,
          lenguaje: "python",
          tiempoLimite: 2000,
          memoriaLimite: 524288,
          casosPrueba: [
            {
              input: "5",
              output: "0 1 1 2 3",
              description: "Fibonacci: Primeros 5 números",
            },
            {
              input: "8",
              output: "0 1 1 2 3 5 8 13",
              description: "Fibonacci: Primeros 8 números",
            },
          ],
        },
      ])
      .returning();

    console.log(`  ✓ ${testCases.length} actividades con test cases creadas\n`);

    // ============================================================================
    // 7. CREAR ENVÍOS (Submissions)
    // ============================================================================
    console.log("📤 Creando envíos de estudiantes...");

    const misEnvios = await db
      .insert(submissions)
      .values([
        // Envío 1: Juan - Ejercicio suma (exitoso)
        {
          activityId: actividadesProgramacion[0].id,
          studentId: estudiantes[0].id,
          lenguaje: "javascript",
          codigoFuente: `
function suma(a, b) {
  return a + b;
}

const [x, y] = require('fs').readFileSync(0, 'utf-8').trim().split(' ').map(Number);
console.log(suma(x, y));
          `.trim(),
          estado: "done",
          resultado: [
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
          ],
          puntuacion: 100,
        },

        // Envío 2: Ana - Ejercicio suma (parcial)
        {
          activityId: actividadesProgramacion[0].id,
          studentId: estudiantes[1].id,
          lenguaje: "javascript",
          codigoFuente: `
function suma(a, b) {
  return a + b + 1; // Error intencional
}

const [x, y] = require('fs').readFileSync(0, 'utf-8').trim().split(' ').map(Number);
console.log(suma(x, y));
          `.trim(),
          estado: "done",
          resultado: [
            {
              testCaseId: 0,
              passed: false,
              expected: "8",
              actual: "9",
              executionTime: 45,
              memoryUsed: 1024,
            },
            {
              testCaseId: 1,
              passed: false,
              expected: "30",
              actual: "31",
              executionTime: 42,
              memoryUsed: 1024,
            },
            {
              testCaseId: 2,
              passed: false,
              expected: "0",
              actual: "1",
              executionTime: 41,
              memoryUsed: 1024,
            },
          ],
          puntuacion: 0,
        },

        // Envío 3: Luis - Ejercicio contador (exitoso)
        {
          activityId: actividadesProgramacion[1].id,
          studentId: estudiantes[2].id,
          lenguaje: "javascript",
          codigoFuente: `
function contar(n) {
  return n;
}

const n = parseInt(require('fs').readFileSync(0, 'utf-8').trim());
console.log(contar(n));
          `.trim(),
          estado: "done",
          resultado: [
            {
              testCaseId: 0,
              passed: true,
              expected: "3",
              actual: "3",
              executionTime: 50,
              memoryUsed: 1024,
            },
            {
              testCaseId: 1,
              passed: true,
              expected: "5",
              actual: "5",
              executionTime: 48,
              memoryUsed: 1024,
            },
            {
              testCaseId: 2,
              passed: true,
              expected: "10",
              actual: "10",
              executionTime: 52,
              memoryUsed: 1024,
            },
          ],
          puntuacion: 100,
        },

        // Envío 4: Sofia - Fibonacci (exitoso)
        {
          activityId: actividadesProgramacion[2].id,
          studentId: estudiantes[3].id,
          lenguaje: "python",
          codigoFuente: `
def fibonacci(n):
    a, b = 0, 1
    result = [a]
    while b <= n:
        result.append(b)
        a, b = b, a + b
    return ' '.join(map(str, result))

n = int(input())
print(fibonacci(n))
          `.trim(),
          estado: "done",
          resultado: [
            {
              testCaseId: 0,
              passed: true,
              expected: "0 1 1 2 3 5",
              actual: "0 1 1 2 3 5",
              executionTime: 75,
              memoryUsed: 2048,
            },
            {
              testCaseId: 1,
              passed: true,
              expected: "0 1 1 2 3 5 8 13",
              actual: "0 1 1 2 3 5 8 13",
              executionTime: 78,
              memoryUsed: 2048,
            },
          ],
          puntuacion: 100,
        },

        // Envío 5: Juan - Fibonacci (pendiente)
        {
          activityId: actividadesProgramacion[2].id,
          studentId: estudiantes[0].id,
          lenguaje: "python",
          codigoFuente: `
# Aún no implementado
def fibonacci(n):
    pass
          `.trim(),
          estado: "pending",
          resultado: null,
          puntuacion: 0,
        },
      ])
      .returning();

    console.log(`  ✓ ${misEnvios.length} envíos creados\n`);

    // ============================================================================
    // 8. CREAR CALIFICACIONES (Grades)
    // ============================================================================
    console.log("📊 Creando calificaciones...");

    const misCalificaciones = await db
      .insert(grades)
      .values([
        // Calificación para envío 1 (Juan - Suma exitosa)
        {
          submissionId: misEnvios[0].id,
          studentId: estudiantes[0].id,
          activityId: actividadesProgramacion[0].id,
          courseId: miCursos[0].id,
          score: 100,
          verdict: "passed",
        },

        // Calificación para envío 2 (Ana - Suma fallida)
        {
          submissionId: misEnvios[1].id,
          studentId: estudiantes[1].id,
          activityId: actividadesProgramacion[0].id,
          courseId: miCursos[0].id,
          score: 0,
          verdict: "failed",
        },

        // Calificación para envío 3 (Luis - Contador exitoso)
        {
          submissionId: misEnvios[2].id,
          studentId: estudiantes[2].id,
          activityId: actividadesProgramacion[1].id,
          courseId: miCursos[0].id,
          score: 100,
          verdict: "passed",
        },

        // Calificación para envío 4 (Sofia - Fibonacci exitoso)
        {
          submissionId: misEnvios[3].id,
          studentId: estudiantes[3].id,
          activityId: actividadesProgramacion[2].id,
          courseId: miCursos[2].id,
          score: 100,
          verdict: "passed",
        },
      ])
      .returning();

    console.log(`  ✓ ${misCalificaciones.length} calificaciones creadas\n`);

    // ============================================================================
    // RESUMEN
    // ============================================================================
    console.log("════════════════════════════════════════════════════════════");
    console.log("✅ SEED DE DATOS COMPLETADO CON ÉXITO");
    console.log(
      "════════════════════════════════════════════════════════════\n"
    );

    console.log("📊 ESTADÍSTICAS:");
    console.log(
      `  Usuarios: ${profesores.length} profesores + ${estudiantes.length
      } estudiantes + 1 admin = ${profesores.length + estudiantes.length + 1}`
    );
    console.log(`  Cursos: ${miCursos.length}`);
    console.log(`  Inscripciones: ${misInscripciones.length}`);
    console.log(
      `  Actividades: ${actividadesTeoria.length} teóricas + ${actividadesProgramacion.length} de programación`
    );
    console.log(`  Test Cases: ${testCases.length} actividades con tests`);
    console.log(
      `  Envíos: ${misEnvios.length} (${misEnvios.filter((e) => e.estado === "done").length
      } completados, ${misEnvios.filter((e) => e.estado === "pending").length
      } pendiente)`
    );
    console.log(`  Calificaciones: ${misCalificaciones.length}\n`);

    console.log("🧪 PUEDES PROBAR CON:");
    console.log("  • import { getUserById } from '@/db/queries'");
    console.log("  • import { getCoursesByTeacher } from '@/db/queries'");
    console.log("  • import { getEnrollmentsByStudent } from '@/db/queries'");
    console.log("  • import { getSubmissionsByActivity } from '@/db/queries'");
    console.log("  • import { getGradesByStudent } from '@/db/queries'\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedData();
