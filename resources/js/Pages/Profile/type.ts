import { z } from "zod";
import { requiredError } from "../types";
import { COUNTRIES } from "@/country"

/**
 * C3 objects
 */
const VOLUNTARYWORK = z.object({
    nameandaddress: z.string().optional().default(""),
    inclusivedates: z.object({
        from: z.date().nullable().default(null),
        to: z.date().nullable().default(null)
    }),
    numberofhours: z.string().optional().default(""),
    positionornatureofwork: z.string().optional().default("")
}).deepPartial()

const LEARNINGANDDEVELOPMENTSCHEMA = z.object({
    title: z.string(),
    inclusivedates: z.object({
        from: z.date().nullable().default(null),
        to: z.date().nullable().default(null)
    }),
    numberofhours: z.string(),
    typeofld: z.string(),
    conductedsponsoredby: z.string()
}).deepPartial()

const OTHERINFORMATION = z.object({
    skills: z.array(z.object({skill: z.string().default("")})).default([{skill: ""}]),
    nonacademicrecognition: z.array(z.object({recognition: z.string().default("")})).default([{recognition: ""}]),
    membership: z.array(z.object({member: z.string().default("")})).default([{member: ""}])
}).deepPartial()

const C3SCHEMA = z.object({
    voluntarywork: z.array(VOLUNTARYWORK),
    landd: z.array(LEARNINGANDDEVELOPMENTSCHEMA),
    otherinformation: OTHERINFORMATION
})

/**
 * C4 objects
 */

const CHOICES = z.object({
    choices: z.enum(['Yes', 'No'], {required_error: requiredError('Please select Yes or No.')}),
    details: z.string().optional()
}).refine(({ choices }) => {
    if(choices === "Yes")
        return false

    return true
}, { message: "Please provide details.", path: ['details']})

const C4SCHEMA = z.object({
    q34: z.object({
        choicea: z.enum(['Yes', 'No'], {required_error: requiredError('Please select Yes or No.')}),
        choiceb: CHOICES
    }),
    q35: z.object({
        choicea: CHOICES,
        choiceb: z.object({
            choices: z.enum(['Yes', 'No'], {required_error: requiredError('Please select Yes or No.')}),
            datefiled: z.date().optional(),
            statusofcase: z.string().optional()
        }).refine(({ choices }) => choices === "No", { message: "Please provide details.", path: ['datefiled', 'statusofcase'] })
    }),
    q36: CHOICES,
    q37: CHOICES,
    q38: z.object({
        choicea: CHOICES,
        choiceb: CHOICES,
    }),
    q39: CHOICES,
    q40: z.object({
        choicea: CHOICES,
        choiceb: CHOICES,
        choicec: CHOICES,
    }),
    q41: z.array(z.object({
        name: z.string(), address: z.string(), telno: z.string()
    }).deepPartial()).optional(),
    governmentids: z.object({
        governmentissuedid: z.string().min(1, requiredError("government issued ID")),
        licensepasswordid: z.string().min(1, requiredError("id/license/passwort no.")),
        issued: z.string().min(1, requiredError("date/place of issuance"))
    })
})

const PERSONALDATASHEETSCHEMA = z.object({
    c3: C3SCHEMA, c4: C4SCHEMA
})

type IFormPersonalDataSheet = z.infer<typeof PERSONALDATASHEETSCHEMA>

export const C2CivilService = {
    eligibility: "",
    rating: "",
    dateofexaminationconferment: null,
    placeofexaminationconferment: "",
    license: {
        number: "",
        dateofvalidity: null
    }
}

export const C2workExperienceDefault = {
    inclusivedates: {
        from: null,
        to: null
    },
    positiontitle: "",
    department: "",
    monthlysalary: "",
    salarygrade: "",
    statusofappointment: "",
    isgovernment: null
}

export const C3VoluntaryWork = {
    nameandaddress: "",
    inclusivedates: {
        from: null,
        to: null
    },
    numberofhours: "",
    positionornatureofwork: ""
}

export const C3LAndD = {
    title: "",
    inclusivedates: {
        from: null, to: null
    },
    numberofhours: "",
    typeofld: "",
    conductedsponsoredby: ""
}

export const C4Q41 = {
    name: "", address: "", telno: ""
}

const initialValuePersonalDataSheet = {
    c1: {
        personalinformation: {
            surname: "", firstname: "", middlename: "", extensionname: "", placeofbirth: "", civilstatus: {
                otherstatus: ''
            }, citizenship: { dualby: null }
        },
        familybackground: {
            children: [{ name: "", dateOfBirth: null }]
        }
    },
    c2: {
        civilserviceeligibility: [{ ...C2CivilService }],
        workexperience: [{ ...C2workExperienceDefault }]
    },
    c3: {
        voluntarywork: [{...C3VoluntaryWork}],
        landd: [{...C3LAndD}],
        otherinformation: {
            skills: [{skill: ""}],
            nonacademicrecognition: [{recognition: ""}],
            membership: [{member: ""}]
        }
    },
    c4: {
        q41: [{...C4Q41}]
    }
}

export const c1 = {
    personalinformation: "c1.personalinformation.",
    familybackground: "c1.familybackground.",
    educationalbackground: "c1.educationalbackground."
}
export const c2 = {
    civilserviceeligibility: "c2.civilserviceeligibility.",
    workexperience: "c2.workexperience."
}
export const c3 = {
    voluntarywork: "c3.voluntarywork.",
    landd: "c3.landd.",
    otherinformation: "c3.otherinformation."
}

export {
    type IFormPersonalDataSheet,
    PERSONALDATASHEETSCHEMA,

    initialValuePersonalDataSheet
}
