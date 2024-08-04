import { z } from "zod";
import { requiredError } from "../types";
import { PERSONNELPOSITIONS } from "../Personnel/types";
import { differenceInDays, eachDayOfInterval, isWeekend } from "date-fns";

export const LEAVETYPES = [
    "Vacation Leave",
    "Mandatory/Forced Leave",
    "Sick Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Special Privilege Leave",
    "Solo Parent Leave",
    "Study Leave",
    "10-Day VOWC Leave",
    "Rehabilitation Privilege",
    "Special Leave Benefits for Women",
    "Special Emergency (Calamity) Leave",
    "Adoption Leave",
    "Others",
] as const;

export function countWeekdaysInRange(startDate: Date, endDate: Date): {count: number, dates: Array<Date>} {
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekdays = allDays.filter((day: Date) => !isWeekend(day));
    return {
        count: weekdays.length, 
        dates: weekdays
    };
}

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

export const LEAVEFORMSCHEMA = z.object({
    department: z
        .string({ required_error: requiredError("office/department") })
        .min(1, requiredError("office/department"))
        .default(""),
    firstName: z
        .string({ required_error: requiredError("first name") })
        .min(1, requiredError("first name"))
        .default(""),
    middleName: z
        .string({ required_error: requiredError("middle name") })
        .default(""),
    lastName: z
        .string({ required_error: requiredError("last name") })
        .min(1, requiredError("last name"))
        .default(""),
    dateOfFiling: z.date({ required_error: requiredError("date of filing") }),
    position: z.enum(PERSONNELPOSITIONS, { required_error: requiredError("position") }),
    salary: z.string().min(1, requiredError("salary")),
    leavetype: z
        .object({
            type: z.enum(LEAVETYPES, {
                required_error:
                    "Please select the type of leave to be availed of.",
            }),
            others: z.string().optional(),
        })
        // refined, to enable 'others input' field when user select 'others' in leave type
        .refine(
            (data) => {
                if (data.type === "Others") {
                    return data.others && data.others.trim().length > 0;
                }

                return true;
            },
            {
                message: "Please specify the type of leave in 'Others'",
                path: ["others"],
            }
        ),
    detailsOfLeave: z.object({
        vacation_special: z.object({
            withinPhilippines: z.object({
                checked: z.boolean().optional(),
                input: z.string().max(255).optional()
            }).refine(({ checked, input }) => {
                return checked && !input ? false : true
            }, { message: "Please provide details", path: ['input'] }),
            abroad: z.object({
                checked: z.boolean().optional(),
                input: z.string().optional()
            }).refine(({ checked, input }) => {
                return checked && !input ? false : true
            }, { message: "Please provide details", path: ['input'] }),
        }),
        sick: z.object({
            inHospital: z.object({
                checked: z.boolean().optional(),
                input: z.string().optional()
            }).refine(({ checked, input }) => {
                return checked && !input ? false : true
            }, { message: "Please provide details", path: ['input'] }),
            outPatient: z.object({
                checked: z.boolean().optional(),
                input: z.string().optional()
            }).refine(({ checked, input }) => {
                return checked && !input ? false : true
            }, { message: "Please provide details", path: ['input'] }),
        }),
        benefitsForWomen: z.string().optional(),
        study: z.object({
            degree: z.boolean().optional(),
            examReview: z.boolean().optional(),
        }),
        other: z.object({
            monetization: z.boolean().optional(),
            terminal: z.boolean().optional(),
        }),
    }).refine(data => {
        // validate if there is only 1 field in the details of leave
        const checkedFields = [
            data.vacation_special?.withinPhilippines?.checked,
            data.vacation_special?.abroad?.checked,
            data.sick?.inHospital?.checked,
            data.sick?.outPatient?.checked,
            data.benefitsForWomen,
            data.study?.degree,
            data.study?.examReview,
            data.other?.monetization,
            data.other?.terminal
        ].filter(Boolean);

        return checkedFields.length === 0 ? false : (checkedFields.length <= 1);
    }, {
        message: 'Please specify only 1 details of leave.'
    }),
    inclusiveDates: z
        .object({
            from: z.date(),
            to: z.date().optional(),
            dates: z.date().array().optional().default([]),
        }, {
            required_error: requiredError("inclusive dates")
        })
        .refine(
            (dates) => {
                // return error if the given dates are past of current dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dates.from.setHours(0, 0, 0, 0);

                return dates.from > today;
            },
            {
                message: "Inclusive dates cannot be present or past dates.",
            }
        )
        .refine(
            (dates) => {
                // validates if the date to of inclusive date is the same or not
                if (dates.to) {
                    dates.from.setHours(0, 0, 0, 0);
                    dates.to.setHours(0, 0, 0, 0);

                    return !(dates.to.getTime() === dates.from.getTime());
                }
                return true;
            },
            {
                message: "Inclusive dates must not the same.",
            }
        ),
    numDaysApplied: z.string().min(1, "Set the number of days applied for."),
    commutation: z.object({
        notRequested: z.boolean().optional(),
        requested: z.boolean().optional()
    }).refine(data => {
        const checkedFields = [
            data.notRequested,
            data.requested,
        ].filter(Boolean);

        return checkedFields.length === 0 ? false : (checkedFields.length <= 1);
    }, {
        message: 'Please select only 1 commutation.'
    }),
    certificationLeaveCredits: z.object({
        asOf: z.string().min(1, requiredError('\'as of\'')).default(''),
        totalEarned: z.object({
            vacationLeave: z.string().min(1, 'required').default(''),
            sickLeave: z.string().min(1, 'required').default('')
        }),
        lessThisApplication: z.object({
            vacationLeave: z.string().min(1, 'required').default(''),
            sickLeave: z.string().min(1, 'required').default('')
        }),
        balance: z.object({
            vacationLeave: z.string().min(1, 'required').default(''),
            sickLeave: z.string().min(1, 'required').default('')
        })
    }),
    recommendation: z.object({
        forApproval: z.boolean().optional().default(false),
        forDisapproval: z.object({
            checked: z.boolean().optional().default(false),
            input: z.string().optional()
        }).refine(({ checked }) => {
            return checked ? false : true
        }, { message: "Please provide details", path: ['input'] })
    }).refine(data => {
        const checkedFields = [
            data.forApproval,
            data.forDisapproval?.checked,
        ].filter(Boolean);

        return checkedFields.length === 0 ? false : (checkedFields.length <= 1);
    }, {
        message: 'Please select only 1 recommendation.'
    }),
    approvedFor: z.object({
        daysWithPay: z.string().optional().default(''),
        daysWithOutPay: z.string().optional().default(''),
        others: z.string().optional().default('')
    }).refine(data => {
        const checkedFields = [
            !!data.daysWithPay,
            !!data.daysWithOutPay,
            !!data.others
        ].filter(Boolean);

        return checkedFields.length === 0 ? false : (checkedFields.length <= 1);
    }, {
        message: 'Please specify only 1 approved for.'
    }),
    disapprovedDueTo: z.string().optional(),
    medicalForMaternity: z
    .instanceof(File, { message: "Please choose a file." })
    .optional()
    .refine((file) => {
        if(file?.type) {
            if(!allowedMimeTypes.includes(file?.type)) {
                return false
            } else return true
        }
    }, {
        message: "Only JPEG, JPG, and PNG files are allowed.",
    })
    .refine((file) => {
        if(file?.size) {
            if(file?.size > 10 * 1024 * 1024) {
                return false
            } else return true
        }
    }, {
        message: "File size should not exceed 10MB",
    })
}).refine(({ leavetype, medicalForMaternity }) => {
    if(leavetype.type === "Maternity Leave") {
        if(!medicalForMaternity)
            return false
    }
    return true
}, {
    message: "Please upload medical.",
    path: ['medicalForMaternity']
})

export const initialValues = {
    department: "",
    firstName: "",
    middleName: "",
    lastName: "",
    salary: "",
    leavetype: { others: '' },
    detailsOfLeave: {
        vacation_special: {
            withinPhilippines: { input: '' },
            abroad: { input: '' },
        },
        sick: {
            inHospital: { input: '' },
            outPatient: { input: '' },
        },
        benefitsForWomen: '',
    },
    numDaysApplied: '',
    certificationLeaveCredits: {
        asOf: '',
        totalEarned: {
            vacationLeave: '',
            sickLeave: ''
        },
        lessThisApplication: {
            vacationLeave: '',
            sickLeave: ''
        },
        balance: {
            vacationLeave: '',
            sickLeave: ''
        },
    },
    recommendation: { forDisapproval: { input: '' } },
    approvedFor: {
        daysWithPay: '',
        daysWithOutPay: '',
        others: ''
    },
    disapprovedDueTo: ''
}