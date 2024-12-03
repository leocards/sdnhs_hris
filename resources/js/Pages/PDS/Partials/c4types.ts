import { z } from "zod";
import { requiredError } from "../../types";

const CHOICES = z.object({
    c4id: z.number().optional().nullable().default(null),
    choices: z.enum(['Yes', 'No'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
        .nullable(),
    details: z.string().optional()
}).refine(({ choices, details }) => {
    if (choices === "Yes" && details === "")
        return false

    return true
}, { message: "Please provide details.", path: ['details'] })

const C4SCHEMA = z.object({
    q34: z.object({
        choicea: z.object({
            c4id: z.number().optional().nullable().default(null),
            choices: z.enum(['Yes', 'No'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
            .nullable()
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        })
    }).superRefine((data, ctx) => {
        if (data.choicea === null) {
            ctx.addIssue({
                code: "custom",
                path: ['choicea'],
                message: 'Please select Yes or No.'
            });
        }
    }),
    q35: z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: z.object({
            c4id: z.number().optional().nullable().default(null),
            choices: z.enum(['Yes', 'No'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
                .nullable(),
            datefiled: z.date({required_error: requiredError('date filed'), invalid_type_error: requiredError('date filed')}).nullable().optional(),
            statusofcase: z.string().optional().default("")
        }).superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }

            if (data.choices === "Yes" && !data.statusofcase) {
                ctx.addIssue({
                    code: "custom",
                    path: ['statusofcase'],
                    message: requiredError('status of case')
                });
            }

            if (data.choices === "Yes" && !data.datefiled) {
                ctx.addIssue({
                    code: "custom",
                    path: ['datefiled'],
                    message: requiredError('date filed')
                });
            }
        })
    }),
    q36: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    q37: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    q38: z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    }),
    q39: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    q40: z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choicec: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    }),
    q41: z.array(
        z.object({
            c4id: z.number().optional().nullable().default(null),
            name: z.string().min(1, requiredError('name')),
            address: z.string().min(1, requiredError('address')),
            telno: z.string().min(1, requiredError('tel. no.'))
        })
    ).optional(),
    governmentids: z.object({
        c4id: z.number().optional().nullable().default(null),
        governmentissuedid: z.string().min(1, requiredError("government issued ID")),
        licensepasswordid: z.string().min(7, "Must have atleaset 7 digits.").min(1, requiredError("id/license/passport no.")),
        issued: z.string().min(1, requiredError("date/place of issuance"))
    })
})

type IFormC4 = z.infer<typeof C4SCHEMA>

const referenceDefault = [
    {
        c4id: null,
        name: "",
        address: "",
        telno: ""
    },
    {
        c4id: null,
        name: "",
        address: "",
        telno: ""
    },
    {
        c4id: null,
        name: "",
        address: "",
        telno: ""
    }
]

export {
    C4SCHEMA,
    type IFormC4,
    referenceDefault
}
