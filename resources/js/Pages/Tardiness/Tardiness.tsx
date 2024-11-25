import Filter from "@/Components/buttons/FilterButton";
import DataList from "@/Components/DataList";
import PaginationButton from "@/Components/PaginationButton";
import { AvatarProfile } from "@/Components/ui/avatar";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginateData, SYTYPE } from "@/types";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";

type TardinessProps = {
    pageData: PaginateData;
} & PageProps

export default function Index(props: TardinessProps) {
    return (
        <PageListProvider initialValue={props.pageData}>
            <Head title="Tardiness" />

            <Tardiness {...props} />
        </PageListProvider>
    );
}

function Tardiness({
    auth
}: TardinessProps) {
    const { data, setList, setLoading, loading } = usePageList();
    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("personnel.tardiness.json", {
                    _query: {
                        page: page,
                    },
                })
            )
            .then((response) => {
                let data = response.data;
                setList(data);
                setLoading(false);
            });
    };

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Tardiness
                </h2>
            }
        >
            <div className="divide-y min-h-[22rem] flex flex-col mt-8">
                <div className="grid grid-cols-[repeat(3,1fr)] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Days present</div>
                    <div className="">Days absent</div>
                    <div className="">School year</div>
                </div>

                <DataList empty={data.length == 0} loading={loading}>
                    {data.map((personnel, index) => (
                        <PersonnelRow
                            key={index}
                            personnel={personnel}
                        />
                    ))}
                </DataList>

                <PaginationButton
                    onPage={getPageData}
                    onNext={getPageData}
                    onPrevious={getPageData}
                />
            </div>
        </Authenticated>
    )
}

type Personnel = {
    id: number;
    present: string;
    absent: string;
    created_at: string;
    sy: string;
};

type PersonnelRowProps = {
    personnel: Personnel;
};

const PersonnelRow: React.FC<PersonnelRowProps> = ({
    personnel,
}) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(3,1fr)] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="line-clamp-1">{personnel.present}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{personnel.absent}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {personnel.sy}
                    </div>
                </div>
            </div>
        </div>
    );
};
