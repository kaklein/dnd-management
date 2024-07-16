interface Props {
  value: any;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  setFormData: (data: any) => void;
  name: string;
  options: { text: string, value: string }[];
  required?: boolean;
}

function FormSelect ({value, handleChange, setFormData, name, options, required=false}: Props) {
 
  return (
    <select
      className="form-input"
      id={name}
      name={name}
      onChange={(event) => {handleChange(event, setFormData)}}
      required={required}
      value={value}
    >
      <option value="" key="blank-option">-- Select --</option>
      {options.map((option, i) => (
        <option value={option.value} key={i}>{option.text}</option>
      ))}
    </select>
  )
}

export default FormSelect;