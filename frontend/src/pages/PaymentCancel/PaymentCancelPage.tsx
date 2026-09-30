import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

export default function PaymentCancelPage() {
  return (
    <MainLayout>
      <Container>
        <div
          className="
            py-20
            text-center
          "
        >
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Payment Cancelled
          </h1>

          <p
            className="
              mt-4
              text-slate-500
            "
          >
            Your payment was not completed.
          </p>
        </div>
      </Container>
    </MainLayout>
  );
}