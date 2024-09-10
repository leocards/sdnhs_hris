import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import ListOfEmployees from "./ListOfEmployees";
import ListOfSALN from "./ListOfSALN";
import ListOfIPCR from "./ListOfIPCR";
import { Head } from "@inertiajs/react";

export type IPCRType = {
    id: number;
    rating: string;
    user_id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
    };
    created_at: string;
};

export type SALNType = {
    id: number;
    joint: boolean;
    networth: string;
    spouse: string;
    user_id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
        pds_personal_information: any;
    };
    created_at: string;
};

export default function Reports({
    auth,
    ipcr,
    saln,
    list,
}: PageProps & {
    ipcr: Array<IPCRType>;
    saln: Array<SALNType>;
    list: {
        jhs: Array<any>;
        shs: Array<any>;
        accounting: Array<any>;
        principal: Array<any>;
    };
}) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">Reports</h2>
            }
        >
            <Head title="Reports" />

            <ListOfEmployees list={list} />

            <ListOfIPCR ipcr={ipcr} />

            <ListOfSALN saln={saln} />
        </Authenticated>
    );
}

export const SeniorHighList = [
    "ALABA, KARL RANIEL",
    "BANSAG, ROCHIL T.",
    "BARLUSCA, JUNRRY",
    "BASTIAN, KRISMIE H.",
    "DULATRE, MERYLL D.",
    "ESTRERA, VANESSA A.",
    "OMBLERO, SARAH JANE R.",
    "QUIBO, JANICE C.",
    "SANGILAN, DEITHER E.",
    "TASIC, ALMA DONNA L.",
];

export const Accounting = [
    "CUBIJANO, YVONY C.",
    "DOSOL, RESEL F.",
    "MALABAD, CHELSEE GWEN",
    "SARDIÑA, CATHERINE GRACE L.",
];

