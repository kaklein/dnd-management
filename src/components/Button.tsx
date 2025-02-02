interface Props {
    text: string
    onClick: () => void,
    buttonType?: ButtonType;
    type?: "submit" | "reset" | "button";
    disabled?: boolean;
    customClass?: string;
    modalDismiss?: boolean;
}

export enum ButtonType {
    'PRIMARY'= 'primary',
    'SECONDARY' = 'secondary',
    'SUCCESS' = 'success',
    'CUSTOM_GREEN' = 'success btn-custom-green',
    'DANGER' = 'danger',
    'WARNING' = 'warning',
    'INFO' = 'info',
    'LIGHT' = 'light',
    'DARK' = 'dark',
    'LINK' = 'link'
}

const Button = ({text, onClick, buttonType=ButtonType.PRIMARY, type=undefined, disabled=false, customClass=undefined, modalDismiss=false}: Props) => {
    const buttonTypeClassName = `btn-${buttonType} ${customClass}`;
    return (
        <div>
            <button
                className={`btn ${buttonTypeClassName}`}
                type={type ?? "button"}
                disabled={disabled}
                onClick={() => {onClick()}}
                data-bs-dismiss={modalDismiss ? "modal" : null}
            >
            {text}
            </button>
        </div>
    );
}

export default Button
