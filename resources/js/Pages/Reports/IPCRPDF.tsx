import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import { IPCR, IPCRType, SALN } from "./Reports";
import { PageSize } from "@react-pdf/types";

Font.register({
    family: "Inter-ExtraLight",
    src: "/storage/assets/inter/Inter-ExtraLight.ttf",
});
Font.register({
    family: "Inter-Light",
    src: "/storage/assets/inter/Inter-Light.ttf",
});
Font.register({
    family: "Inter-Medium",
    src: "/storage/assets/inter/Inter-Medium.ttf",
});
Font.register({
    family: "Inter-Thin",
    src: "/storage/assets/inter/Inter-Thin.ttf",
});
Font.register({
    family: "Inter-Regular",
    src: "/storage/assets/inter/Inter-Regular.ttf",
});
Font.register({
    family: "Inter-Medium",
    src: "/storage/assets/inter/Inter-Medium.ttf",
});
Font.register({
    family: "Inter-SemiBold",
    src: "/storage/assets/inter/Inter-SemiBold.ttf",
});
Font.register({
    family: "Inter-Bold",
    src: "/storage/assets/inter/Inter-Bold.ttf",
});
Font.register({
    family: "Inter-ExtraBold",
    src: "/storage/assets/inter/Inter-ExtraBold.ttf",
});
Font.register({
    family: "Inter-Black",
    src: "/storage/assets/inter/Inter-Black.ttf",
});
Font.register({
    family: "Inter-Italic",
    src: "/storage/assets/inter/InterVariable-Italic.ttf",
});

const styles = StyleSheet.create({
    body: {
        padding: 35,
        fontFamily: "Inter-Regular",
        fontSize: 9,
        // transform: "scale(0.90)"
    },
    textCenter: {
        textAlign: "center",
    },
    textBold: {
        fontFamily: "Inter-Bold",
    },
    flex: { display: "flex" },
    section: {
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
    },
    value: {
        paddingLeft: 10,
    },
    flex_row: {
        flexDirection: "row",
        marginBottom: 4,
    },
    table: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        border: 1,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        flexGrow: 0,
        flexShrink: 0,
    },
    cell: {
        flexGrow: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
    },
});

type Props = {
    size: PageSize;
    principal: {name: string; position: string};
    hr: {name: string;}
    ipcr: Array<IPCRType>;
}

export default function IPCRPDF({size, hr, ipcr, principal}: Props) {
    console.log(principal, hr)
    return (
        <Document title="IPCR">
            <Page size={size} style={styles.body}>
                <View style={[{display: "flex", flexDirection: "row"}]}>
                    <View>
                        <Image src={"/storage/assets/DepEd.png"} style={{width: 65, height: 65}} />
                    </View>
                    <View style={[{flexGrow: 1}]}>
                        <Text style={[{alignSelf: "center"}]}>Republika ng Pilipinas</Text>
                        <Text style={[{alignSelf: "center"}]}>Kagawaran ng Edukasyon</Text>
                        <Text style={[{alignSelf: "center"}]}>Rehiyon XI</Text>
                        <Text style={[{alignSelf: "center"}]}>Sangay ng Lungsod ng Panabo</Text>
                        <Text style={[{alignSelf: "center"}]}>Lungsod ng Panabo</Text>
                        <Text style={[{alignSelf: "center", fontFamily: "Inter-Bold"}]}>SOUTHERN DAVAO NATIONAL HIGH SCHOOL</Text>
                        <Text style={[{alignSelf: "center"}]}>Southern Davao, Panabo City</Text>
                        <Text style={[{alignSelf: "center", height: 10}]}></Text>
                        <Text style={[{alignSelf: "center", fontFamily: "Inter-Bold"}]}>LIST OF TEACHERS WITH THEIR IPCR RATING</Text>
                        <Text style={[{alignSelf: "center", fontFamily: "Inter-Bold"}]}>2022-2023</Text>
                        <Text style={[{alignSelf: "center", height: 10}]}></Text>
                    </View>
                    <View>
                        <Image src={"/storage/assets/sdnhs-logo.png"} style={{width: 65, height: 65}} />
                    </View>
                </View>
                <Table style={{borderBottom: 0}}>
                    <Row>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 30 }}>
                            <Text style={[styles.textCenter]}>No.</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center" }}>
                            <Text style={[styles.textCenter]}>Name of Personnel</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 110 }}>
                            <Text style={[styles.textCenter]}>Position</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 75 }}>
                            <Text style={[styles.textCenter]}>Performance Rating</Text>
                            <Text style={[styles.textCenter]}>(SY 2022-2023)</Text>
                        </Cell>
                        <Cell style={{height: 40, flex: 1, justifyContent: "center", maxWidth: 93 }}>
                            <Text style={[styles.textCenter]}>Adjectival Equivalent</Text>
                        </Cell>
                    </Row>
                </Table>

                <Table style={{borderTop: 0}}>
                    {[...IPCR].map((list, index) => (
                        <Row key={index} style={{borderTop: 1}}>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 30, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{++index}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text>{list.name}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 110, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.position}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 75, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.rate}</Text>
                            </Cell>
                            <Cell style={{flex: 1, justifyContent: "center", maxWidth: 93, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.equivalent}</Text>
                            </Cell>
                        </Row>
                    ))}
                </Table>


                <Table style={{ border: 0, marginTop: 20 }}>
                    <Row>
                        <Cell>
                            <Text>Prepared by:</Text>
                        </Cell>
                        <Cell style={{ flex: 1, justifyContent: "flex-end" }}>
                            <Text style={{ textAlign: "right", width: 220 }}>Certified Correct and Approved by:</Text>
                        </Cell>
                    </Row>
                    <Row style={{ marginTop: 25 }}>
                        <Cell>
                            <View style={{borderBottom: 1, width: 200}}>
                                <Text style={{textAlign: "center", fontFamily: "Inter-SemiBold"}}>{hr?.name??""}</Text>
                            </View>
                            <View style={{width: 200}}>
                                <Text style={{textAlign: "center"}}>School HR</Text>
                            </View>
                        </Cell>
                        <Cell style={{width: 130 }}>
                            <View style={{borderBottom: 1}}>
                                <Text style={{textAlign: "center"}}>{principal?.name??""}</Text>
                            </View>
                            <View>
                                <Text style={{textAlign: "center"}}>{principal?.position??""}</Text>
                            </View>
                        </Cell>
                    </Row>
                </Table>
            </Page>
        </Document>
    );
}

interface TableProps {
    children: React.ReactNode;
    style?: any;
}

const Table: React.FC<TableProps> = ({ children, style }) => (
    <View style={[styles.table, { ...style }]}>{children}</View>
);

interface RowProps {
    children: React.ReactNode;
    style?: any;
}

const Row: React.FC<RowProps> = ({ children, style }) => (
    <View style={[styles.row, { ...style }]}>{children}</View>
);

interface CellProps {
    children?: React.ReactNode;
    style?: any;
}

const Cell: React.FC<CellProps> = ({ children, style }) => (
    <View style={[styles.cell, { ...style }]}>{children}</View>
);
