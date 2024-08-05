import Alert from "./Alert";

interface Props {
  alertText?: string;
}

function SuccessAlert({alertText=undefined}: Props) {
  return (
    <Alert
      alertText={alertText != undefined ? alertText : "Save successful."}
      className="successful-alert"
      iconFile="/images/icons/success-icon.png"
    />
  )
}

export default SuccessAlert;