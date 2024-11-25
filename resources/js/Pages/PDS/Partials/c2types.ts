import { requiredError } from "@/Pages/types";
import { z } from "zod";

const CIVILSERVICEELIGIBILITYSCHEMA = z.object({
    cs: z.array(
        z.object({
            csid: z.number().optional().nullable().default(null),
            eligibility: z.string().min(1, requiredError('career service')).default(""),
            rating: z.string().optional().default(""),
            dateofexaminationconferment: z.date({required_error: requiredError('date of examination'), invalid_type_error: requiredError('date of examination')}),
            placeofexaminationconferment: z.string().min(1, requiredError('place of examination')).default(""),
            license: z.object({
                number: z.string().optional().default(""),
                dateofvalidity: z.date().nullable().default(null),
            })
        })
    ),
    deletedCS: z.array(z.number()).optional()
})

type IFormCS = z.infer<typeof CIVILSERVICEELIGIBILITYSCHEMA>

const defaultCS = {
    csid: null,
    eligibility: "",
    rating: "",
    dateofexaminationconferment: null,
    placeofexaminationconferment: "",
    license: {
        number: "",
        dateofvalidity: null
    },
}
const caseInsensitiveLiteral = (expected: string) =>
    z.string().refine((val) => val.toLowerCase() === expected.toLowerCase(), {
      message: `Input must be "${expected}" (case-insensitive).`,
    });

const WORKEXPERIENCESCHEMA = z.object({
    we: z.array(z.object({
        weid: z.number().optional().nullable().default(null),
        inclusivedates: z.object({
            from: z.date({required_error: requiredError('"from"'), invalid_type_error: requiredError('"from"')}),
            to: z.date({required_error: requiredError('"to"'), invalid_type_error: requiredError('"to"')}).or(caseInsensitiveLiteral('Present'))
        }).refine(data => !data.to || data.to > data.from, {
            message: "'To' date must be after the 'from' date",
            path: ["to"]
        }),
        positiontitle: z.string().min(1, requiredError('position title')).default(""),
        department: z.string().min(1, requiredError('department/agency/office/company')).default(""),
        monthlysalary: z.string().min(1, requiredError('monthly salary')).max(15, "Maximum of 15 characters only.").default(""),
        salarygrade: z.string().min(1, requiredError('salary/job/pay grade')).default(""),
        statusofappointment: z.string().min(1, requiredError('status of appointment')).default(""),
        isgovernment: z.enum(['Y', 'N'], { invalid_type_error: "This field is required" })
    })),
    deletedWE: z.array(z.number()).optional()
})

type IFormWE = z.infer<typeof WORKEXPERIENCESCHEMA>

const defaultWE = {
    weid: null,
    inclusivedates: {
        from: undefined,
        to: undefined
    },
    positiontitle: "",
    department: "",
    monthlysalary: "",
    salarygrade: "",
    statusofappointment: "",
    isgovernment: null
}

export {
    CIVILSERVICEELIGIBILITYSCHEMA,
    type IFormCS,
    defaultCS,
    WORKEXPERIENCESCHEMA,
    type IFormWE,
    defaultWE,
}
