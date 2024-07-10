interface Props {
  alertText: string;
  className: string;
  iconFile?: string;
}

function Alert ({alertText, className, iconFile}: Props) {
  return (
    <div className={`${className} alert-div`}>
      {iconFile && <img className="inline" src={iconFile} width="20px"/> } {alertText}
    </div>
  )
}

export default Alert;