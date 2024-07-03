export const formatDataAsTable = (data: object, highlightNonZeroes=false, plusNonZeroes=false) => {
    const entries = Object.entries(data);

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
