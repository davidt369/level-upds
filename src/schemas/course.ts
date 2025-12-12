import { z } from "zod";

export const CourseFormSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(1, { message: "El nombre del curso es requerido" }),
  descripcion: z.string().optional(),
  fechaInicio: z.date(),
  fechaFin: z.date(),
  estado: z.enum(["activo", "inactivo", "archivado"]),
});
