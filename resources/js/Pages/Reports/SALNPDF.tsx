import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import { SALN } from "./Reports";
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
        marginBottom: 5,
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
    selfAlignCenter: {
        alignSelf: "center"
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

export default function SALNPDF({size}: {size: PageSize}) {
    return (
        <Document title="SALN">
            <Page size={"LEGAL"} orientation={"landscape"} style={styles.body}>
                <View style={[{display: "flex", flexDirection: "row", justifyContent: 'center'}]}>
                    <View>
                        <Image src={"/storage/assets/DepEd.png"} style={{width: 55, height: 55}} />
                    </View>
                    <View style={[{flexGrow: 1, alignContent: "center",  maxWidth: 330}]}>
                        <Text
                            style={[
                                styles.selfAlignCenter,
                                styles.textBold,
                                { marginBottom: 4 },
                            ]}
                        >
                            SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                        </Text>
                        <Text style={[styles.selfAlignCenter, { marginBottom: 4 }]}>
                            SUMMARY REFORM FORM 1-A
                        </Text>
                        <Text style={[styles.selfAlignCenter, { marginBottom: 4 }]}>
                            Statement of Assets, Liabilities and Network
                        </Text>
                        <Text style={[styles.selfAlignCenter]}>Calendar Year 2023</Text>
                    </View>
                    <View>
                        <Image src={"/storage/assets/sdnhs-logo.png"} style={{width: 55, height: 55}} />
                    </View>
                </View>

                <View style={{height: 15}}></View>
                
                <View style={styles.section}>
                    <View style={styles.flex_row}>
                        <Text style={{ width: 160 }}>Region:</Text>
                        <Text style={styles.value}>REGION XI</Text>
                    </View>
                    <View style={styles.flex_row}>
                        <Text style={{ width: 160 }}>
                            Name of Agency/School:
                        </Text>
                        <Text style={styles.value}>
                            DepEd Panabo Division/Southern Davao National High
                            School
                        </Text>
                    </View>
                    <View style={styles.flex_row}>
                        <Text style={{ width: 160 }}>Office Address:</Text>
                        <Text style={styles.value}>
                            Purok 4 Southern Davao, Panabo City
                        </Text>
                    </View>
                </View>

                <Table style={{borderBottom: 0}}>
                    <Row style={{ height: 45 }}>
                        <Cell style={{ width: 35, flexGrow: 0 }} />
                        <Cell
                            style={{ flex: 3.5, borderLeft: 1, borderRight: 1 }}
                        >
                            <Text
                                style={[
                                    styles.textCenter,
                                    {
                                        borderBottom: 1,
                                        height: 27,
                                        marginTop: 2,
                                        paddingTop: 6,
                                        marginBottom: 1,
                                    },
                                ]}
                            >
                                NAME OF EMPLOYEE
                            </Text>
                            <Row>
                                <Cell
                                    style={{
                                        borderRight: 1,
                                        padding: 1,
                                        width: 100,
                                        flexGrow: 0,
                                    }}
                                >
                                    <Text>Last Name</Text>
                                </Cell>
                                <Cell
                                    style={{
                                        borderRight: 1,
                                        padding: 1,
                                        window: 100,
                                        flexGrow: 0,
                                    }}
                                />
                                <Cell
                                    style={{
                                        borderRight: 1,
                                        padding: 1,
                                        width: 100,
                                        flexGrow: 0,
                                    }}
                                >
                                    <Text>First Name</Text>
                                </Cell>
                                <Cell
                                    style={{
                                        padding: 1,
                                        width: 100,
                                        flexGrow: 0,
                                    }}
                                >
                                    <Text>Middlename</Text>
                                </Cell>
                            </Row>
                        </Cell>
                        <Cell style={{ flex: 1, borderRight: 1 }}>
                            <Text
                                style={{ textAlign: "center", paddingTop: 14 }}
                            >
                                TIN
                            </Text>
                        </Cell>
                        <Cell style={{ flex: 1, borderRight: 1 }}>
                            <Text
                                style={{ textAlign: "center", paddingTop: 14 }}
                            >
                                POSITION
                            </Text>
                        </Cell>
                        <Cell style={{ flex: 1, borderRight: 1 }}>
                            <Text
                                style={{ textAlign: "center", paddingTop: 14 }}
                            >
                                NET WORTH
                            </Text>
                        </Cell>
                        <Cell
                            style={{ flex: 2, paddingTop: 4, borderRight: 1 }}
                        >
                            <Text style={styles.textCenter}>
                                If spouse is with government service,
                            </Text>
                            <Text style={styles.textCenter}>
                                Please indicate
                            </Text>
                            <Text style={styles.textCenter}>
                                Name of Spouse/Employer/Address
                            </Text>
                        </Cell>
                        <Cell style={{ flexGrow: 0, width: 60, paddingTop: 4 }}>
                            <Text style={styles.textCenter}>Please</Text>
                            <Text style={styles.textCenter}>check (/) if</Text>
                            <Text style={styles.textCenter}>Joint Filing</Text>
                        </Cell>
                    </Row>
                </Table>

                <Table style={{ borderTop: 0 }}>
                    {SALN.map((list, index) => (
                        <Row key={index} style={{ borderTop: 1 }}>
                            <Cell style={{ width: 35, flexGrow: 0 }}>
                                <Text style={{textAlign: "right", paddingRight: 2}}>{++index}</Text>
                            </Cell>
                            <Cell
                                style={{
                                    flex: 3.5,
                                    borderLeft: 1,
                                    borderRight: 1,
                                }}
                            >
                                <Row style={{height: "21pt"}}>
                                    <Cell
                                        style={{
                                            borderRight: 1,
                                            padding: 1,
                                            width: 100,
                                            flexGrow: 0,
                                        }}
                                    >
                                        <Text>{list["Last Name"]}</Text>
                                    </Cell>
                                    <Text
                                        style={{
                                            borderRight: 1,
                                            paddingLeft: -5,
                                        }}
                                    >
                                        ,
                                    </Text>
                                    <Cell
                                        style={{
                                            borderRight: 1,
                                            padding: 1,
                                            width: 100,
                                            flexGrow: 0,
                                        }}
                                    >
                                        <Text>{list["First Name"]}</Text>
                                    </Cell>
                                    <Cell
                                        style={{
                                            padding: 1,
                                            width: 100,
                                            flexGrow: 0,
                                        }}
                                    >
                                        <Text>{list["Middle Name"]}</Text>
                                    </Cell>
                                </Row>
                            </Cell>
                            <Cell style={{ flex: 1, borderRight: 1 }}>
                                <Text style={{ textAlign: "center" }}>
                                    {list["TIN"]}
                                </Text>
                            </Cell>
                            <Cell style={{ flex: 1, borderRight: 1 }}>
                                <Text style={{ textAlign: "center" }}>
                                {list["Position"]}
                                </Text>
                            </Cell>
                            <Cell style={{ flex: 1, borderRight: 1 }}>
                                <Text style={{ textAlign: "center" }}>
                                {list["Net Worth"]}
                                </Text>
                            </Cell>
                            <Cell style={{ flex: 2, borderRight: 1 }}>
                                <Text style={styles.textCenter}>{list["Name of Spouse/Employer/Address"]}</Text>
                            </Cell>
                            <Cell style={{ flexGrow: 0, width: 60 }}>
                                <Text style={styles.textCenter}>{list["Joint Filing"]}</Text>
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
