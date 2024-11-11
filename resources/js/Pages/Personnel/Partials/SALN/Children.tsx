import React from "react";

type Props = {
    children: Array<{
        id: number
        saln_id: number
        name: string
        date_of_birth: string
        age: string
    }>|null
}

const Children: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <div className="grid grid-cols-[1fr,12rem,10rem] font-bold uppercase gap-4 text-center text-[8pt]">
                <div>Name</div>
                <div>Date of Birth</div>
                <div>Age</div>
            </div>
            <div className="tetx-[10pt]">
                {children ? (
                    children.map((child, index) => (
                        <Card key={index} children={child} />
                    ))
                ) : (
                    Array.from({ length: 4 }).map((_, index) => <Card key={index} />)
                )}
            </div>
        </div>
    );
};

const Card: React.FC<{children?: {
    id: number
    saln_id: number
    name: string
    date_of_birth: string
    age: string
}}> = ({ children }) => {
    return (
        <div
            className="grid grid-cols-[1fr,12rem,10rem] h-5 gap-4 text-center [&>div]:border-b [&>div]:border-black [&>div]:leading-5"
        >
            <div>{children?.name||"N/A"}</div>
            <div>{children?.date_of_birth||"N/A"}</div>
            <div>{children?.age||"N/A"}</div>
        </div>
    )
}

export default Children;
