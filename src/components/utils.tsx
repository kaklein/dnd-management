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

export const formatFormData = (formData: any) => {
    return { 
        'usableResources.hitPoints.current': Number(formData.hitPointsCurrent),
        'usableResources.hitPoints.temporary': Number(formData.hitPointsTemporary),
        'usableResources.hitDice.current': Number(formData.hitDiceCurrent),
        'usableResources.deathSaves.successesRemaining': Number(formData.deathSavesSuccesses),
        'usableResources.deathSaves.failuresRemaining': Number(formData.deathSavesFailures),
        'usableResources.gold': Number(formData.gold),
        'usableResources.inspiration': Number(formData.inspiration),
        // spell slots - separate collection?
        // features - separate collection?
    };
}
