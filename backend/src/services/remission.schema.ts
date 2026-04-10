import { z } from 'zod';

const itemSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  brand: z.string().min(1, 'La marca es obligatoria'),
  model: z.string().min(1, 'El modelo es obligatorio'),
  serial: z.string().min(1, 'El nro. de serie es obligatorio'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  condition: z.enum(['nuevo', 'usado', 'reparado', 'dañado']),
  observation: z.string().optional(),
  cost: z.number().optional(),
  requiresResponsibilityTerm: z.boolean().optional().default(false),
});

export const remissionSchema = z.object({
  date: z.string().pipe(z.coerce.date()).optional(),
  sender: z.object({
    name: z.string().default('TOCSA S.A. - Dpto. Informática'),
    ruc: z.string().default('80019114-5'),
    address: z.string().default('América esq. Chacoré, Luque - Paraguay'),
  }).optional(),
  recipient: z.object({
    name: z.string().min(1, 'El nombre del destinatario es obligatorio'),
    idNumber: z.string().min(1, 'El CI/RUC del destinatario es obligatorio'),
    positionArea: z.string().min(1, 'El cargo/área es obligatorio'),
    location: z.string().min(1, 'La ubicación es obligatoria'),
  }),
  items: z.array(itemSchema).min(1, 'Debe incluir al menos un artículo'),
  transferReason: z.enum(['traslado interno', 'reparación', 'transformación', 'exhibición', 'otros']),
  observations: z.string().optional(),
  authorizedBy: z.string().min(1, 'El nombre de quien autoriza es obligatorio'),
  receivedBy: z.string().min(1, 'El nombre de quien recibe es obligatorio'),
});

export type RemissionInput = z.infer<typeof remissionSchema>;
