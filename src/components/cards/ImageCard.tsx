import { formatDataAsTable } from "../utils";
import Card from "./Card";

interface Props {
    title: string;
    description: string;
    imagePath: string;
    data?: object;
}

function ImageCard ({ title, description, imagePath, data=undefined }: Props) {
  return (
      <Card>
          <>
              <img src={imagePath} className="card-img-top" alt={title}/>
              <div className="card-body">
                  <h2 className="card-title">{title}</h2>
                  <p className="card-text">{description}</p>
                  {
                      data && formatDataAsTable(data)
                  }
              </div>
          </>
      </Card>
  )
}

export default ImageCard;
