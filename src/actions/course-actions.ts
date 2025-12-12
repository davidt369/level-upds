"use server";

import { db } from "@/db/client";
import { courses, enrollments, users } from "@/db/schema";
import { CourseFormSchema } from "@/schemas/course";
import {
  eq,
  and,
  desc,
  getTableColumns,
  ilike,
  notInArray,
  or,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";
import { checkIsExpired } from "@/lib/utils";

export async function createCourse(values: z.infer<typeof CourseFormSchema>) {
  const session = await auth();
  const isTeacher = session?.user?.role === "teacher";
  const isAdmin = session?.user?.role === "admin";

  if (!session?.user || (!isTeacher && !isAdmin)) {
    return { error: "No autorizado" };
  }

  const validatedFields = CourseFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { nombre, descripcion, fechaInicio, fechaFin, estado } =
    validatedFields.data;

  try {
    await db.insert(courses).values({
      nombre,
      descripcion,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      estado,
      docenteId: parseInt(session.user.id),
    });

    revalidatePath("/dashboard/courses");
    return { success: "Curso creado exitosamente" };
  } catch (error) {
    console.error("Error creating course:", error);
    return { error: "Error al crear el curso" };
  }
}

export async function updateCourse(values: z.infer<typeof CourseFormSchema>) {
  const session = await auth();
  const isTeacher = session?.user?.role === "teacher";
  const isAdmin = session?.user?.role === "admin";

  if (!session?.user || (!isTeacher && !isAdmin)) {
    return { error: "No autorizado" };
  }

  const validatedFields = CourseFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { id, nombre, descripcion, fechaInicio, fechaFin, estado } =
    validatedFields.data;

  if (!id) return { error: "ID de curso requerido" };

  try {
    // Verify ownership or admin
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, id),
    });

    if (!course) {
      return { error: "Curso no encontrado" };
    }

    if (!isAdmin && course.docenteId !== parseInt(session.user.id)) {
      return { error: "No autorizado o curso no encontrado" };
    }

    await db
      .update(courses)
      .set({
        nombre,
        descripcion,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        estado,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id));

    revalidatePath("/dashboard/courses");
    return { success: "Curso actualizado exitosamente" };
  } catch (error) {
    console.error("Error updating course:", error);
    return { error: "Error al actualizar el curso" };
  }
}

export async function deleteCourse(courseId: number) {
  const session = await auth();
  const isTeacher = session?.user?.role === "teacher";
  const isAdmin = session?.user?.role === "admin";

  if (!session?.user || (!isTeacher && !isAdmin)) {
    return { error: "No autorizado" };
  }

  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return { error: "Curso no encontrado" };
    }

    if (!isAdmin && course.docenteId !== parseInt(session.user.id)) {
      return { error: "No autorizado o curso no encontrado" };
    }

    // Check if course is expired (Admins can bypass)
    // Cast to string to avoid TS narrow type issues if role is typed as enum vs string
    if (checkIsExpired(course.fechaFin) && (session.user.role as string) !== "admin") {
      return { error: "No se puede eliminar un curso finalizado" };
    }

    await db.delete(courses).where(eq(courses.id, courseId));

    revalidatePath("/dashboard/courses");
    return { success: "Curso eliminado exitosamente" };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Error al eliminar el curso" };
  }
}

export async function getTeacherCourses() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    // If admin, return all courses
    if (session.user.role === "admin") {
      const allCourses = await db
        .select({
          ...getTableColumns(courses),
          docenteName: users.name,
        })
        .from(courses)
        .leftJoin(users, eq(courses.docenteId, users.id))
        .orderBy(desc(courses.createdAt));
      return allCourses;
    }

    const teacherCourses = await db
      .select({
        ...getTableColumns(courses),
        docenteName: users.name,
      })
      .from(courses)
      .leftJoin(users, eq(courses.docenteId, users.id))
      .where(eq(courses.docenteId, parseInt(session.user.id)))
      .orderBy(desc(courses.createdAt));

    return teacherCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getAvailableCourses() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    // Get all active courses
    // In a real app, we might want to exclude courses the student is already enrolled in
    // or mark them as enrolled.
    const allCourses = await db
      .select({
        id: courses.id,
        nombre: courses.nombre,
        descripcion: courses.descripcion,
        fechaInicio: courses.fechaInicio,
        fechaFin: courses.fechaFin,
        docenteName: users.name,
      })
      .from(courses)
      .leftJoin(users, eq(courses.docenteId, users.id))
      .where(eq(courses.estado, "activo"));

    return allCourses;
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
}

