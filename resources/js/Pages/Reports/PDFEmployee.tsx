import { forwardRef, useMemo } from "react";
import Deped from "@/assets/DepEd.png";
import SDNHSLogo from "@/assets/sdnhs-logo.png";
import { FilteredListType, ListType } from "./ListOfEmployees";

type Props = {
    summary: ListType;
    sy: string;
};

const PDFEmployee = forwardRef<HTMLDivElement, Props>(({ summary, sy }, ref) => {
    const filteredList: FilteredListType = useMemo(() => {
        const categories = ["jhs", "shs", "accounting", "principal"] as const;
        const result: FilteredListType = {
            male: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
            female: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
        };

        categories.forEach((category) => {
            result.male[category] = summary[category].filter(
                (item: any) => item.sex === "Male"
            ).length;
            result.female[category] = summary[category].filter(
                (item: any) => item.sex === "Female"
            ).length;
        });

        return result;
    }, [summary]);

    const empListCategory = {
        jhs: "Junior High School",
        shs: "Senior High School",
        accounting: "Accounting",
        principal: "Principal",
    };

    return (
        <div ref={ref} className="w-[8.3in] shrink-0 print:scale-90">
            <div className="flex font-arial [&>div]:grow w-full print:">
                <div>
                    <img src={Deped} className="w-20 shrink-0 ml-auto" />
                </div>
                <div className="space-y-px text-center max-w-96">
                    <div className="leading-5">
                        Republika ng Pilipinas <br />
                        Kagawaran ng Edukasyon <br />
                        Rehiyon XI <br />
                        Sangay ng Lungsod ng Panabo <br />
                        Lungsod ng Panabo
                    </div>
                    <div className="font-bold leading-5 pt-4">
                        SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                    </div>
                    <div className="leading-5">Southern Davao, Panabo City</div>
                    <div className="leading-5">SY {sy}</div>
                </div>
                <div>
                    <img src={SDNHSLogo} className="w-20 shrink-0" />
                </div>
            </div>

            <div className="mt-7">
                <table className="table border border-black [&>thead>tr]:border-black">
                    <thead>
                        <tr className="[&>th]:border-black [&>th]:border text-center text-foreground">
                            <th></th>
                            <th className="w-20">MALE</th>
                            <th className="w-20">FEMALE</th>
                            <th className="w-20 text-red-500">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(
                            ["jhs", "shs", "accounting", "principal"] as const
                        ).map((category, index) => (
                            <tr
                                key={index}
                                className="[&>td]:py-2 [&>td]:border-black [&>td]:border text-center"
                            >
                                <td className="text-left uppercase">
                                    {empListCategory[category]}
                                </td>
                                <td>{filteredList.male[category]}</td>
                                <td>{filteredList.female[category]}</td>
                                <td className="text-red-500">
                                    {filteredList.male[category] +
                                        filteredList.female[category]}
                                </td>
                            </tr>
                        ))}
                        <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border text-center">
                            <td></td>
                            <td>
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </td>
                            <td>
                                {Object.values(filteredList.female).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </td>
                            <td className="text-red-500">
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                ) +
                                    Object.values(filteredList.female).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt]">
                <thead>
                    <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                        <th colSpan={2}>JUNIOR HIGH SCHOOL</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.jhs.map((jhs, index) => (
                        <tr
                            key={index}
                            className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                        >
                            <td className="w-12 text-center">{++index}</td>
                            <td>{jhs?.name}</td>
                        </tr>
                    ))}
                    {summary.jhs.length === 0 && (
                        <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                            <td>No records for junior high school</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt] break-after-auto">
                <thead>
                    <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                        <th colSpan={2}>SENIOR HIGH SCHOOL</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.shs.map((shs, index) => (
                        <tr
                            key={index}
                            className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                        >
                            <td className="w-12 text-center">{++index}</td>
                            <td>{shs?.name}</td>
                        </tr>
                    ))}
                    {summary.shs.length === 0 && (
                        <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                            <td>No records for senior high school</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt] break-after-auto">
                <thead>
                    <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                        <th colSpan={2}>ACCOUNTING</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.accounting.map((acc, index) => (
                        <tr
                            key={index}
                            className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                        >
                            <td className="w-12 text-center">{++index}</td>
                            <td>{acc?.name}</td>
                        </tr>
                    ))}

                    {summary.accounting.length === 0 && (
                        <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                            <td>No records for accounting</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});

export default PDFEmployee;
