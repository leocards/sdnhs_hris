import React, { PropsWithChildren, ReactNode } from "react";

type Props = {
    empty: boolean;
    loading?: boolean;
    emptyResults?: string;
    customEmpty?: string | ReactNode;
    loadFetching?: boolean;
};

const DataList = ({
    empty,
    emptyResults,
    loadFetching,
    ...props
}: Props & PropsWithChildren) => {
    return (
        <>
            { props.loading || (loadFetching && props.loading) ? (
                <div className="py-8 flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <div>Loading...</div>
                </div>
            ) : (empty && !emptyResults) ? (
                <div className="text-center py-4 opacity-65">{props.customEmpty??'No records'}</div>
            ) : (empty && emptyResults) ? (
                <div className="text-center py-4 opacity-65">
                    No results found for "{emptyResults}"
                </div>
            ) : props.children }
        </>
    );
};

export default DataList;
