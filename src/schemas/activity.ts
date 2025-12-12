import { z } from "zod";

export const TestCaseSchema = z.object({
  input: z.string().min(1, "El input es requerido"),
  expected: z.string().min(1, "El output esperado es requerido"),
});

export const ActivityFormSchema = z
  .object({
    titulo: z.string().min(1, "El título es requerido"),
    descripcion: z.string().optional(),
    tipo: z.enum(["theory", "code"]),
    fechaLimite: z.date().optional(),
    puntuacionTotal: z.coerce
      .number()
      .min(1, "La puntuación debe ser mayor a 0"),

    // Campos específicos para actividades de programación
    lenguaje: z.enum(["javascript", "python", "java", "php"]).optional(),
    tiempoLimite: z.coerce.number().min(100).optional(), // ms
    memoriaLimite: z.coerce.number().min(1024).optional(), // KB
    casosPrueba: z.array(TestCaseSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.tipo === "code") {
        return (
          !!data.lenguaje && !!data.casosPrueba && data.casosPrueba.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Las actividades de programación requieren lenguaje y casos de prueba",
      path: ["tipo"],
    }
  );
