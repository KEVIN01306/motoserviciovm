type DynamicLogoProps = {
  text: string;
  logoColors?: string[];
};

const DynamicLogo = ({ 
  text, 
  logoColors = ['', 'text-red-600'] 
}: DynamicLogoProps) => {
  const words = text.split(' ').filter(Boolean);
  
  return (
    <>
      {words.map((word, index) => {
        const colorClass = logoColors[index % logoColors.length];
        return (
          <span
            key={index}
            className={`${colorClass} transition-colors group-hover:text-zinc-900 dark:group-hover:text-white`}
          >
            {word}
            {index < words.length - 1 && ' '}
          </span>
        );
      })}
    </>
  );
};

export default DynamicLogo;
