import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function isPageLoading(): boolean {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const pages = [
        '/dashboard', '/staff', '/leave', '/service-records', '/reports', '/messages', '/notification', '/general-search',
        '/profile', '/profile/settings', ''
    ]

    const subpages = [
        '/staff/new-staff/edit', '/messages?user', '/leave/view'
    ]

    useEffect(() => {
        router.on('start', event => {
            if(pages.includes(event.detail.visit.url.pathname))
                setIsLoading(true)
            else if(subpages.some(subpage => event.detail.visit.url.pathname.startsWith(subpage)))
                setIsLoading(true)
        })

        router.on('finish', event => {
            if(pages.includes(event.detail.visit.url.pathname))
                setIsLoading(false)
            else if(subpages.some(subpage => event.detail.visit.url.pathname.startsWith(subpage)))
                setIsLoading(false)
        })
    }, [])

    return isLoading
}