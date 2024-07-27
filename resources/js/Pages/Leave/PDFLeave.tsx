import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";

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
        transform: "scale(0.90)"
    },
    title: {
        fontSize: 14,
        fontFamily: "Inter-Bold",
        textAlign: "center",
    },
    bordered: {
        border: 1,
        borderStyle: "solid",
        borderColor: "black",
    },
    table: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
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
    flex_row: {
        display: "flex", 
        flexDirection: "row"
    }
});

export default function PDFLeave() {
    return (
        <Document title="Application for Leave">
            <Page size={"LETTER"} style={styles.body}>
                <Text style={[styles.title, { marginBottom: 12 }]}>
                    APPLICATION FOR LEAVE
                </Text>
                <View style={[styles.bordered]}>
                    <View style={[styles.table, { height: '30pt'}]}>
                        <View style={[styles.row]}>
                            <View style={[styles.cell, { maxWidth: 180}]}>
                                <Text>1. OFFICE/DEPARTMENT:</Text>
                            </View>
                            <View style={styles.cell}>
                                <View style={[styles.flex_row, {alignItems: "stretch"}]}>
                                    <Text style={[{flexGrow: 1}]}>2. NAME:</Text>
                                    <Text style={[{flexGrow: 1}]}>(Last)</Text>
                                    <Text style={[{flexGrow: 1}]}>(First)</Text>
                                    <Text style={[{flexGrow: 1}]}>(Middle)</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.table, {borderTopWidth: 1}]}>
                        <View style={[styles.row, { height: '30pt'}]}>
                            <View style={[styles.cell]}>
                                <Text>3. DATE OF FILING</Text>
                            </View>
                            <View style={[styles.cell]}>
                                <Text>4. POSITION</Text>
                            </View>
                            <View style={[styles.cell]}>
                                <Text>5. SALARY</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.table, {textAlign:"center", fontFamily: "Inter-SemiBold", fontSize: 10, borderTop: 1, borderBottom: 1, padding: 1}]}>
                        <Text>6. DETAILS OF APPLICATION</Text>
                    </View>
                    <View style={[styles.table, {height: 310}]}>
                        <View style={[styles.row, { height: '100%' }]}>
                            <View style={[styles.cell, { borderRight: 1 }]}>
                                <View style={[{marginBottom: "auto", padding: 1.5, height: 230}]}>
                                    <Text style={[{marginBottom: 4}]}>6.A TYPE OF LEAVE TO BE AVAILED OF:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Vacation Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Mandatory/Forced Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Sick Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Maternity Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Paternity Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Special Privilege Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Solo Parent Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Study Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>10-Day VAWC Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Rehabilitaion Privilege</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Special Leave Benefits for Women</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Special Emergency(Calamity) Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Adoption Leave</Text>
                                    </View>

                                    <Text style={[{marginTop: "auto", marginLeft: 6}]}>Others:</Text>
                                    <View style={[{borderBottom: 1, width: "70%", marginBottom: 6, marginLeft: 6, height: 18}]}>
                                        <Text>Lorem ipsum dolor est</Text>
                                    </View>
                                </View>

                                <View style={[{borderTop: 1, height: 80}]}>
                                    <View style={[styles.cell, {}]}>
                                        <Text>6.C NUMBER OF WORKING DAYS APPLIED FOR</Text>
                                        <View style={[{paddingLeft: 10, width: '80%'}]}>
                                            <Text style={[{borderBottom: 1, marginTop: 5}]}>Lorem ipsum dolor est</Text>
                                        </View>
                                        <View style={[{paddingLeft: 10, marginTop: 8, width: '80%'}]}>
                                            <Text>INCLUSIVE DATES</Text>
                                            <Text style={[{borderBottom: 1, marginTop: 5}]}>Lorem ipsum dolor est</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cell, {}]}>
                                <View style={[{marginBottom: "auto", padding: 1.5, height: 230}]}>
                                    <Text style={[{marginBottom: 4}]}>6.B DETAILS OF LEAVE:</Text>
                                    <Text style={[{fontFamily: "Inter-Italic", fontSize: 8, marginLeft: 10, marginBottom: 3  }]}>In case of Vacation/Special Privilege Leave:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Within the Philippines</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Abroad (Specify)</Text>
                                    </View>

                                    <Text style={[{fontFamily: "Inter-Italic", fontSize: 8, marginLeft: 10, marginBottom: 3, marginTop: 2  }]}>In case of Sick Leave:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>In Hospital (Specify Illness)</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Out Patient (Specify Illness)</Text>
                                    </View>

                                    <Text style={[{fontFamily: "Inter-Italic", fontSize: 8, marginLeft: 10, marginBottom: 3, marginTop: 2  }]}>In case of Special Leave Benefits for Women:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[]}>(Specify Illness)</Text>
                                    </View>

                                    <Text style={[{fontFamily: "Inter-Italic", fontSize: 8, marginLeft: 10, marginBottom: 3, marginTop: 2  }]}>In case of Stufy Leave:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Special Privilege Leave</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Solo Parent Leave</Text>
                                    </View>
                                    
                                    <Text style={[{fontFamily: "Inter-Italic", fontSize: 8, marginLeft: 10, marginBottom: 3, marginTop: 2  }]}>Other purpose:</Text>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Monetization of Leave Credits</Text>
                                    </View>
                                    <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                        <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                        <Text style={[]}>Terminal Leave</Text>
                                    </View>
                                </View>

                                <View style={[{borderTop: 1, height: 80}]}>
                                    <View style={[]}>
                                        <Text>6.D COMMUTATION</Text>
                                        <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                            <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                            <Text style={[]}>Vacation Leave</Text>
                                        </View>
                                        <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                            <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                            <Text style={[]}>Mandatory/Forced Leave</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.table, {textAlign:"center", fontFamily: "Inter-SemiBold", fontSize: 10, borderTop: 1, borderBottom: 1, padding: 1}]}>
                        <Text>7. DETAILS OF ACTION ON APPLICATION</Text>
                    </View>
                    <View style={[styles.table, {height: 120}]}>
                        <View style={[styles.row, { height: "100%"}]}>
                            <View style={[styles.cell, {borderRight: 1, width: "53.1%"}]}>
                                <Text>7.A CERTIFIACTION OF LEAVE CREDITS</Text>
                                <View style={[styles.row, {marginTop: 3, justifyContent: "flex-start", marginLeft: "auto", marginRight: "auto"}]}>
                                    <View style={[{flexGrow: 0}]}>
                                        <Text>As of</Text>
                                    </View>
                                    <View style={[styles.cell, {borderBottom: 1, width: 80, flexGrow: 0}]}>
                                    </View>
                                </View>
                                <View style={[{marginTop: 3, fontSize: 8, marginLeft: "auto", marginRight: "auto", width: 240}]}>
                                    <View style={[{border: 1}]}>
                                        <View style={[styles.row, {borderBottom: 1}]}>
                                            <View style={[styles.cell, {width: 105, flexBasis: 0}]}></View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>Vacation Leave</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>Sick Leave</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.row, {borderBottom: 1}]}>
                                            <View style={[styles.cell, {width: 105, flexBasis: 0, fontFamily: "Inter-Italic"}]}>
                                                <Text>Total Earned</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Vacation Leave */}</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Sick Leave */}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.row, {borderBottom: 1}]}>
                                            <View style={[styles.cell, {width: 105, flexBasis: 0, fontFamily: "Inter-Italic"}]}>
                                                <Text>Less this application</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Vacation Leave */}</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Sick Leave */}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.row]}>
                                            <View style={[styles.cell, {width: 105, flexBasis: 0, fontFamily: "Inter-Italic"}]}>
                                                <Text>Balance</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Vacation Leave */}</Text>
                                            </View>
                                            <View style={[styles.cell, {borderLeft: 1, width: 70, flexBasis: 0}]}>
                                                <Text style={[{textAlign: "center"}]}>{/* Sick Leave */}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[{width: 240, marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: 10}]}>
                                    <Text style={[{borderBottom: 1, fontSize: 10, fontFamily: "Inter-SemiBold", textAlign: "center", textTransform: "uppercase"}]}>Lorem ispum dolor est</Text>
                                    <Text style={[{textAlign: "center"}]}>Administrative officer IV (HRMO)</Text>
                                </View>
                            </View>
                            <View style={[styles.cell, {width: "50%"}]}>
                                <Text>7.B RECOMMENDATION</Text>
                                <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2, marginTop: 2}]}>
                                    <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                    <Text style={[]}>For approval</Text>
                                </View>
                                <View style={[styles.flex_row, {marginLeft: 6, marginBottom: 2}]}>
                                    <Text style={[styles.bordered, {width: 11, border: 2, marginRight: 2}]}></Text>
                                    <Text style={[]}>For disapproval due to</Text>
                                    <Text style={[{borderBottom: 1, width: "50%"}]}></Text>
                                </View>
                                <View style={[{width: 240, marginLeft: "auto", marginRight: "auto"}]}>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                </View>
                                <View style={[{width: 240, marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: 10}]}>
                                    <Text style={[{borderBottom: 1, fontSize: 10, fontFamily: "Inter-SemiBold", textAlign: "center", textTransform: "uppercase"}]}></Text>
                                    <Text style={[{textAlign: "center"}]}>(Authorized Officer)</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.table, {height: 135, borderTop: 1}]}>
                        <View style={[styles.row]}>
                            <View style={[styles.cell, {width: "53%"}]}>
                                <Text style={{marginBottom: 5}}>7.C APPROVED FOR:</Text>
                                <View style={[styles.row, {marginLeft: 12, width: "150pt"}]}>
                                    <View style={[styles.cell, {borderBottom: 1, width: "20%"}]}></View>
                                    <View style={[{width: "80%"}]}>
                                        <Text style={[styles.cell]}>days with pay</Text>
                                    </View>
                                </View>
                                <View style={[styles.row, {marginLeft: 12, width: "150pt"}]}>
                                    <View style={[styles.cell, {borderBottom: 1, width: "20%"}]}></View>
                                    <View style={[{width: "80%"}]}>
                                        <Text style={[styles.cell]}>days with out pay</Text>
                                    </View>
                                </View>
                                <View style={[styles.row, {marginLeft: 12, width: "150pt"}]}>
                                    <View style={[styles.cell, {borderBottom: 1, width: "20%"}]}></View>
                                    <View style={[{width: "80%"}]}>
                                        <Text style={[styles.cell]}>Others (Specify)</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cell, {width: "50%"}]}>
                                <Text>7.D DISAPPROVED DUE TO:</Text>
                                <View style={[{paddingLeft: 15}]}>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                    <Text style={[{borderBottom: 1, width: "100%", height:12}]}></Text>
                                </View>
                            </View>
                        </View>

                        <View style={[{width: 240, marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: 10}]}>
                            <Text style={[{borderBottom: 1, fontSize: 10, fontFamily: "Inter-SemiBold", textAlign: "center", textTransform: "uppercase"}]}></Text>
                            <Text style={[{textAlign: "center"}]}>(Authorized Official)</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
