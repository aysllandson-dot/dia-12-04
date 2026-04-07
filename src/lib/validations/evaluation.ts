import * as z from "zod";

export const evaluationSchema = z.object({
  employeeId: z.string().min(1, "Funcionário é obrigatório"),
  punctuality: z.number().min(1).max(5),
  punctualityComment: z.string().optional(),
  organization: z.number().min(1).max(5),
  organizationComment: z.string().optional(),
  knowledge: z.number().min(1).max(5),
  knowledgeComment: z.string().optional(),
  proactivity: z.number().min(1).max(5),
  proactivityComment: z.string().optional(),
  commitment: z.number().min(1).max(5),
  commitmentComment: z.string().optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
