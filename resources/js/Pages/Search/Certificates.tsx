import DataList from "@/Components/DataList";
import React, { useEffect, useState } from "react";
import ViewCertificate from "../ServiceRecords/ViewCertificate";

type Props = {
    userId: number
}

const Certificates: React.FC<Props> = ({ userId }) => {
    const [certificate, setCertificates] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null)

    useEffect(() => {
        setLoading(true)
        window.axios
            .get(route('general-search.certificates', [userId]))
            .then((response) => {
                const data = response.data
                setCertificates(data)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-lg mx-auto space-y-1">
            <DataList empty={certificate.length === 0} loading={loading}>
                {certificate.map((cert, index) => (
                    <div
                        key={index}
                        className="w-full rounded-lg hover:bg-secondary p-3 border transition duration-200"
                        role="button"
                        onClick={() => setSelectedCertificate(cert)}
                    >
                        <div className="line-clamp-1">{cert.file_name}</div>
                    </div>
                ))}
            </DataList>

            <ViewCertificate certificate={selectedCertificate} show={!!selectedCertificate} onClose={() => setSelectedCertificate(null)} />
        </div>
    );
};

export default Certificates;
