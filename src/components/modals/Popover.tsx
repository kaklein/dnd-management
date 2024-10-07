import { OverlayTrigger, Popover as RBPopover } from 'react-bootstrap';


interface Props {
  children: JSX.Element;
  popoverHeader?: string;
  popoverBody: JSX.Element;
  fitContent?: boolean;
  marginAuto?: boolean;
  placement?: "top" | "bottom" | "left" | "right"
  customClass?: string;
}

function Popover ({children, popoverHeader, popoverBody, fitContent=false, marginAuto=false, placement="top", customClass=undefined}: Props) {
  const popoverTop = <RBPopover
    id="popover-basic"
    placement={placement}
    title={popoverHeader ?? ''}
  >
    {popoverBody}
  </RBPopover>;

  return (
    <OverlayTrigger trigger={["hover", "focus"]} placement={placement} overlay={popoverTop} delay={100}>
      <div className={`popover-main-content ${fitContent ? 'fit-content' : undefined} ${marginAuto ? 'margin-auto' : undefined} ${customClass ?? undefined}`}>
        {children}
      </div>
    </OverlayTrigger>
  )
}

export default Popover;