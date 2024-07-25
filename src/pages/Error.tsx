import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Navbar from "@components/Navbar";

interface Props {
  errorMessage: string;
  text?: string
}

function Error ({errorMessage, text}: Props) {
  return (
    <>
      <Navbar isSelectedPc={false}/>
        <PageHeaderBar 
          pageName={errorMessage}
        />
        {
          text &&
          <>
            <p></p>
            <Card>
              <p className="center">{text}</p>
            </Card>
          </>
        }
        
    </>
  )
}

export default Error;