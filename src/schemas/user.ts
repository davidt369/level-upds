import { z } from "zod";

export const UserFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .optional()
    .or(z.literal("")),
  role: z.enum(["student", "teacher", "admin"]),
  isActive: z.boolean(),
});
