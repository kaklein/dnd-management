import { ReactElement } from "react";

interface Props {
  version: string;
  releaseDate: string;
  releaseNotes?: ReactElement;
}

function ReleaseNote({version, releaseDate, releaseNotes}: Props) {
  return (
    <div className="row release-notes-row">
      <div className="col-2">
        {version}
      </div>
      <div className="col-2">
        {new Date(releaseDate).toISOString().substring(0,10)}
      </div>
      <div className="col-8">
        {releaseNotes}
      </div>
    </div>
  )
}

export default ReleaseNote;