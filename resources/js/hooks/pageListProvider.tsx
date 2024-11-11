import { PaginateData } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

type ProviderProps = {
    children: React.ReactNode;
    initialValue?: PaginateData;
}

type Pages = {
    currentPage: number;
    lastPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    perPage: number;
    total: number;
    pageSet: Array<number>;
}

type ProviderState = {
    data: Array<any>;
    loading?: boolean;
    pages: Pages | null;
    clearList: CallableFunction;
    setLoading: CallableFunction;
    setList: (list: PaginateData) => void;
}

const initialState: ProviderState = {
    data: [],
    pages: {
        currentPage: 1,
        lastPage: 1,
        firstPageUrl: '',
        lastPageUrl: '',
        nextPageUrl: null,
        prevPageUrl: null,
        perPage: 1,
        total: 1,
        pageSet: []
    },
    loading: false,
    setList: () => {},
    clearList: () => {},
    setLoading: () => {},
}

const ProviderContext = createContext<ProviderState>(initialState)

const generateSequentialArray = (length: number) => Array.from({ length }, (_, i) => i + 1);

const getVisiblePages = (pages: Array<number>, current_page: number, pagesPerSet = 3) => {
    // Calculate the index of the first page in the current set
    const startIndex = Math.floor((current_page - 1) / pagesPerSet) * pagesPerSet;

    // Slice the array to get the current set of pages
    return pages.slice(startIndex, startIndex + pagesPerSet);
}

const PageListProvider = ({
    children,
    initialValue,
    ...props
}: ProviderProps) => {
    const [data, setData] = useState<Array<any>>(initialValue?.data || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [pages, setPages] = useState<Pages | null>(initialValue ? {
        currentPage: initialValue.current_page,
        lastPage: initialValue.last_page,
        firstPageUrl: initialValue.first_page_url,
        lastPageUrl: initialValue.last_page_url,
        nextPageUrl: initialValue.next_page_url,
        prevPageUrl: initialValue.prev_page_url,
        perPage: initialValue.per_page,
        total: initialValue.total,
        pageSet: getVisiblePages(generateSequentialArray(initialValue.last_page), initialValue.current_page)
    } : null)

    const value = {
        data,
        pages,
        loading,
        setList: (list: PaginateData) => {
            setData(list.data)
            setPages({
                currentPage: list.current_page,
                lastPage: list.last_page,
                firstPageUrl: list.first_page_url,
                lastPageUrl: list.last_page_url,
                nextPageUrl: list.next_page_url,
                prevPageUrl: list.prev_page_url,
                perPage: list.per_page,
                total: list.total,
                pageSet: getVisiblePages(generateSequentialArray(list.last_page), list.current_page)
            })
        },
        clearList: () => {
            setData([])
            setPages(null)
            setLoading(false)
        },
        setLoading: (isLoading: boolean) => {
            setLoading(isLoading)
        }
    }

    return (
        <ProviderContext.Provider {...props} value={value}>
            {children}
        </ProviderContext.Provider>
    )
}

const usePageList = () => {
    const context = useContext(ProviderContext)

    if (context === undefined)
        throw new Error("usePageList must be used within a PageListProvider")

    return context
}

export {
    usePageList
}

export default PageListProvider
