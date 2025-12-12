"use server";

import { db } from "@/db/client";
import { activities, programmingActivities, courses, enrollments, grades } from "@/db/schema";
import { ActivityFormSchema } from "@/schemas/activity";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";
import { checkIsExpired } from "@/lib/utils";

export async function createActivity(
  courseId: number,
  values: z.infer<typeof ActivityFormSchema>
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "teacher") {
    return { error: "No autorizado" };
  }

  // Verify course ownership
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course || course.docenteId !== parseInt(session.user.id)) {
    return { error: "No autorizado o curso no encontrado" };
  }

  if (checkIsExpired(course.fechaFin)) {
    return { error: "El curso ha finalizado, no se pueden crear actividades" };
  }

  const validatedFields = ActivityFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const {
    titulo,
    descripcion,
    tipo,
    fechaLimite,
    puntuacionTotal,
    lenguaje,
    tiempoLimite,
    memoriaLimite,
    casosPrueba,
  } = validatedFields.data;

  try {
    await db.transaction(async (tx) => {
      // 1. Create general activity
      const [newActivity] = await tx
        .insert(activities)
        .values({
          courseId,
          docenteId: parseInt(session.user.id),
          titulo,
          descripcion,
          tipo,
          fechaLimite: fechaLimite || null,
          puntuacionTotal,
        })
        .returning({ id: activities.id });

      // 2. If code type, create programming details
      if (tipo === "code" && lenguaje && casosPrueba) {
        await tx.insert(programmingActivities).values({
          activityId: newActivity.id,
          lenguaje,
          tiempoLimite: tiempoLimite || 1000,
          memoriaLimite: memoriaLimite || 262144,
          casosPrueba: casosPrueba,
        });
      }
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: "Actividad creada exitosamente" };
  } catch (error) {
    console.error("Error creating activity:", error);
    return { error: "Error al crear la actividad" };
  }
}

export async function updateActivity(
  activityId: number,
  values: z.infer<typeof ActivityFormSchema>
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "teacher" && session.user.role !== "admin")) {
    return { error: "No autorizado" };
  }

  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, activityId),
    });

    if (!activity) {
      return { error: "Actividad no encontrada" };
    }

    // Verify course ownership
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, activity.courseId),
    });

    if (!course || (course.docenteId !== parseInt(session.user.id) && session.user.role !== "admin")) {
      return { error: "No autorizado" };
    }

    // Check expiries (Admins can bypass)
    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      if (checkIsExpired(course.fechaFin)) {
        return { error: "El curso ha finalizado, no se puede editar la actividad" };
      }
      if (checkIsExpired(activity.fechaLimite)) {
        return { error: "La actividad ha finalizado, no se puede editar" };
      }
    }

    const validatedFields = ActivityFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Campos inválidos" };
    }

    const {
      titulo,
      descripcion,
      tipo,
      fechaLimite,
      puntuacionTotal,
      lenguaje,
      tiempoLimite,
      memoriaLimite,
      casosPrueba,
    } = validatedFields.data;

    await db.transaction(async (tx) => {
      // Update basic info
      await tx
        .update(activities)
        .set({
          titulo,
          descripcion,
          tipo,
          fechaLimite: fechaLimite || null,
          puntuacionTotal,
          updatedAt: new Date(),
        })
        .where(eq(activities.id, activityId));

      // Update programming details if code type
      if (tipo === "code") {
        // Check if details exist
        const existingDetails = await tx.query.programmingActivities.findFirst({
          where: eq(programmingActivities.activityId, activityId),
        });

        if (existingDetails) {
          await tx
            .update(programmingActivities)
            .set({
              lenguaje: lenguaje || "javascript",
              tiempoLimite: tiempoLimite || 1000,
              memoriaLimite: memoriaLimite || 262144,
              casosPrueba: casosPrueba || [],
            })
            .where(eq(programmingActivities.activityId, activityId));
        } else if (lenguaje && casosPrueba) {
          await tx.insert(programmingActivities).values({
            activityId,
            lenguaje,
            tiempoLimite: tiempoLimite || 1000,
            memoriaLimite: memoriaLimite || 262144,
            casosPrueba,
          });
        }
      }
    });

    revalidatePath(`/dashboard/courses/${activity.courseId}`);
    return { success: "Actividad actualizada exitosamente" };
  } catch (error) {
    console.error("Error updating activity:", error);
    return { error: "Error al actualizar la actividad" };
  }
}

export async function deleteActivity(activityId: number) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "teacher" && session.user.role !== "admin")) {
    return { error: "No autorizado" };
  }

  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, activityId),
    });

    if (!activity) {
      return { error: "Actividad no encontrada" };
    }

    // Verify course ownership
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, activity.courseId),
    });

    if (!course || (course.docenteId !== parseInt(session.user.id) && session.user.role !== "admin")) {
      return { error: "No autorizado" };
    }

    // Check expiries (Admins can bypass)
    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      if (checkIsExpired(course.fechaFin)) {
        return { error: "El curso ha finalizado, no se puede eliminar la actividad" };
      }
      if (checkIsExpired(activity.fechaLimite)) {
        return { error: "La actividad ha finalizado, no se puede eliminar" };
      }
    }

    await db.delete(activities).where(eq(activities.id, activityId));
    // Cascade should handle programming_activities and grades, but explicit is safer if not defined in schema
    // Assuming DB cascade on delete

    revalidatePath(`/dashboard/courses/${activity.courseId}`);
    return { success: "Actividad eliminada exitosamente" };
  } catch (error) {
    console.error("Error deleting activity:", error);
    return { error: "Error al eliminar la actividad" };
  }
}

export async function getCourseActivities(courseId: number) {
  const session = await auth();
  if (!session?.user) return [];

  try {
    const courseActivities = await db.query.activities.findMany({
      where: eq(activities.courseId, courseId),
      with: {
        programmingActivity: true,
      },
      orderBy: [desc(activities.createdAt)],
    });

    return courseActivities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

export async function getActivityDetails(activityId: number) {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, activityId),
      with: {
        programmingActivity: true,
      },
    });

    if (!activity) return null;

    return activity;
  } catch (error) {
    console.error("Error fetching activity details:", error);
    return null;
  }
}

export async function getStudentActivities() {
  const session = await auth();
  if (!session?.user) return [];

  const userId = parseInt(session.user.id);

  try {
    // Fetch activities for courses the student is enrolled in
    // Join with grades to see if completed
    const studentActivities = await db
      .select({
        id: activities.id,
        titulo: activities.titulo,
        tipo: activities.tipo,
        fechaLimite: activities.fechaLimite,
        puntuacionTotal: activities.puntuacionTotal,
        courseId: courses.id,
        courseName: courses.nombre,
        description: activities.descripcion, // Added description for UI
        // Grade info
        gradeScore: grades.score,
        gradeVerdict: grades.verdict,
        submittedAt: grades.createdAt,
      })
      .from(activities)
      .innerJoin(courses, eq(activities.courseId, courses.id))
      .innerJoin(enrollments, and(
        eq(courses.id, enrollments.courseId),
        eq(enrollments.userId, userId)
      ))
      .leftJoin(grades, and(
        eq(activities.id, grades.activityId),
        eq(grades.studentId, userId)
      ))
      .orderBy(desc(activities.createdAt));

    return studentActivities;
  } catch (error) {
    console.error("Error fetching student activities:", error);
    return [];
  }
}
