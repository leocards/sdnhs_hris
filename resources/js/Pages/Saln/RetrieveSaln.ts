const getSpouse = (data: any) => {
    let spouse = {
        spouseid: null,
        familyname: "",
        firstname: "",
        middleinitial: "",
        position: "",
        office: "",
        officeaddress: "",
        governmentissuedid: "",
        idno: "",
        dateissued: ""
    }

    if(data) {
        spouse.spouseid = data.id
        spouse.familyname = data.family_name
        spouse.firstname = data.first_name
        spouse.middleinitial = data.middle_name
        spouse.position = data.position
        spouse.office = data.office
        spouse.officeaddress = data.office_address
        spouse.governmentissuedid = data.government_id
        spouse.idno = data.government_id_no
        spouse.dateissued = data.date_issued
    }

    return spouse
}

const getChildren = (data: Array<any>) => {
    let childrens: Array<{
        childid?: number | null;
        name: string;
        dateofbirth: Date | null
    }> = [{ childid: null, name: "", dateofbirth: null }]

    if(data)
        if(data.length > 0) {
            childrens = []

            data.forEach((child) => {
                childrens.push({ childid: child.id, name: child.name, dateofbirth: new Date(child.date_of_birth) })
            })
        }

    return childrens
}

interface RealAsset {
    realid?: number | null;
    description: string;
    kind: string;
    exactlocation: string;
    assessedvalue: string;
    currentfairmarketvalue: string;
    acquisition: {
        year: string;
        mode: string;
    };
    acquisitioncost: string;
}

interface PersonalAsset {
    personalid?: number | null;
    description: string;
    yearacquired: string;
    acquisitioncost: string;
}

const getRealProperties = (data: Array<any>, type: "real" | "personal") => {
    let assets: Array<RealAsset | PersonalAsset> = (type == "real") ? [
        {
            realid: null,
            description: "",
            kind: "",
            exactlocation: "",
            assessedvalue: "",
            currentfairmarketvalue: "",
            acquisition: {
                year: "",
                mode: "",
            },
            acquisitioncost: "",
        },
    ] : [
        {
            personalid: null,
            description: "",
            yearacquired: "",
            acquisitioncost: ""
        }
    ]

    if(data)
        if(data.length > 0) {
            assets = []

            data.forEach((asset) => {
                if(asset.asset_type === type){
                    if(type === "real") {
                        assets.push({
                            realid: asset.id,
                            description: asset.description,
                            kind: asset.kind,
                            exactlocation: asset.location,
                            assessedvalue: asset.assessed_value,
                            currentfairmarketvalue: asset.current_market_value,
                            acquisition: {
                                year: asset.year,
                                mode: asset.mode,
                            },
                            acquisitioncost: asset.cost
                        })
                    } else
                        assets.push({
                            personalid: asset.id,
                            description: asset.description,
                            yearacquired: asset.year,
                            acquisitioncost: asset.cost
                        })
                }
            })
        }

    return assets
}

const getLiabilities = (data: Array<any>) => {
    let liabilities = [
        {
            liabilityid: null,
            nature: "",
            nameofcreditors: "",
            outstandingbalances: "",
        }
    ]

    if(data)
        if(data.length > 0) {
            liabilities = []

            data.forEach((liability) => {
                liabilities.push({
                    liabilityid: liability.id,
                    nature: liability.nature,
                    nameofcreditors: liability.creditors,
                    outstandingbalances: liability.balances
                })
            })
        }

    return liabilities
}

const getBiFc = (data: Array<any>) => {
    let bifcs: Array<{
        bifcid?: number | null;
        name: string,
        address: string,
        nature: string,
        date: Date | null,
    }> = [
        {
            bifcid: null,
            name: "",
            address: "",
            nature: "",
            date: null,
        }
    ]

    if(data)
        if(data.length > 0) {
            bifcs = []

            data.forEach((bifc) => {
                bifcs.push({bifcid: bifc.id, name: bifc.name, address: bifc.address, nature: bifc.nature, date: new Date(bifc.date) })
            })
        }

    return bifcs
}

const getRelative = (data: Array<any>) => {
    let relatives = [
        {
            relativeid: null,
            name: "",
            relationship: "",
            position: "",
            agencyandaddress: "",
        }
    ]

    if(data)
        if(data.length > 0) {
            relatives = []

            data.forEach((relative) => {
                relatives.push({
                    relativeid: relative.id,
                    name: relative.name,
                    relationship: relative.relationship,
                    position: relative.position,
                    agencyandaddress: relative.agency_address,
                })
            })
        }

    return relatives
}

export {
    getSpouse,
    getChildren,
    getRealProperties,
    getLiabilities,
    getBiFc,
    getRelative,
}
