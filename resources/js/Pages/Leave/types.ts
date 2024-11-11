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
    dateOfFiling: z.object({
        from: z.date({ required_error: requiredError("date of filing") }),
        to: z.date().optional().nullable(),
    }).refine(
        (dates) => {
            // return error if the given dates are past of current dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dates.from.setHours(0, 0, 0, 0);

            return dates.from > today;
        },
        {
            message: "Date of filing cannot be present or past dates.",
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
            message: "Date of filing must not be the same.",
        }
    ).refine(data => !data.to || data.to > data.from, {
        message: "'To' date must be after the 'from' date",
        path: ["to"]
    }),
    position: z.enum(PERSONNELPOSITIONS, { required_error: requiredError("position") }),
    salary: z.string().min(1, requiredError("salary")),
    leavetype: z
        .object({
            type: z.preprocess(
                (val) => (val === "" ? undefined : val),
                z.enum(LEAVETYPES, {
                  required_error: "Please select the type of leave.",
                  invalid_type_error: "Please select the type of leave.",
                })
              ),
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
        message: 'Please fill out the details of leave.'
    }),
    inclusiveDates: z
        .object({
            from: z.date(),
            to: z.date().optional(),
            dates: z.date().array().optional().default([]),
        }, {
            required_error: requiredError("inclusive dates")
        })
        .refine(data => data.from > new Date(), {
            message: "The 'from' date cannot be today or a past date",
            path: ["from"]
        })
        .refine(data => !data.to || data.from.getTime() !== data.to.getTime(), {
            message: "'From' and 'to' dates should not be the same",
            path: ["to"]
        })
        .refine(data => !data.to || data.to > data.from, {
            message: "'To' date must be after the 'from' date",
            path: ["to"]
        }),
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
    medicalForMaternity: z
        .instanceof(File, { message: "Please choose a file." })
        .optional()
}).refine(({ leavetype, medicalForMaternity }) => {
    if(leavetype.type === "Maternity Leave") {
        console.log(medicalForMaternity)
        if(!medicalForMaternity)
            return false
    }
    return true
}, {
    message: "Please upload medical.",
    path: ['medicalForMaternity']
})
.refine(({leavetype, medicalForMaternity}) => {
    if(leavetype.type === "Maternity Leave")
        if(medicalForMaternity?.type) {
            if(!allowedMimeTypes.includes(medicalForMaternity?.type)) {
                return false
            }
        }

    return true
}, {
    message: "Only JPEG, JPG, and PNG files are allowed.",
    path: ['medicalForMaternity']
})
.refine(({leavetype, medicalForMaternity}) => {
    if(leavetype.type === "Maternity Leave")
        if(medicalForMaternity?.size) {
            if(medicalForMaternity?.size > 10 * 1024 * 1024) {
                return false
            } else return true
        }

    return true
}, {
    message: "File size should not exceed 10MB",
    path: ['medicalForMaternity']
})

export const defaultDetailsOfLeave = {
    vacation_special: {
        withinPhilippines: { input: '', checked: false },
        abroad: { input: '', checked: false },
    },
    sick: {
        inHospital: { input: '', checked: false },
        outPatient: { input: '', checked: false },
    },
    benefitsForWomen: '',
    study: {
        degree: false,
        examReview: false
    },
    other: {
        monetization: false,
        terminal: false
    }
}

export const initialValues = {
    department: "",
    firstName: "",
    middleName: "",
    lastName: "",
    salary: "",
    leavetype: { others: '' },
    detailsOfLeave: defaultDetailsOfLeave,
    numDaysApplied: '',
}
