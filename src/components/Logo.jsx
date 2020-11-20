import logoImage from "../img/logo.png"
import { CURRENT_VIEW } from "../const"
import { useContext } from "react";
import AppContext from "../context/AppContext";

export default function Logo() {
  const { currentViewDispatch } = useContext(AppContext);
  const onClick = () => {
    currentViewDispatch(CURRENT_VIEW.HOME)
  }
  return (
    <img className="logo" src={logoImage} alt="logo" onClick={onClick} />
  )
}