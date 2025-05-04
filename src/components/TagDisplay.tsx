import { FeatureTag } from "@models/playerCharacter/Feature";

interface Props {
    tags: FeatureTag[];
}

function TagDisplay ({ tags }: Props) {
    return <div className="tag-display">
        {
            tags.map((tag, i) => (
                <span key={i} className={`tag-${tag.fieldName}`}>
                    {tag.displayName}
                </span>
            ))
        }        
    </div>
    
}

export default TagDisplay;