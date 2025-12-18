import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  email: z.string().email({
    message: "Email inválido",
  }).regex(/^cb\..+@upds\.net\.bo$/, {
    message: "El correo debe tener el formato cb.nombre.apellido.inicial@upds.net.bo",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  role: z.enum(["student", "teacher", "admin"]),
});
