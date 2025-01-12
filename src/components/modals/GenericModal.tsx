import { ReactElement } from "react";

interface Props {
    modalName: string;
    title?: string;
    onClose?: () => any;
    modalBody?: ReactElement;
    modalFooter?: ReactElement;
    modalFooterAsButton?: boolean;
    customClass?: string;
}

function GenericModal ({modalName, title=undefined, onClose=() => {}, modalBody=undefined, modalFooter=undefined, modalFooterAsButton=true, customClass=undefined}: Props) {
    const className=`modal fade ${customClass}`
    
    return (
        <div className={className} id={`${modalName}Modal`} autoFocus={false} tabIndex={-1} aria-labelledby={`${modalName}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`${modalName}Label`}>{title}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    
                    {/* BODY (if any) */}
                    {
                        modalBody &&
                        <div className="modal-body">
                            {modalBody}
                        </div> 
                    }
            
                    {/* FOOTER (if any) */}
                    {
                        modalFooter &&
                        <div className={`modal-footer${modalFooterAsButton ? " modal-button-wide" : ""}`}>
                            {modalFooter}
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default GenericModal;