import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function isPageLoading(): boolean {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const pages = [
        '/dashboard', '/personnel', '/personnel/tardiness', '/leave', '/service-records', '/reports', '/messages', '/notification', '/general-search',
        '/profile', '/profile/settings', '/personnel/new-personnel'
    ]

    const subpages = [
        '/personnel/new-personnel/edit', '/messages?user', '/leave/view', '/leave/apply-for-leave', '/general-search/view'
    ]

    useEffect(() => {
        let startsRouter = router.on('start', event => {
            if(pages.includes(event.detail.visit.url.pathname))
                setIsLoading(true)
            else if(subpages.some(subpage => event.detail.visit.url.pathname.startsWith(subpage)))
                setIsLoading(true)
        })

        let finishRouter = router.on('finish', event => {
            if(pages.includes(event.detail.visit.url.pathname))
                setIsLoading(false)
            else if(subpages.some(subpage => event.detail.visit.url.pathname.startsWith(subpage)))
                setIsLoading(false)
        })

        return () => {
            startsRouter()
            finishRouter()
        }
    }, [])

    return isLoading
}
