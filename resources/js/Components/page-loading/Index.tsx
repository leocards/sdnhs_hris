import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function isPageLoading(): boolean {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const pages = [
        "/dashboard",
        "/personnel",
        "/personnel/tardiness",
        "/myapprovals/leave",
        "/myapprovals/pds",
        "/myapprovals/saln",
        "/myapprovals/service-records",
        "/service-records",
        "/leave",
        "/myreports/list-of-personnel",
        "/myreports/ipcr",
        "/myreports/saln",
        "/messages",
        "/notification",
        "/general-search",
        "/profile",
        "/profile/profile",
        "/profile/settings",
        "/personnel/new-personnel",
        "/saln",
        "/pds",
        "/tardiness"
    ];

    const subpages = [
        "/personnel/new-personnel/edit",
        "/personnel/new-personnel/",
        "/messages?user",
        "/myapprovals/leave/view",
        "/leave/view",
        "/leave/apply-for-leave",
        "/general-search/view",
        "/notification/redirect",
        "/personnel/tardiness",
        "/saln/add",
    ];

    const exclude = [
        route("profile.edit", { _query: { c: "C1" } }),
        route("profile.edit", { _query: { c: "C1", section: "I" } }),
        route("profile.edit", { _query: { c: "C1", section: "II" } }),
        route("profile.edit", { _query: { c: "C1", section: "III" } }),
        route("profile.edit", { _query: { c: "C2" } }),
        route("profile.edit", { _query: { c: "C2", section: "IV" } }),
        route("profile.edit", { _query: { c: "C2", section: "V" } }),
        route("profile.edit", { _query: { c: "C3" } }),
        route("profile.edit", { _query: { c: "C3", section: "VI" } }),
        route("profile.edit", { _query: { c: "C3", section: "VII" } }),
        route("profile.edit", { _query: { c: "C3", section: "VIII" } }),
        route("profile.edit", { _query: { c: "C4" } }),
        route("personnel.tardiness.add"),
        route("myapprovals.leave", [{_query: { status: "pending" }}]),
        route("myapprovals.leave", [{_query: { status: "approved" }}]),
        route("myapprovals.leave", [{_query: { status: "rejected" }}]),
        route("myapprovals.pds", [{_query: { status: "pending" }}]),
        route("myapprovals.pds", [{_query: { status: "approved" }}]),
        route("myapprovals.saln", [{_query: { status: "pending" }}]),
        route("myapprovals.saln", [{_query: { status: "approved" }}]),
        route("myapprovals.service-records", [{_query: { status: "pending" }}]),
        route("myapprovals.service-records", [{_query: { status: "approved" }}]),
        route("myapprovals.service-records", [{_query: { status: "rejected" }}]),
        route("leave", [{_query: { status: "pending" }}]),
        route("leave", [{_query: { status: "approved" }}]),
        route("leave", [{_query: { status: "rejected" }}]),
        route("leave", [{_query: { status: "pending", myleave: true }}]),
        route("leave", [{_query: { status: "approved", myleave: true }}]),
        route("leave", [{_query: { status: "rejected", myleave: true }}]),
        route("saln", [{_query: { status: "pending" }}]),
        route("saln", [{_query: { status: "approved" }}]),
        route("service-records", [{_query: { status: "pending" }}]),
        route("service-records", [{_query: { status: "approved" }}]),
        route("service-records", [{_query: { status: "rejected" }}]),
        "/personnel/tardiness-update/",
        "/personnel/tardiness-delete/",
    ];

    useEffect(() => {
        let startsRouter = router.on("start", (event) => {
            if (!exclude.includes(event.detail.visit.url.href))
                if (pages.includes(event.detail.visit.url.pathname))
                    setIsLoading(true);
                else if (
                    subpages.some((subpage) =>
                        event.detail.visit.url.pathname.startsWith(subpage)
                    )
                )
                    setIsLoading(true);
        });

        let finishRouter = router.on("finish", (event) => {
            if (pages.includes(event.detail.visit.url.pathname))
                setIsLoading(false);
            else if (
                subpages.some((subpage) =>
                    event.detail.visit.url.pathname.startsWith(subpage)
                )
            )
                setIsLoading(false);
        });

        return () => {
            startsRouter();
            finishRouter();
        };
    }, []);

    return isLoading;
}
