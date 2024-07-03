const replaceBooleans = (data: object) => {
    const entries = Object.entries(data);
    for (const entry of entries) {
        if(typeof entry[1] === "boolean") {
            entry[1] = entry[1] ? "true" : "false"
        }
    }
    return entries;
}

export const formatDataAsTable = (data: object, highlightNonZeroes=false, plusNonZeroes=false) => {
    const entries = replaceBooleans(data);

    return (
        <table className="table">
            <tbody>
                {
                    entries.map((entry) => (
                        <tr className={highlightNonZeroes && entry[1] > 0 ? 'table-success' : 'table'}>
                            <td>{ entry[0].toUpperCase() + ':' }</td>
                            <td>{ (entry [1] > 0 && plusNonZeroes) && '+'}{entry[1]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export const removeWhiteSpaceAndConvertToLowerCase = (s: string) => {
    return s.replace(/\s/g, '').toLowerCase();
}
