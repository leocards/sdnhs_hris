import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import { IPCR, SALN } from "./Reports";

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
        fontSize: 10,
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

export default function IPCRPDF() {
    return (
        <Document title="IPCR">
            <Page size="LETTER" style={styles.body}>
                <Table style={{borderBottom: 0}}>
                    <Row>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 30 }}>
                            <Text style={[styles.textCenter]}>No.</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center" }}>
                            <Text style={[styles.textCenter]}>Name of Personnel</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 120 }}>
                            <Text style={[styles.textCenter]}>Position</Text>
                        </Cell>
                        <Cell style={{borderRight: 1, height: 40, flex: 1, justifyContent: "center", maxWidth: 83 }}>
                            <Text style={[styles.textCenter]}>Performance Rating</Text>
                            <Text style={[styles.textCenter]}>(SY 2022-2023)</Text>
                        </Cell>
                        <Cell style={{height: 40, flex: 1, justifyContent: "center", maxWidth: 65 }}>
                            <Text style={[styles.textCenter]}>Adjectival Equivalent</Text>
                        </Cell>
                    </Row>
                </Table>

                <Table style={{borderTop: 0}}>
                    {IPCR.map((list, index) => (
                        <Row key={index} style={{borderTop: 1}}>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 30, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{++index}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text>{list.name}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 120, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.position}</Text>
                            </Cell>
                            <Cell style={{borderRight: 1, flex: 1, justifyContent: "center", maxWidth: 83, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.rate}</Text>
                            </Cell>
                            <Cell style={{flex: 1, justifyContent: "center", maxWidth: 65, paddingVertical: 4, paddingHorizontal: 2 }}>
                                <Text style={[styles.textCenter]}>{list.equivalent}</Text>
                            </Cell>
                        </Row>
                    ))}
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
