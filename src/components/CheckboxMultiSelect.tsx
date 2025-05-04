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
        return formData[formDataFieldName].map((i: any) => i.fieldName).indexOf(fieldName);
    };

    const isChecked = (fieldName: string): boolean => {
        return formData[formDataFieldName][getOptionIndex(fieldName)].value;
    }

    const options: Option[] = formData[formDataFieldName];

    return <div>
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