export async function enrollInCourse(courseId: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "student") {
    return { error: "No autorizado" };
  }

  try {
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, parseInt(session.user.id)),
          eq(enrollments.courseId, courseId)
        )
      );

    if (existingEnrollment.length > 0) {
      return { error: "Ya estás inscrito en este curso" };
    }

    await db.insert(enrollments).values({
      userId: parseInt(session.user.id),
      courseId: courseId,
    });

    revalidatePath("/dashboard/my-courses");
    return { success: "Inscripción exitosa" };
  } catch (error) {
    return { error: "Error al inscribirse" };
  }
}

export async function unenrollFromCourse(courseId: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "student") {
    return { error: "No autorizado" };
  }

  try {
    const deleted = await db
      .delete(enrollments)
      .where(
        and(
          eq(enrollments.userId, parseInt(session.user.id)),
          eq(enrollments.courseId, courseId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return { error: "No estás inscrito en este curso" };
    }

    revalidatePath("/dashboard/my-courses");
    return { success: "Te has dado de baja del curso exitosamente" };
  } catch (error) {
    console.error("Error unenrolling:", error);
    return { error: "Error al darse de baja" };
  }
}

export async function getStudentCourses() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    const studentCourses = await db
      .select({
        id: courses.id,
        nombre: courses.nombre,
        descripcion: courses.descripcion,
        fechaInicio: courses.fechaInicio,
        fechaFin: courses.fechaFin,
        docenteName: users.name,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .leftJoin(users, eq(courses.docenteId, users.id))
      .where(eq(enrollments.userId, parseInt(session.user.id)));

    return studentCourses;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return [];
  }
}

export async function getCourseEnrollments(courseId: number) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "teacher" && session.user.role !== "admin")
  ) {
    return [];
  }

  try {
    const enrolledStudents = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        enrolledAt: enrollments.createdAt,
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.userId, users.id))
      .where(eq(enrollments.courseId, courseId))
      .orderBy(desc(enrollments.createdAt));

    return enrolledStudents;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }
}

export async function manualEnrollStudent(courseId: number, email: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "teacher" && session.user.role !== "admin")
  ) {
    return { error: "No autorizado" };
  }

  try {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    if (user.role !== "student") {
      return { error: "El usuario no es un estudiante" };
    }

    // Check existing enrollment
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId))
      );
    if (existingEnrollment.length > 0) {
      return { error: "El estudiante ya está inscrito en este curso" };
    }

    await db.insert(enrollments).values({
      userId: user.id,
      courseId: courseId,
    });


    // revalidatePath("/dashboard/courses"); // Evitar recargar la tabla principal para no cerrar el diálogo
    return { success: "Estudiante inscrito exitosamente" };
  } catch (error) {
    console.error("Error manual enrolling:", error);
    return { error: "Error al inscribir estudiante" };
  }
}

export async function searchStudentsNotEnrolled(
  courseId: number,
  query: string
) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "teacher" && session.user.role !== "admin")
  ) {
    return [];
  }

  try {
    // First get IDs of students already enrolled
    const enrolled = await db
      .select({ userId: enrollments.userId })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    const enrolledIds = enrolled.map((e) => e.userId);

    // Build query
    let conditions = and(
      eq(users.role, "student"),
      ilike(users.email, `%${query}%`)
    );

    if (enrolledIds.length > 0) {
      conditions = and(conditions, notInArray(users.id, enrolledIds));
    }

    const students = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(conditions)
      .limit(10);

    return students;
  } catch (error) {
    console.error("Error searching students:", error);
    return [];
  }
}

export async function getCourseById(courseId: number) {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function removeStudentFromCourse(courseId: number, userId: number) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "teacher" && session.user.role !== "admin")
  ) {
    return { error: "No autorizado" };
  }

  try {
    const deleted = await db
      .delete(enrollments)
      .where(and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.userId, userId)
      ))
      .returning();

    if (deleted.length === 0) {
      return { error: "Inscripción no encontrada" };
    }

    // revalidatePath("/dashboard/courses"); 
    return { success: "Estudiante eliminado del curso correctamente" };
  } catch (error) {
    console.error("Error removing student:", error);
    return { error: "Error al eliminar al estudiante" };
  }
}
