import { cn } from "@/lib/utils";
import { Dialog } from "@headlessui/react";

const Processing: React.FC<{ is_processing: boolean, backdrop?: string | null }> = ({
    is_processing,
    backdrop
}) => {
    return (
        <Dialog
            open={is_processing}
            as="div"
            onClose={() => null}
            className={cn("fixed inset-0 inline-flex overflow-y-auto px-4 py-6 sm:px-0 z-50 transform transition-all max-h-screen outline-none", backdrop??"bg-black/75")}
        >
            <div className="mx-auto my-auto flex items-center gap-4 text-white">
                <span className="loading loading-spinner loading-md bg-white"></span>
                <span>Processing...</span>
            </div>
        </Dialog>
    );
};

export default Processing