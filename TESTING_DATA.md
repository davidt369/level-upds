# 🧪 Datos de Prueba - Level UpDS

Este documento describe los datos de prueba que han sido cargados en la base de datos para probar todas las funcionalidades y módulos de la plataforma Level UpDS.

## 📊 Resumen de Datos Cargados

```
Usuarios: 2 profesores + 4 estudiantes + 1 admin = 7
Cursos: 3
Inscripciones: 8
Actividades: 3 teóricas + 3 de programación (6 total)
Test Cases: 3 actividades con casos de prueba
Envíos: 5 (4 completados, 1 pendiente)
Calificaciones: 4
```

---

## 👥 Usuarios Creados

### Profesores

1. **Dr. Carlos Mendoza** (carlos.mendoza@example.com)

   - Rol: teacher
   - Cursos: "Introducción a JavaScript", "JavaScript Avanzado"

2. **Ing. María García** (maria.garcia@example.com)
   - Rol: teacher
   - Cursos: "Python para Principiantes"

### Estudiantes

1. **Juan Pérez** (juan.perez@example.com)

   - Rol: student
   - Inscrito en: Intro JS, JS Avanzado, Python
   - Envíos: 2 (1 exitoso, 1 pendiente)

2. **Ana Rodríguez** (ana.rodriguez@example.com)

   - Rol: student
   - Inscrito en: Intro JS, JS Avanzado
   - Envíos: 1 (fallido)

3. **Luis Martínez** (luis.martinez@example.com)

   - Rol: student
   - Inscrito en: Intro JS, Python
   - Envíos: 1 (exitoso)

4. **Sofia López** (sofia.lopez@example.com)
   - Rol: student
   - Inscrito en: Intro JS, Python
   - Envíos: 1 (exitoso)

### Admin

- **Admin System** (admin@example.com)
  - Rol: admin

**Contraseña común**: `password123`

---

## 📚 Cursos Creados

### 1. Introducción a JavaScript

- **Docente**: Dr. Carlos Mendoza
- **Período**: 2025-01-01 a 2025-03-31
- **Estado**: Activo
- **Estudiantes**: 4 (Juan, Ana, Luis, Sofia)
- **Actividades**: 5 (2 teóricas + 3 de programación)

### 2. JavaScript Avanzado

- **Docente**: Dr. Carlos Mendoza
- **Período**: 2025-02-01 a 2025-04-30
- **Estado**: Activo
- **Estudiantes**: 2 (Juan, Ana)
- **Actividades**: 1 (1 teórica)

### 3. Python para Principiantes

- **Docente**: Ing. María García
- **Período**: 2025-01-15 a 2025-05-15
- **Estado**: Activo
- **Estudiantes**: 2 (Luis, Sofia)
- **Actividades**: 1 (1 de programación)

---

## 📖 Actividades Teóricas

### 1. Conceptos Básicos de JavaScript

- **Curso**: Intro JS
- **Profesor**: Dr. Carlos Mendoza
- **Fecha Límite**: 2025-01-15
- **Puntuación Total**: 100

### 2. Funciones y Callbacks

- **Curso**: Intro JS
- **Profesor**: Dr. Carlos Mendoza
- **Fecha Límite**: 2025-01-30
- **Puntuación Total**: 100

### 3. Closures y Scope

- **Curso**: JS Avanzado
- **Profesor**: Dr. Carlos Mendoza
- **Fecha Límite**: 2025-02-15
- **Puntuación Total**: 100

---

## 💻 Actividades de Programación

### 1. Ejercicio 1: Suma de Números

- **Curso**: Intro JS
- **Profesor**: Dr. Carlos Mendoza
- **Fecha Límite**: 2025-01-20
- **Lenguaje**: JavaScript
- **Tiempo Límite**: 1000ms
- **Memoria Límite**: 256KB
- **Puntuación Total**: 100

#### Test Cases:

```
1. Input: "5 3"      → Output: "8"  (Suma de 5 + 3)
2. Input: "10 20"    → Output: "30" (Suma de 10 + 20)
3. Input: "0 0"      → Output: "0"  (Suma de 0 + 0)
```

**Envíos completados**:

- ✅ Juan Pérez: 100/100 (PASSED) - Todos los test cases pasados
- ❌ Ana Rodríguez: 0/100 (FAILED) - Todos los test cases fallados (error en el código)

---

### 2. Ejercicio 2: Contador

- **Curso**: Intro JS
- **Profesor**: Dr. Carlos Mendoza
- **Fecha Límite**: 2025-02-05
- **Lenguaje**: JavaScript
- **Tiempo Límite**: 1500ms
- **Memoria Límite**: 256KB
- **Puntuación Total**: 100

#### Test Cases:

```
1. Input: "3"  → Output: "3"  (Contar hasta 3)
2. Input: "5"  → Output: "5"  (Contar hasta 5)
3. Input: "10" → Output: "10" (Contar hasta 10)
```

**Envíos completados**:

- ✅ Luis Martínez: 100/100 (PASSED) - Todos los test cases pasados

---

### 3. Python: Fibonacci

