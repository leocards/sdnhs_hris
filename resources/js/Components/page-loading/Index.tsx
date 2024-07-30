import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function isPageLoading(): boolean {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        router.on('start', event => {
            setIsLoading(true)
        })
    }, [])

    return isLoading
}