import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../config/api";
import { translateApiError } from "../../utils/apiErrorHandler";
import { toast } from "react-hot-toast";

/**
 * Request password reset email
 * Endpoint: POST /api/v1/user/password/reset/request
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await userApi.post("/password/reset/request", { email });
      return data;
    },
    onSuccess: () => {
      toast.success(
        "Το email επαναφοράς κωδικού στάλθηκε. Έλεγξε τα εισερχόμενά σου."
      );
    },
    onError: (err) => {
      toast.error(
        translateApiError(
          err,
          "auth",
          "Αποτυχία αποστολής email επαναφοράς κωδικού."
        )
      );
    },
  });
};

/**
 * Validate password reset token
 * Endpoint: POST /api/v1/user/password/reset/validate/token
 */
export const useValidateResetToken = () => {
  return useMutation({
    mutationFn: async (token) => {
      const { data } = await userApi.post("/password/reset/validate/token", {
        token,
      });
      return data;
    },
    onError: (err) => {
      toast.error(
        translateApiError(err, "auth", "Μη έγκυρο ή ληγμένο token.")
      );
    },
  });
};

/**
 * Reset password with token
 * Endpoint: POST /api/v1/user/password/reset
 */
export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await userApi.post("/password/reset", {
        token,
        password,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Ο κωδικός επαναφέρθηκε επιτυχώς.");
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      toast.error(
        translateApiError(err, "auth", "Αποτυχία επαναφοράς κωδικού.")
      );
    },
  });
};

