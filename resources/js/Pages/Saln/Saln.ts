import { z } from "zod";
import { requiredError } from "../types";

const SALNSCHEMA = z.object({
    spouse: z.object({
        spouseid: z.number().optional().nullable().default(null),
        familyname: z.string(),
        firstname: z.string(),
        middleinitial: z.string(),
        position: z.string(),
        office: z.string(),
        officeaddress: z.string(),
        governmentissuedid: z.string(),
        idno: z.string(),
        dateissued: z.date().nullable().default(null)
    }).partial(),
    children: z.array(
        z.object({
            childid: z.number().optional().nullable().default(null),
            name: z.string(),
            dateofbirth: z.date().nullable(),
        }).partial()
    ).optional().default([{name: "", dateofbirth: null}]),
    assets: z.object({
        real: z.array(
            z.object({
                realid: z.number().optional().nullable().default(null),
                description: z.string(),
                kind: z.string(),
                exactlocation: z.string(),
                assessedvalue: z.string(),
                currentfairmarketvalue: z.string(),
                acquisition: z.object({
                    year:  z.string(),
                    mode:  z.string(),
                }).partial(),
                acquisitioncost: z.string()
            }).partial()
        ).optional(),
        personal: z.array(
            z.object({
                personalid: z.number().optional().nullable().default(null),
                description: z.string(),
                yearacquired: z.string(),
                acquisitioncost: z.string(),
            })
        )
    }),
    liabilities: z.array(
        z.object({
            liabilityid: z.number().optional().nullable().default(null),
            nature: z.string(),
            nameofcreditors: z.string(),
            outstandingbalances: z.string(),
        }).partial()
    ),
    biandfc: z.object({
        biandfcid: z.number().optional().nullable().default(null),
        nobiandfc: z.boolean().optional(),
        bifc: z.array(
            z.object({
                bifcid: z.number().optional().nullable().default(null),
                name: z.string(),
                address: z.string(),
                nature: z.string(),
                date: z.date().or(z.string()).nullable(),
            }).partial()
        ).optional()
    }),
    relativesingovernment: z.object({
        relativesingovernmentid: z.number().optional().nullable().default(null),
        norelative: z.boolean(),
        relatives: z.array(
            z.object({
                relativeid: z.number().optional().nullable().default(null),
                name: z.string(),
                relationship: z.string(),
                position: z.string(),
                agencyandaddress: z.string()
            })
        ).optional()
    }),
    asof: z.date({ required_error: requiredError('as of') }),
    date: z.date({ required_error: requiredError('date') }).default(new Date()),
    isjoint: z.enum(['joint', 'separate', 'none']),
}).superRefine(({ biandfc, relativesingovernment }, ctx) => {
    if(!biandfc.nobiandfc) {
        if(biandfc.bifc?.length??0 > 0) {
            biandfc.bifc?.forEach((bifc, index) => {
                if(!bifc.name) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "name"],
                        message: "This field is required"
                    });
                }
                if(!bifc.address) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "address"],
                        message: "This field is required"
                    });
                }
                if(!bifc.nature) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "nature"],
                        message: "This field is required"
                    });
                }
                if(!bifc.date) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "date"],
                        message: "This field is required"
                    });
                }
            })
        }
    }

    if(!relativesingovernment.norelative) {
        if(relativesingovernment.relatives?.length??0 > 0) {
            relativesingovernment.relatives?.forEach((relative, index) => {
                if(!relative.name) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "name"],
                        message: "This field is required"
                    });
                }
                if(!relative.relationship) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "relationship"],
                        message: "This field is required"
                    });
                }
                if(!relative.position) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "position"],
                        message: "This field is required"
                    });
                }
                if(!relative.agencyandaddress) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "agencyandaddress"],
                        message: "This field is required"
                    });
                }
            })
        }
    }
})

type IFORMSALN = z.infer<typeof SALNSCHEMA>

export {
    type IFORMSALN,
    SALNSCHEMA
}
