interface Props {
    text: string
    onClick: () => void,
    buttonType?: ButtonType;
    type?: "submit" | "reset" | "button";
    disabled?: boolean;
    customClass?: string;
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

const Button = ({text, onClick, buttonType=ButtonType.PRIMARY, type=undefined, disabled=false, customClass=undefined}: Props) => {
    const buttonTypeClassName = `btn-${buttonType} ${customClass}`;
    return (
        <div>
            <button className={`btn ${buttonTypeClassName}`} type={type ?? undefined} disabled={disabled} onClick={() => {onClick()}}>{text}</button>
        </div>
    );
}

export default Button
