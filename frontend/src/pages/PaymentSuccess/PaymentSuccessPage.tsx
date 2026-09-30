import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { api } from "../../api/axios";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    async function confirmPayment() {
      const data =
        searchParams.get(
          "data"
        );

      if (!data) {
        toast.error(
          "Missing payment data"
        );

        navigate("/");
        return;
      }

      let transactionUuid: string;

      try {
        const decoded = JSON.parse(
          atob(data)
        );

        transactionUuid =
          decoded.transaction_uuid;
      } catch {
        toast.error(
          "Invalid payment data"
        );

        navigate("/");
        return;
      }

      if (!transactionUuid) {
        toast.error(
          "Missing transaction id"
        );

        navigate("/");
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const confirmed = await api.post<boolean>(
          `/payments/confirm/${transactionUuid}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (!confirmed.data) {
          toast.error(
            "Payment could not be verified"
          );

          navigate("/");
          return;
        }

        toast.success(
          "Payment successful"
        );

        navigate("/orders");
      } catch {
        toast.error(
          "Failed to confirm payment"
        );

        navigate("/");
      }
    }

    confirmPayment();
  }, [navigate, searchParams]);

  return (
    <MainLayout>
      <Container>
        <div
          className="
            py-20
            text-center
          "
        >
          Processing payment...
        </div>
      </Container>
    </MainLayout>
  );
}