interface Props {
  value: any;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  setFormData: (data: any) => void;
  name: string;
  options: { text: string, value: string }[];
  required?: boolean;
  className?: string;
}

function FormSelect ({value, handleChange, setFormData, name, options, required=false, className="form-input"}: Props) {
 
  return (
    <select
      className={className}
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