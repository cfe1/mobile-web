import React from "react";
import Button from "@material-ui/core/Button";
import pdf from "../../assets/icons/pdf-big.svg";
import doc from "../../assets/icons/doc.svg";
import img from "../../assets/icons/img.svg";

var icon ;
const fileTypeHandler=(type, link)=>{
  if(type==="jpg"|| type==="png"|| type==="jpeg"){
  icon= <img src={link} alt="icon" style={{height:25,width:25, borderRadius:5}}/>
  }
  else if(type==="pdf"){
  icon= <img src={pdf} alt="icon"  style={{height:25,width:25}}/>
  }
  else if (type==="doc" || type==="docx"){
  icon= <img src={doc} alt="icon"  style={{height:25,width:25}}/>
  }
}


const FileButton = ({ onClick,fileName, link, thumbnail, type }) => {
  if(!thumbnail){
    thumbnail= link
  }
  fileTypeHandler(type,thumbnail)
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" download className="anchor">
    <Button onClick={onClick} className="file-btn" variant="contained" style={{boxShadow:"none", marginRight:10, marginBottom:10, display:"flex", justifyContent:"space-around", alignItems:"center"}}>
    {icon} {fileName}
    </Button>
    </a>
    
  );
};

export default FileButton;