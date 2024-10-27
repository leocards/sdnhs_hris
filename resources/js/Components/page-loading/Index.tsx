import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function isPageLoading(): boolean {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const pages = [
        "/dashboard",
        "/personnel",
        "/personnel/tardiness",
        "/leave",
        "/service-records",
        "/reports",
        "/messages",
        "/notification",
        "/general-search",
        "/profile",
        "/profile/profile",
        "/profile/settings",
        "/personnel/new-personnel",
    ];

    const subpages = [
        "/personnel/new-personnel/edit",
        "/messages?user",
        "/leave/view",
        "/leave/apply-for-leave",
        "/general-search/view",
        "/notification/redirect",
        "/personnel/tardiness",
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
