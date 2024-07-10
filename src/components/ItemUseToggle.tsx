import { useState } from "react";
import { removeWhiteSpaceAndConvertToLowerCase } from "./utils";

interface ItemUseToggleProps {
    itemLabel: string;
    formDataName: string;
    maxUses: number;
    currentUses: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}



function ItemUseToggle({ formDataName, itemLabel, maxUses, currentUses, onChange }: ItemUseToggleProps) {
  const formattedLabel = removeWhiteSpaceAndConvertToLowerCase(itemLabel);

  const [localCurrentUses, setCurrentUses] = useState(currentUses);

  // checked = 'used', e.g. if there are 3 max uses and 2 current uses, there is one 'used' and therefore one checked
  const amountChecked = maxUses - localCurrentUses;
  const isChecked = (index: number) => {
      return !(index >= amountChecked);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update currentUses
    // if checked, currentUses -= 1
    // if unchecked, currentUses += 1
    let updatedCurrentUses;
    if (event.target.checked) {
        updatedCurrentUses = localCurrentUses - 1;
    } else {
        updatedCurrentUses = localCurrentUses + 1;
    }
    setCurrentUses(updatedCurrentUses);
    event.target.name = formDataName;
    event.target.value = String(updatedCurrentUses);
    onChange(event);
  }

  return (
      <div className="d-flex flex-row form-check toggle">
          <div>
          {
              // @ts-ignore: placeholder var e needs to be there to allow index access but is unused
              [...Array(maxUses)].map((e, i) =>
                  <div className="form-check form-check-inline toggle-check" key={`${formattedLabel}-toggle-${i}`}>
                      <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`${formattedLabel}-checkbox-${i}`} 
                          value={`${formattedLabel}-option-${i}`} 
                          checked={isChecked(i)}
                          onChange={handleChange}
                      />
                  </div>
              )
          }
          </div>
      </div>
  )
}

export default ItemUseToggle;