export const SALN = [
    {
        "Last Name": "Abaya",
        "First Name": "Elarde",
        "Middle Name": "E.",
        TIN: "909-594-038",
        Position: "Teacher I",
        "Net Worth": "1,835,148.00",
        "Name of Spouse/Employer/Address":
            "Marife E. Abaya/ DENR-Region XI/Davao City",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Agudo",
        "First Name": "Erwin",
        "Middle Name": "P.",
        TIN: "466744677",
        Position: "Teacher I",
        "Net Worth": "378,724.00",
        "Name of Spouse/Employer/Address":
            "Trinidad B. Agudo/DEPED - Dujali National High School/BE Dujali, DDN",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Alaba",
        "First Name": "Karl Rainer",
        "Middle Name": "M",
        TIN: "430072418",
        Position: "Teacher II",
        "Net Worth": "1,017,990.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Ando",
        "First Name": "Annie Lourde Shyrrel",
        "Middle Name": "S.",
        TIN: "434545370",
        Position: "Teacher II",
        "Net Worth": "682,947.25",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Balaba",
        "First Name": "Marisa",
        "Middle Name": "B.",
        TIN: "350365679",
        Position: "Teacher II",
        "Net Worth": "28,335.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Balagosa",
        "First Name": "Jeremie",
        "Middle Name": "F.",
        TIN: "269869946",
        Position: "Teacher II",
        "Net Worth": "131,247.07",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Bansag",
        "First Name": "Rochil",
        "Middle Name": "T.",
        TIN: "451800554",
        Position: "Teacher II",
        "Net Worth": "264,000.00",
        "Name of Spouse/Employer/Address":
            "Nelson A. Bansag/DepED-ALS Panabo/Panabo City",
        "Joint Filing": "",
    },
    {
        "Last Name": "Barbaton",
        "First Name": "Lucille",
        "Middle Name": "D.",
        TIN: "436706685",
        Position: "Teacher II",
        "Net Worth": "3,828.66",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Barlusca",
        "First Name": "Junrry",
        "Middle Name": "H.",
        TIN: "487999336",
        Position: "Teacher II",
        "Net Worth": "525,256.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Bastian",
        "First Name": "Krismie",
        "Middle Name": "H.",
        TIN: "441070769",
        Position: "Teacher II",
        "Net Worth": "60,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Belgira",
        "First Name": "Rodourd",
        "Middle Name": "A.",
        TIN: "934815406",
        Position: "Teacher II",
        "Net Worth": "30,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Bohol",
        "First Name": "Gecel",
        "Middle Name": "N.",
        TIN: "423650908",
        Position: "Teacher II",
        "Net Worth": "447,598.92",
        "Name of Spouse/Employer/Address":
            "J.J O. Bohol/DepEd-Dalisay Sr. National High School",
        "Joint Filing": "",
    },
    {
        "Last Name": "Buligan",
        "First Name": "Christine Joy",
        "Middle Name": "B.",
        TIN: "454684135",
        Position: "Teacher I",
        "Net Worth": "137,600.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Camacho",
        "First Name": "Lorie Jean",
        "Middle Name": "C.",
        TIN: "326824946",
        Position: "Teacher I",
        "Net Worth": "185,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Canate",
        "First Name": "Johnrey",
        "Middle Name": "G.",
        TIN: "472743603",
        Position: "Teacher III",
        "Net Worth": "439,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Cañizares",
        "First Name": "Jemima",
        "Middle Name": "B.",
        TIN: "454436538",
        Position: "Teacher III",
        "Net Worth": "285,261.05",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
];

export const IPCR = [
    {
        name: "AGUDO, ERWIN P.",
        position: "Teacher II",
        rate: 4.766,
        equivalent: "Outstanding",
    },
    {
        name: "ABAYA, ELARDE H.",
        position: "Teacher I",
        rate: 4.662,
        equivalent: "Outstanding",
    },
    {
        name: "ALABA, KARL RAINIER M.",
        position: "Teacher II",
        rate: 4.665,
        equivalent: "Outstanding",
    },
    {
        name: "ANDO, ANNIE LOURDE SHYRREL S.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "BALABA, MARISA B.",
        position: "Teacher I",
        rate: null,
        equivalent: "Very Satisfactory",
    },
    {
        name: "BALAGOSA, JEREMIE F.",
        position: "Master Teacher I",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "BANSAG, ROCHIL T.",
        position: "Teacher II",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "BARBATON, LUCILLE G.",
        position: "Teacher II",
        rate: 4.63,
        equivalent: "Outstanding",
    },
    {
        name: "BARLUSCA, JUNRRY H.",
        position: "Teacher I",
        rate: 4.408,
        equivalent: "Very Satisfactory",
    },
    {
        name: "BASTIAN, KRISMIE H.",
        position: "Teacher II",
        rate: 4.735,
        equivalent: "Outstanding",
    },
    {
        name: "BELGIRA, RODUARD A.",
        position: "Teacher II",
        rate: 4.859,
        equivalent: "Outstanding",
    },
    {
        name: "BOHOL, GECEL N.",
        position: "Teacher I",
        rate: 4.72,
        equivalent: "Outstanding",
    },
    {
        name: "BULIGAN, CHRISTINE JOY B.",
        position: "Master Teacher I",
        rate: 4.696,
        equivalent: "Outstanding",
    },
    {
        name: "CABRERA, LORIE JEAN",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CANATE, JOHNREY G.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CAÑIZARES, JEMIMA B.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "CASTAÑEROS, SHARMANE",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CUBIJANO, YVONY C.",
        position: "ADAS III",
        rate: null,
        equivalent: "",
    },
    {
        name: "DACALUS, CARMELA MIA P.",
        position: "Teacher III",
        rate: 4.638,
        equivalent: "Outstanding",
    },
    {
        name: "DAQUIO, APPLE JEAN",
        position: "Teacher I",
        rate: 4.525,
        equivalent: "Outstanding",
    },
    {
        name: "DIGAO, YENSEN P.",
        position: "Teacher II",
        rate: 4.529,
        equivalent: "Outstanding",
    },
    {
        name: "DELEGADO, HERMAINE L.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DOSOL, SEDRICK M.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DULATRE, MERYLL D.",
        position: "Teacher II",
        rate: 4.669,
        equivalent: "Outstanding",
    },
    {
        name: "DUMAS, ANA MARIE",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DUMBASE, LOUELA M.",
        position: "Teacher II",
        rate: 4.618,
        equivalent: "Outstanding",
    },
    {
        name: "EMBALSADO, ANGELICA C.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "ESTRERA, VANESSA A.",
        position: "Teacher I",
        rate: 4.4,
        equivalent: "Very Satisfactory",
    },
    {
        name: "GEMENTIZA, DANICA",
        position: "Teacher I",
        rate: 4.035,
        equivalent: "Very Satisfactory",
    },
    {
        name: "JACINTO, DIANNE H.",
        position: "Teacher I",
        rate: 4.696,
        equivalent: "Outstanding",
    },
    {
        name: "JOSOL , SWEETZEL M.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "LABOS, RUBY P.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "LEGARA, JENNIFER T.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "LOPEZ, FLORAMIE D.",
        position: "Master Teacher I",
        rate: 4.77,
        equivalent: "Outstanding",
    },
    {
        name: "MARTIN, BEHNJO S.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "MARTIN, JANIVIC B.",
        position: "Teacher III",
        rate: 4.7,
        equivalent: "Outstanding",
    },
    {
        name: "MORALES, DAVIE ROSE",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "NAVARES, JAYVENT",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "OLMILLO, ANNABELLE S.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "OMBLERO, SARAH JANE R.",
        position: "Teacher III",
        rate: 4.759,
        equivalent: "Outstanding",
    },
    {
        name: "PALMA, MARY JOY C.",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "PAMA, JOANALLE P.",
        position: "Teacher III",
        rate: 4.787,
        equivalent: "Outstanding",
    },
    {
        name: "PASAGUI, MIA KRIS ZHEL M.",
        position: "Teacher I",
        rate: 4.63,
        equivalent: "Outstanding",
    },
    {
        name: "PEÑANO, JERAVEN D.",
        position: "Teacher I",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "PILOTO, ESTELA G.",
        position: "Teacher II",
        rate: 4.626,
        equivalent: "Outstanding",
    },
    {
        name: "QUEMA, ROMMEL B.",
        position: "Teacher II",
        rate: 4.561,
        equivalent: "Outstanding",
    },
    {
        name: "QUIBO, JANICE C.",
        position: "Teacher II",
        rate: 4.693,
        equivalent: "Outstanding",
    },
    {
        name: "RABACA, GIE AR C.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "RELAMPAGOS, JANICE MAY E.",
        position: "Teacher II",
        rate: 4.682,
        equivalent: "Outstanding",
    },
    {
        name: "ROMEO, NOEL M.",
        position: "Teacher III",
        rate: 4.309,
        equivalent: "Very Satisfactory",
    },
    {
        name: "SANGILAN, DIETHER E.",
        position: "Teacher II",
        rate: 4.443,
        equivalent: "Very Satisfactory",
    },
    {
        name: "SINDA, LP SHEENA S.",
        position: "Teacher III",
        rate: 4.79,
        equivalent: "Outstanding",
    },
    {
        name: "SUAN, CRISEL D.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "SUMAGAYSAY, AIRES JANE D.",
        position: "Teacher I",
        rate: 4.752,
        equivalent: "Outstanding",
    },
    {
        name: "TABLATE, FRANPERL L.",
        position: "Teacher II",
        rate: 4.673,
        equivalent: "Outstanding",
    },
    {
        name: "TAGPUNO, ANNE CLARENCE B.",
        position: "Teacher I",
        rate: 4.029,
        equivalent: "Very Satisfactory",
    },
    {
        name: "TASIC, ALMA DONNA L.",
        position: "Teacher II",
        rate: 4.755,
        equivalent: "Outstanding",
    },
    {
        name: "TINASAS, BELEN R.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "TUBAC, APRIL JOEY A.",
        position: "Teacher I",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "TUBOSO, CRISTINE G.",
        position: "Teacher I",
        rate: 4.511,
        equivalent: "Outstanding",
    },
    {
        name: "VERTUDES, REYMUND A.",
        position: "Teacher II",
        rate: 4.501,
        equivalent: "Outstanding",
    },
    {
        name: "YBAÑEZ, JASMIN P.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DOSOL, RESEL F.",
        position: "ADAS II",
        rate: 4.783,
        equivalent: "Outstanding",
    },
    {
        name: "MALABAD, CHELSEE GWEN D.",
        position: "ADAS II",
        rate: 4.583,
        equivalent: "Outstanding",
    },
];
