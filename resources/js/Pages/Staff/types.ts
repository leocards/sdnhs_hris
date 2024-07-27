import { z } from "zod";
import { requiredError } from "../types";
import { User } from "@/types"

export const STAFFPOSITIONS = [
    "Teacher I",
    "Teacher II",
    "Teacher III",
    "Teacher IV",
    "Master Teacher I",
    "Master Teacher II",
    "Master Teacher III",
    "ADAS I",
    "ADAS II",
    "ADAS III",
    "Principal I",
    "Principal II",
    "Principal III",
] as const;

export const ROLE = ["HOD", "Teaching", "Non-teaching"] as const;

export const NEWSTAFFSCHEMA = z.object({
    firstName: z.string().min(1, requiredError("first name")).default(""),
    middleName: z.string().optional().default(""),
    lastName: z.string().min(1, requiredError("last name")).default(""),
    birthDate: z.date({ required_error: requiredError("birth date") }).nullable().default(null),
    sex: z.enum(["Male", "Female"], { required_error: requiredError("sex") }),
    email: z.string().min(1, requiredError("email")).email().default(""),
    address: z.string().min(1, requiredError("address")).default(""),
    phoneNumber: z
        .string()
        .startsWith("09", "Must starts with 09")
        .length(11, "Must be 11 characters long")
        .default(""),
    position: z.enum(STAFFPOSITIONS, { required_error: requiredError("position") }),
    staffId: z.string().min(1, requiredError("staff Id")).default(""),
    department: z.string().min(1, requiredError("department")).default(""),
    userRole: z.enum(ROLE, { required_error: requiredError("user role") }),
    dateHired: z.date({ required_error: requiredError("date hired") }).nullable().default(null),
    currentCredits: z.preprocess((value) => parseInt(value as string), z.number({required_error: requiredError('current credits'), invalid_type_error: requiredError('current credits')})).default(""),
    password: z
        .string()
        .min(8, "Password must have atleast 8 characters.")
        .default("12345678"),
});

export type StaffListProps = {
    user: User
    onClick?: (action: string, id: any) => void
}