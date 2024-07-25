import { formatDataAsTable } from "@components/utils";
import Card from "@components/cards/Card";

interface Props {
    title: string;
    description: string;
    imagePath?: string;
    data?: object;
}

function ImageCard ({ title, description, imagePath=undefined, data=undefined }: Props) {
  return (
      <Card>
          <>
              {imagePath && <img src={imagePath} className="card-img-top" alt={title}/>}
              <div className="card-body">
                  <h2 className="card-title">{title}</h2>
                  <p className="card-text center">{description}</p>
                  {
                      data && formatDataAsTable(data)
                  }
              </div>
          </>
      </Card>
  )
}

export default ImageCard;
