import { z } from "zod"
import { isValidIsraeliId } from "@/lib/id-number"

export const MAX_SIGNATURE_IMAGE_LENGTH = 400_000

export const createAgreementSchema = z.object({
  clientName: z.string().trim().min(2, "יש להזין שם לקוח").max(100),
  clientPhone: z.string().trim().max(30).optional().or(z.literal("")),
  jobDescription: z.string().trim().min(5, "יש לתאר את העבודה").max(500),
  amountIls: z.coerce.number().int("הסכום חייב להיות מספר שלם").min(1, "הסכום חייב להיות גדול מאפס").max(1_000_000),
  vatIncluded: z.boolean().default(true),
  expiresInDays: z.coerce.number().int().min(1).max(90).default(14),
})

export const signAgreementSchema = z.object({
  signerName: z.string().trim().min(2, "יש להזין שם מלא").max(100),
  signerIdNumber: z
    .string()
    .trim()
    .refine(isValidIsraeliId, "מספר תעודת הזהות אינו תקין"),
  consent: z.literal(true, { error: "יש לאשר שקראת והסכמת" }),
  signatureImage: z
    .string()
    .startsWith("data:image/png;base64,", "יש לחתום במסגרת החתימה")
    .max(MAX_SIGNATURE_IMAGE_LENGTH, "החתימה גדולה מדי"),
})

export const loginSchema = z.object({ password: z.string().min(1).max(200) })

export type CreateAgreementInput = z.infer<typeof createAgreementSchema>
export type SignAgreementInput = z.infer<typeof signAgreementSchema>
