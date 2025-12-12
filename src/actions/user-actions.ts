"use server";

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UserFormSchema } from "@/schemas/user";
import bcrypt from "bcrypt";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("No autorizado");
  }
}

export async function getUsers() {
  await checkAdmin();
  try {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
    // Remove password from response
    return allUsers.map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(values: z.infer<typeof UserFormSchema>) {
  await checkAdmin();
  const validatedFields = UserFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { name, email, password, role, isActive } = validatedFields.data;

  if (!password) {
    return { error: "La contraseña es requerida para nuevos usuarios" };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    return { error: "El email ya está en uso" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
      isActive,
    });
    revalidatePath("/dashboard/users");
    return { success: "Usuario creado exitosamente" };
  } catch (error) {
    return { error: "Error al crear usuario" };
  }
}

export async function updateUser(values: z.infer<typeof UserFormSchema>) {
  await checkAdmin();
  const validatedFields = UserFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { id, name, email, password, role, isActive } = validatedFields.data;

  if (!id) return { error: "ID de usuario requerido" };

  try {
    const updateData: any = {
      name,
      email,
      role,
      isActive,
      updatedAt: new Date(),
    };

    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    revalidatePath("/dashboard/users");
    return { success: "Usuario actualizado exitosamente" };
  } catch (error) {
    return { error: "Error al actualizar usuario" };
  }
}

export async function toggleUserStatus(id: number, isActive: boolean) {
  await checkAdmin();
  try {
    await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id));
    revalidatePath("/dashboard/users");
    return { success: "Estado actualizado" };
  } catch (error) {
    return { error: "Error al actualizar estado" };
  }
}

export async function updateProfile(values: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  try {
    const userId = parseInt(session.user.id);

    await db.update(users)
      .set({
        name: values.name,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard/settings");
    return { success: "Perfil actualizado correctamente" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Error al actualizar perfil" };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const userId = parseInt(session.user.id);

  try {
    // 1. Get current user data including password hash
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) return { error: "Usuario no encontrado" };

    // 2. Verify current password
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { error: "La contraseña actual es incorrecta" };
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update
    await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return { success: "Contraseña actualizada exitosamente" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Error al cambiar la contraseña" };
  }
}