- **Curso**: Python
- **Profesor**: Ing. María García
- **Fecha Límite**: 2025-02-10
- **Lenguaje**: Python
- **Tiempo Límite**: 2000ms
- **Memoria Límite**: 512KB
- **Puntuación Total**: 100

#### Test Cases:

```
1. Input: "5" → Output: "0 1 1 2 3 5"         (Fibonacci hasta 5)
2. Input: "8" → Output: "0 1 1 2 3 5 8 13"   (Fibonacci hasta 8)
```

**Envíos completados**:

- ✅ Sofia López: 100/100 (PASSED) - Todos los test cases pasados
- ⏳ Juan Pérez: PENDING - Envío aún sin procesar

---

## 📊 Calificaciones y Verdicts

| Estudiante    | Actividad | Puntuación | Veredicto |
| ------------- | --------- | ---------- | --------- |
| Juan Pérez    | Suma      | 100        | PASSED    |
| Ana Rodríguez | Suma      | 0          | FAILED    |
| Luis Martínez | Contador  | 100        | PASSED    |
| Sofia López   | Fibonacci | 100        | PASSED    |

---

## 🧪 Cómo Probar los Datos

### 1. Obtener un usuario por ID

```typescript
import { getUserById } from "@/db/queries";

const user = await getUserById(1); // Dr. Carlos Mendoza
```

### 2. Obtener cursos de un profesor

```typescript
import { getCoursesByTeacher } from "@/db/queries";

const courses = await getCoursesByTeacher(1); // Cursos de Carlos
```

### 3. Obtener inscripciones de un estudiante

```typescript
import { getEnrollmentsByStudent } from "@/db/queries";

const enrollments = await getEnrollmentsByStudent(3); // Inscripciones de Juan
```

### 4. Obtener envíos de una actividad

```typescript
import { getSubmissionsByActivity } from "@/db/queries";

const submissions = await getSubmissionsByActivity(4); // Envíos del ejercicio Suma
```

### 5. Obtener calificaciones de un estudiante

```typescript
import { getGradesByStudent } from "@/db/queries";

const grades = await getGradesByStudent(3); // Calificaciones de Juan
```

### 6. Obtener calificaciones por actividad

```typescript
import { getGradesByActivity } from "@/db/queries";

const grades = await getGradesByActivity(4); // Calificaciones para la actividad Suma
```

---

## 📝 Scénarios de Prueba

### Scenario 1: Profesor revisando su curso

```typescript
// 1. Obtener el profesor
const teacher = await getUserById(1);

// 2. Obtener sus cursos
const courses = await getCoursesByTeacher(1);

// 3. Para cada curso, obtener las actividades
const activities = await getActivitiesByCourse(courses[0].id);

// 4. Para cada actividad, obtener los envíos
for (const activity of activities) {
  const submissions = await getSubmissionsByActivity(activity.id);
  console.log(`${activity.titulo}: ${submissions.length} envíos`);
}
```

### Scenario 2: Estudiante viendo su progreso

```typescript
// 1. Obtener el estudiante
const student = await getUserById(3); // Juan

// 2. Obtener sus inscripciones
const enrollments = await getEnrollmentsByStudent(3);

// 3. Obtener sus calificaciones
const grades = await getGradesByStudent(3);

// 4. Calcular promedio
const avgScore = grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
console.log(`Promedio: ${avgScore}`);
```

### Scenario 3: Administrador viendo estadísticas

```typescript
// 1. Obtener todos los usuarios
const users = await getAllUsers();

// 2. Filtrar estudiantes
const students = users.filter((u) => u.role === "student");

// 3. Obtener envíos por estado
const submissions = await db.query.submissions.findMany();
const completed = submissions.filter((s) => s.estado === "done").length;
const pending = submissions.filter((s) => s.estado === "pending").length;

console.log(`Envíos completados: ${completed}`);
console.log(`Envíos pendientes: ${pending}`);
```

---

## 🔄 Regenerar Datos de Prueba

Para ejecutar el seed nuevamente y regenerar todos los datos:

```bash
# Opción 1: Usar el comando npm
pnpm db:seed

# Opción 2: Ejecutar directamente con tsx
tsx src/db/seed.ts
```

**Nota**: El seed insertará nuevos datos. Si quieres empezar desde cero, primero elimina y recrea la base de datos:

```bash
# Resetear base de datos (eliminar y recrear)
# Luego ejecutar:
pnpm db:push
pnpm db:seed
```

---

## 📌 Notas Importantes

- Todos los usuarios usan la contraseña: `password123`
- Las fechas de prueba están en 2025 (puedes modificarlas según necesites)
- Los test cases están diseñados para ser fáciles de verificar manualmente
- El código fuente de los envíos está incluido para referencia
- Algunos envíos son intentionalmente incorrectos para probar casos de fallo

---

## 🎯 Casos de Prueba Cubiertos

✅ **Usuarios**: Creación, lectura, diferentes roles  
✅ **Cursos**: Múltiples cursos por profesor, inscripciones  
✅ **Actividades**: Teóricas y de programación con test cases  
✅ **Envíos**: Exitosos, fallidos, pendientes  
✅ **Calificaciones**: Passing, failing, parciales  
✅ **Relaciones**: One-to-many, many-to-many, cascading deletes

---

**Última actualización**: 4 de diciembre de 2025
