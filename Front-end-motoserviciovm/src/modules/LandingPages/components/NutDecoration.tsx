import { Settings } from "lucide-react";


const NutDecoration = ({ size = 20, className = "" }) => (
  <Settings
    size={size} 
    className={`inline-block text-yellow-500 dark:text-yellow-400 ${className}`} 
    style={{ strokeWidth: 3 }}
  />
);    

export default NutDecoration;