interface Props {
    text: string
    onClick: () => void,
    buttonType?: ButtonType;

}

export enum ButtonType {
    'PRIMARY'= 'primary',
    'SECONDARY' = 'secondary',
    'SUCCESS' = 'success',
    'DANGER' = 'danger',
    'WARNING' = 'warning',
    'INFO' = 'info',
    'LIGHT' = 'light',
    'DARK' = 'dark',
    'LINK' = 'link'
}

const Button = ({text, onClick, buttonType=ButtonType.PRIMARY}: Props) => {
    const buttonTypeClassName = `btn-${buttonType}`;
    return (
        <div>
            <button className={`btn ${buttonTypeClassName}`} onClick={() => {onClick()}}>{text}</button>
        </div>
    );
}

export default Button
