import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Navbar from "@components/Navbar";
import { getAuth } from "@firebase/auth";
import { QueryClient } from "@tanstack/react-query";
import { query } from "firebase/firestore";

const writeNStrings = (s: string, n: number) => {
  return Array(n + 1).join(s);
}

interface Props {
  queryClient: QueryClient;
}

function VerifyEmail ({queryClient}: Props) {
  const email = getAuth().currentUser?.email;
  if(!email) throw Error('No logged in user email found.');
  const splitEmail = email.split('@');
  const asterisks = writeNStrings('*', Math.max(splitEmail[0].length - 5, 0));
  const redactedEmail = `${splitEmail[0].substring(0,5)}${asterisks}@${splitEmail[1]}`
  return (
    <>
      <Navbar isSelectedPc={false}/>
      <PageHeaderBar 
        pageName="Please verify your email"
      />
      <Card>
        <p className="center">
          Find the welcome email sent to you at 
          <span className="populated-field"> {redactedEmail} </span>
          and click the link to verify your address.
        </p>
        <br/>
        <p className="center">
          Once verified, return to this page. If it does not automatically refresh, click the button below to continue to the site.
        </p>
        <div className="d-flex justify-content-center">
          <Button
            buttonType={ButtonType.INFO}
            onClick={() => {
              queryClient.refetchQueries({queryKey: ['isVerifiedUser']});
              getAuth().currentUser?.reload();
              const verified = getAuth().currentUser?.emailVerified;
              if (verified) {
                location.reload();
              } else {
                alert("Verification not detected. Please ensure you've verified your email and try again.");
              }
            }}
            text="I verified my email!"
          />
        </div> 
      </Card>
    </>
  )
}

export default VerifyEmail;