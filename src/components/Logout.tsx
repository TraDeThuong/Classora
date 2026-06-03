
import { HiArrowRightOnRectangle } from "react-icons/hi2"
import ButtonIcon from "./ButtonIcon"
import { MiniSpinner } from "./MiniSpinner"
import { useLogout } from "../features/authentication/useLogout"

export default function Logout() {

    const {logout, isPending: isLoadingOut} = useLogout ()
  return (
    <ButtonIcon
        disabled = {isLoadingOut}
        onClick={logout}>

      {isLoadingOut ? <MiniSpinner/> :<HiArrowRightOnRectangle/>}
    </ButtonIcon>
  )
}
