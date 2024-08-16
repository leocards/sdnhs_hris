import isPageLoading from "./Index";

export default function Loading({ children }: { children?: React.ReactNode }) {
    const isLoading = isPageLoading();

    return isLoading ? (
        <div className="w-fit h-fit mx-auto my-auto flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-md"></span>
            <div>Loading...</div>
        </div>
    ) : (
        children
    );
}
