import { requiredError } from "@/Pages/types";
import { z } from "zod";

const VOLUNTARYWORK = z.object({
    vw: z.array(
        z.object({
            vwid: z.number().optional().nullable().default(null),
            nameandaddress: z.string().min(1, requiredError('name and address')).default(""),
            inclusivedates: z.object({
                from: z.date({ required_error: requiredError('"from"'), invalid_type_error: requiredError('"from"') }),
                to: z.date({ required_error: requiredError('"to"'), invalid_type_error: requiredError('"to"') })
            }).refine(data => !data.to || data.to > data.from, {
                message: "'To' date must be after the 'from' date",
                path: ["to"]
            }),
            numberofhours: z.string().min(1, requiredError('number of hours')).default(""),
            positionornatureofwork: z.string().min(1, requiredError('position or nature of work')).default("")
        })
    ),
    deletedVW: z.array(z.number()).optional()
})

type IFormVW = z.infer<typeof VOLUNTARYWORK>

const defaultVW = {
    vwid: null,
    nameandaddress: "",
    inclusivedates: {
        from: null, to: null
    },
    numberofhours: "",
    positionornatureofwork: ""
}

const LEARNINGANDDEVELOPMENTSCHEMA = z.object({
    ld: z.array(
        z.object({
            ldid: z.number().optional().nullable().default(null),
            title: z.string().min(1, requiredError('title')).default(""),
            inclusivedates: z.object({
                from: z.date({ required_error: requiredError('"from"'), invalid_type_error: requiredError('"from"') }),
                to: z.date({ required_error: requiredError('"to"'), invalid_type_error: requiredError('"to"') })
            }),
            numberofhours: z.string().min(1, requiredError('number of hours')),
            typeofld: z.string().min(1, requiredError('type of LD')),
            conductedsponsoredby: z.string().min(1, "Required field.")
        })
    ),
    deletedLD: z.array(z.number()).optional()
})

type IFormLD = z.infer<typeof LEARNINGANDDEVELOPMENTSCHEMA>

const defaultLD = {
    ldid: null,
    title: "",
    inclusivedates: {
        from: null, to: null
    },
    numberofhours: "",
    typeofld: "",
    conductedsponsoredby: ""
}

const OTHERINFORMATIONSCHEMA = z.object({
    skills: z.array(
        z.object({
            oiid: z.number().optional().nullable().default(null),
            detail: z.string().min(1).default("")
        })
    ).optional().default([]),
    nonacademicrecognition: z.array(
        z.object({
            oiid: z.number().optional().nullable().default(null),
            detail: z.string().min(1).default("")
        })
    ).optional().default([]),
    membership: z.array(
        z.object({
            oiid: z.number().optional().nullable().default(null),
            detail: z.string().min(1).default("")
        })
    ).optional().default([]),
    deletedOI: z.array(z.number()).optional()
})

type IFormOI = z.infer<typeof OTHERINFORMATIONSCHEMA>

const defaultOI = {
    oiid: null,
    detail: ""
}

export {
    VOLUNTARYWORK,
    type IFormVW,
    defaultVW,
    LEARNINGANDDEVELOPMENTSCHEMA,
    type IFormLD,
    defaultLD,
    OTHERINFORMATIONSCHEMA,
    type IFormOI,
    defaultOI
}
