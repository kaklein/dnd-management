interface Option {
    fieldName: string;
    displayName: string;
    value: boolean;
}

interface Props {
    formData: any;
    setFormData: (update: any) => void;
    formDataFieldName: string;
}

function CheckboxMultiSelect ({ formData, setFormData, formDataFieldName }: Props) {    
    const getOptionIndex = (fieldName: string): number => {
        return formData[formDataFieldName].map((i: any) => i.fieldName).indexOf(fieldName) ?? -1;
    };

    const isChecked = (fieldName: string): boolean => {
        if (getOptionIndex(fieldName) < 0) return false;
        return formData[formDataFieldName][getOptionIndex(fieldName)].value;
    }

    const options: Option[] = formData[formDataFieldName] ?? [];

    if (options.length > 1) return <div className="checkbox-multiselect">
        {
            options.map((opt, i) => (
                <div key={i}>
                <input
                    type="checkbox"
                    id={opt.fieldName}
                    name={opt.fieldName}
                    checked={isChecked(opt.fieldName)}
                    onChange={() => {
                        const optionIndex = getOptionIndex(opt.fieldName)
                        const newVal = !(formData[formDataFieldName][optionIndex].value);
                        options[optionIndex] = {
                            ...options[optionIndex],
                            value: newVal
                        }
                        setFormData({
                            ...formData,
                            [formDataFieldName]: options
                        });
                    }}
                />
                <label htmlFor={opt.fieldName}>{opt.displayName}</label>
                </div>
            ))
        }
    </div>
}

export default CheckboxMultiSelect;