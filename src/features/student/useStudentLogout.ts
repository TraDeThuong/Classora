import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/apiAuth";

export function useStudentLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutStudent, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });

  return { isPending, logoutStudent };
}
