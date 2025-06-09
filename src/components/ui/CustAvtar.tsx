import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface CustAvtarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackText?: string;
}

const CustAvtar: React.FC<CustAvtarProps> = ({
  src,
  alt,
  className,
  fallbackText,
}) => {
  const defaultFallback = fallbackText || "UN"; // UN untuk unknown tapi idealnya inisial dari nama user
  return (
    <div>
      <Avatar>
        {src && <AvatarImage src={src} alt={alt || "Avatar"} />}
        <AvatarFallback className="border-2 border-arkBlue-500/60 bg-arkBlue-50 text-muted-foreground font-semibold ">
          {defaultFallback}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CustAvtar;
