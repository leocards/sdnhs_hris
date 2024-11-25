import { z } from "zod";
import { requiredError } from "../../types";
import { COUNTRIES } from "@/country"

const ADDRESS = z.object({
    houselotblockno: z.string().optional().default(""),
    street: z.string().optional().default(""),
    subdivision: z.string().optional().default(""),
    barangay: z.string().min(1, requiredError('barangay')).default(""),
    citymunicipality: z.string().min(1, requiredError('City/Municipality')).default(""),
    province: z.string().min(1, requiredError('province')).default(""),
    zipcode: z.string().min(1, requiredError('province')).length(4, "The zip code must be 4 characters long.").default(""),
})

const NAME = z.object({
    surname: z.string().min(1, requiredError('surname')).default(""),
    firstname: z.string().min(1, requiredError('first name')).default(""),
    middlename: z.string().optional().default(""),
})

const PERSONALINFORMATIONSCHEMA = NAME.extend({
    piid: z.number().optional().nullable().default(null),
    extensionname: z.string().optional(),
    dateofbirth: z.date({ required_error: requiredError('date of birth') }),
    placeofbirth: z.string().min(1, requiredError('place of birth')).default(""),
    sex: z.enum(['Male', 'Female'], {
        required_error: requiredError('sex'), invalid_type_error: requiredError('sex'), message: requiredError('sex')
    }),
    civilstatus: z.object({
        status: z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Others'], {
            required_error: requiredError('civil status'), invalid_type_error: requiredError('civil status'), message: requiredError('civil status')
        }),
        otherstatus: z.string().optional().default(""),
    }).refine(({ otherstatus, status }) => {
        if (status === 'Others' && otherstatus?.length === 0) {
            return false
        }
        return true
    }, {
        message: 'Please specify civil status.',
        path: ['otherstatus']
    }),
    height: z.string().min(1, requiredError('height')).default(""),
    weight: z.string().min(1, requiredError('weight')).default(""),
    bloodtype: z.string().min(1, requiredError('blood type')),
    gsisid: z.string().optional().default(""),
    pagibigid: z.string().optional().default(""),
    philhealth: z.string().optional().default(""),
    sss: z.string().optional().default(""),
    tin: z.string().optional().default(""),
    agencyemployee: z.string().optional().default(""),
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
    permanentaddress: ADDRESS.extend({
        isSameResidential: z.boolean().optional().default(false)
    }),
    telephone: z.string().optional().default(""),
    mobile: z.string({ invalid_type_error: requiredError('mobile no.'), required_error: requiredError('mobile no.') }).min(1, requiredError('mobile no.')).length(11, "The mobile no. must be 11 characters long"),
    email: z.string().email().optional().nullable().or(z.literal(""))
})

type IFormPI = z.infer<typeof PERSONALINFORMATIONSCHEMA>

const CHILD = z.object({
    childid: z.number().optional().nullable().default(null),
    name: z.string().optional(),
    dateOfBirth: z.date({ invalid_type_error: requiredError('date of birth') }).nullable().optional(),
});

const FAMILYBACKGROUNDSCHEMA = z.object({
    spouse: z.object({
        spouseid: z.number().optional().nullable().default(null),
        surname: z.string().default(""),
        firstname: z.string().default(""),
        middlename: z.string().optional().default(""),
        extensionname: z.string().optional(),
        occupation: z.string().optional().default(""),
        employerbusiness: z.string().optional().default(""),
        businessaddress: z.string().optional().default(""),
        telephone: z.string().optional().default(""),
    }),
    father: NAME.extend({
        fatherid: z.number().optional().nullable().default(null),
        extensionname: z.string().optional()
    }).optional(),
    mother: NAME.extend({
        motherid: z.number().optional().nullable().default(null),
    }).optional(),
    children: z.array(CHILD).optional().default([{ childid: null, name: "", dateOfBirth: null }]),
    deletedChild: z.array(z.number()).optional().default([])
})

type IFormFB = z.infer<typeof FAMILYBACKGROUNDSCHEMA>

const EDUCATION = z.object({
    ebid: z.number().optional().nullable().default(null),
    nameofschool: z.string().optional().default(""),
    basiceddegreecourse: z.string().optional().default(""),
    period: z.object({
        from: z.string().optional().or(z.literal("")).default(""),
        to: z.string().optional().or(z.literal("")).default("")
    }, { required_error: requiredError('period of attendance') }).optional(),
    highestlvl: z.string().optional().default(""),
    yeargraduated: z.string().length(4, "The year graduated field must be YYYY format.").optional().or(z.literal("")).default(""),
    scholarshiphonor: z.string().optional().default("")
}).optional()

type EducationType = z.infer<typeof EDUCATION>

const EDUCATIONALBACKGROUNDSCHEMA = z.object({
    elementary: z.array(EDUCATION).optional(),
    secondary: z.array(EDUCATION).optional(),
    vocational: z.array(EDUCATION).optional(),
    college: z.array(EDUCATION).optional(),
    graduatestudies: z.array(EDUCATION).optional()
})

type IFormEB = z.infer<typeof EDUCATIONALBACKGROUNDSCHEMA>

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export {
    bloodTypes,
    PERSONALINFORMATIONSCHEMA,
    FAMILYBACKGROUNDSCHEMA,
    EDUCATIONALBACKGROUNDSCHEMA,
    type EducationType,
    type IFormPI,
    type IFormFB,
    type IFormEB
}
