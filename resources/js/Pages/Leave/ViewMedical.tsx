import Modal from "@/Components/Modal";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Button } from "@/Components/ui/button";

export type MedicalType = {
    id: number
    file_path: string
    file_name: string
    leave_id: number
    updated_at: string
}

type Data = {
    leave_id?: number | null;
    medical: MedicalType|string|null;
    user: { id: number | null; first_name: string; last_name: string };
};

type ViewMedicalProps = {
    show: boolean;
    data: Data;
    onClose: (close: false) => void;
};

export default function ViewMedical({ show, data, onClose }: ViewMedicalProps) {
    const src = typeof data?.medical == 'string' ? data?.medical?.replace("public", "/storage") : data?.medical?.file_path?.replace("public", "/storage")

    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <AspectRatio
                    ratio={15 / 10}
                    className="bg-muted rounded-md overflow-hidden"
                >
                    <img
                        src={src}
                        alt=""
                        className="object-contain h-full w-full"
                    />
                </AspectRatio>

                <div className="mt-6 flex">
                    <Button
                        variant="secondary"
                        className="px-8 ml-auto"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
