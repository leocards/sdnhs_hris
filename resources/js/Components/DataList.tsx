import React, { PropsWithChildren } from "react";

type Props = {
    empty: boolean;
    loading?: boolean;
    emptyResults?: string;
};

const DataList = ({
    empty,
    emptyResults,
    ...props
}: Props & PropsWithChildren) => {
    return (
        <>
            { props.loading ? (
                <div className="py-10 flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <div>Loading...</div>
                </div>
            ) : (empty && !emptyResults) ? (
                <div className="text-center py-4 opacity-65">No records</div>
            ) : (empty && emptyResults) ? (
                <div className="text-center py-4 opacity-65">
                    No results found for "{emptyResults}"
                </div>
            ) : props.children }
        </>
    );
};

export default DataList;
