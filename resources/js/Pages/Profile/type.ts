import { z } from "zod";
import { requiredError } from "../types";
import { COUNTRIES } from "@/country"

/** 
 * C1 objects
 */
const ADDRESS = z.object({
    houselotblockno: z.string().optional().default(""),
    street: z.string().optional().default(""),
    subdivision: z.string().optional().default(""),
    barangay: z.string().min(1, requiredError('barangay')),
    citymunicipality: z.string().min(1, requiredError('City/Municipality')),
    province: z.string().min(1, requiredError('province')),
    zipcode: z.string().min(1, requiredError('province')).length(5, "The zip code must be 5 characters long."),
})

const NAME = z.object({
    surname: z.string().min(1, requiredError('surname')).default(""),
    firstname: z.string().min(1, requiredError('first name')).default(""),
    middlename: z.string().optional().default(""),
})

const PERSONALINFORMATIONSCHEMA = NAME.extend({
    extensionname: z.string().optional(),
    dateofbirth: z.date({ required_error: requiredError('date of birth') }),
    placeofbirth: z.string().min(1, requiredError('place of birth')),
    sex: z.enum(['Male', 'Female'], {
        required_error: requiredError('sex'), invalid_type_error: requiredError('civil status'), message: requiredError('civil status')
    }),
    civilstatus: z.object({
        status: z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Others'], {
            required_error: requiredError('civil status'), invalid_type_error: requiredError('civil status'), message: requiredError('civil status')
        }),
        otherstatus: z.string().optional().default(""),
    })
        .refine(({ otherstatus, status }) => {
            if (status === 'Others' && otherstatus?.length === 0) {
                return false
            }
            return true
        }, {
            message: 'Please specify civil status.',
            path: ['otherstatus']
        }),
    height: z.string().min(1, requiredError('height')),
    weight: z.string().min(1, requiredError('weight')),
    bloodtype: z.string().min(1, requiredError('blood type')),
    gsisid: z.string().min(1, requiredError('GSIS ID no.')),
    pagibigid: z.string().min(1, requiredError('pag-ibig ID no.')),
    philhealth: z.string().min(1, requiredError('philhealth no.')),
    sss: z.string().min(1, requiredError('SSS no.')),
    tin: z.string().min(1, requiredError('TIN no.')),
    agencyemployee: z.string().min(1, requiredError('agency employee no.')),
    citizenship: z.object({
        citizen: z.enum(['Filipino', 'Dual Citizenship'], { required_error: "Please select citizenship" }),
        dualby: z.enum(['by birth', 'by naturalization']).optional().nullable().default(null),
        dualcitizencountry: z.enum([...COUNTRIES]).nullable().optional().default(null)
    }).refine(({ citizen, dualcitizencountry }) => {
        if (citizen === "Dual Citizenship" && !dualcitizencountry)
            return false

        return true
    }, { message: "Plase indicate country", path: ['dualcitizencountry'] }).refine(({ citizen, dualby }) => {
        if (citizen === "Dual Citizenship" && !dualby)
            return false

        return true
    }, { message: "Required field.", path: ['dualby'] }),
    residentialaddress: ADDRESS,
    permanentaddress: ADDRESS,
    telephone: z.string().optional().default(""),
    mobile: z.string().min(1, requiredError('mobile no.')).length(11, "The mobile no. must be 5 characters long"),
    email: z.string().email().optional().default("")
})

const CHILD = z.object({
    name: z.string().min(1, requiredError('child name')),
    dateOfBirth: z.date({ required_error: requiredError('date of birth') }).nullable(),
});

const FAMILYBACKGROUNDSCHEMA = z.object({
    spouse: NAME.extend({
        extenstion: z.string().min(1, requiredError('extension name')),
        occupation: z.string().optional().default(""),
        employerbusiness: z.string().optional().default(""),
        businessaddress: z.string().optional().default(""),
        telephone: z.string().optional().default(""),
    }).optional(),
    father: NAME.extend({
        extenstion: z.string().min(1, requiredError('extension name'))
    }).optional(),
    mother: NAME.optional(),
    children: z.array(CHILD).optional().default([{ name: "", dateOfBirth: null }])
})

const EDUCATION = z.object({
    nameofschool: z.string().min(1, requiredError('name of school')).default(""),
    basiceddegreecourse: z.string().min(1, requiredError('basic education/degree/course')).optional().default(""),
    period: z.object({
        from: z.string().min(1, requiredError('from')).length(4, "YYYY format").default(""),
        to: z.string().min(1, requiredError('to')).length(4, "YYYY format").default("")
    }, { required_error: requiredError('period of attendance') }),
    highestlvl: z.string().optional(),
    yeargraduated: z.string().min(1, requiredError('year graduated')).length(4, "The year graduated field must be YYYY format.").default(""),
    scholarshiphonor: z.string().optional()
})

const EDUCATIONALBACKGROUNDSCHEMA = z.object({
    elementary: EDUCATION,
    secondary: EDUCATION,
    vocational: EDUCATION.deepPartial(),
    college: EDUCATION.deepPartial(),
    graduatestudies: EDUCATION.deepPartial()
})

const C1SCHEMA = z.object({
    personalinformation: PERSONALINFORMATIONSCHEMA,
    familybackground: FAMILYBACKGROUNDSCHEMA,
    educationalbackground: EDUCATIONALBACKGROUNDSCHEMA
})

/** 
 * C2 objects
 */
const CIVILSERVICEELIGIBILITY = z.object({
    eligibility: z.string().default(""),
    rating: z.string().optional().default(""),
    dateofexaminationconferment: z.date().nullable().default(null),
    placeofexaminationconferment: z.string().default(""),
    license: z.object({
        number: z.string().default(""),
        dateofvalidity: z.date().nullable().default(null),
    })
}).deepPartial()

const WORKEXPERIENCE = z.object({
    inclusivedates: z.object({
        from: z.date().nullable().default(null),
        to: z.date().nullable().default(null)
    }),
    positiontitle: z.string().default(""),
    department: z.string().default(""),
    monthlysalary: z.string().default(""),
    salarygrade: z.string().default(""),
    statusofappointment: z.string().default(""),
    isgovernment: z.enum(['Y', 'N'])
        .optional().nullable().default(null)
}).deepPartial()

const C2SCHEMA = z.object({
    civilserviceeligibility: z.array(CIVILSERVICEELIGIBILITY),
    workexperience: z.array(WORKEXPERIENCE).optional()
})

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
    c1: C1SCHEMA, c2: C2SCHEMA, c3: C3SCHEMA, c4: C4SCHEMA
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