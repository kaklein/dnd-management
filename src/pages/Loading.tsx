import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Navbar from "@components/Navbar";

function Loading () {
  return (
    <>
        <Navbar isSelectedPc={false}/>
        <PageHeaderBar 
          pageName="Loading..."
        />
    </>
  )
}

export default Loading;