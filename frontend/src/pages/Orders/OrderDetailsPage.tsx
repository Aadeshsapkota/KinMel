import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteOrder } from "../../services/orderService";
import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import { createReturnRequest } from "../../services/returnService";
import { getOrderById, cancelOrder } from "../../services/orderService";

import type { OrderDetails, OrderItem } from "../../types/orderDetails";

function getTrackingStep(status: string) {
  switch (status) {
    case "Pending":
      return 1;

    case "Assigned":
      return 2;

    case "OutForDelivery":
      return 3;

    case "Delivered":
      return 4;

    case "ReturnRequested":
      return 5;

    case "Returned":
      return 5;

    case "Cancelled":
      return 0;

    default:
      return 1;
  }
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const currentStep = order ? getTrackingStep(order.status) : 1;

  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setLoading(false);

        return;
      }

      const orderId = Number(id);

      if (Number.isNaN(orderId)) {
        setLoading(false);

        return;
      }

      try {
        const data = await getOrderById(orderId);

        setOrder(data);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  async function handleReturnRequest(productId: number) {
    if (!order) return;

    const reason = window.prompt("Why are you returning this product?");

    if (!reason) return;

    try {
      await createReturnRequest(order.id, productId, reason);

      toast.success("Return request submitted for review");
    } catch {
      toast.error("Return request already exists");
    }
  }

  async function handleDelete() {
    if (!order) return;

    if (!window.confirm("Delete this delivered order?")) {
      return;
    }

    try {
      await deleteOrder(order.id);

      toast.success("Order deleted");

      navigate("/orders");
    } catch {
      toast.error("Failed to delete order");
    }
  }

  async function handleCancel() {
    if (!order) return;

    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await cancelOrder(order.id);
      toast.success("Order cancelled");
      setOrder({ ...order, status: "Cancelled" });
    } catch {
      toast.error("Failed to cancel order");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Loading...</div>
        </Container>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Order not found.</div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div
          className="
            py-20
            max-w-5xl
            mx-auto
          "
        >
          <Link
            to="/orders"
            className="
              text-emerald-600
              hover:underline
            "
          >
            ← Back to Orders
          </Link>

          <h1
            className="
              text-4xl
              font-bold
              mt-6
              mb-8
            "
          >
            Order #{order.id}
          </h1>

          <div
            className="
    rounded-3xl
    border
    p-6
    mb-6
  "
          >
            <h2
              className="
      text-2xl
      font-semibold
      mb-6
    "
            >
              Order Tracking
            </h2>

            {order.status === "Cancelled" ? (
              <div className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200">
                <span className="font-bold">This order has been cancelled.</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
              {[
                "Order Placed",
                "Assigned",
                "Out For Delivery",
                "Delivered",
                ...(order.status === "ReturnRequested" || order.status === "Returned" ? ["Return"] : []),
              ].map((step, index) => {
                const completed = index + 1 <= currentStep;

                return (
                  <div
                    key={step}
                    className="
            flex
            flex-col
            items-center
            flex-1
          "
                  >
                    <div
                      className={`
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              font-bold
              ${
                completed
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }
            `}
                    >
                      {index + 1}
                    </div>

                    <p
                      className="
              mt-2
              text-sm
              text-center
            "
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
            )}
          </div>

          <div
            className="
              rounded-3xl
              border
              p-6
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Order Information
            </h2>

            <p>
              <strong>Status:</strong>{" "}
              {order.status === "OutForDelivery"
                ? "Out for Delivery"
                : order.status === "ReturnRequested"
                ? "Return Requested"
                : order.status}
            </p>

            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>

            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>

            <p>
              <strong>Total:</strong> रु {order.totalAmount}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdDate).toLocaleString()}
            </p>
          </div>

          <div
            className="
              rounded-3xl
              border
              p-6
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Shipping Address
            </h2>

            <p>{order.fullName}</p>

            <p>{order.phoneNumber}</p>

            <p>{order.addressLine1}</p>

            {order.addressLine2 && <p>{order.addressLine2}</p>}

            <p>
              {order.city}, {order.state}
            </p>

            <p>{order.country}</p>

            <p>{order.postalCode}</p>
          </div>

          <div
            className="
              rounded-3xl
              border
              p-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Products
            </h2>

            {order.items.map((item: OrderItem) => (
              <div
                key={`${item.productId}-${item.quantity}`}
                className="
                    flex
                    justify-between
                    items-center
                    border-b
                    py-4
                  "
              >
                <div>
                  <div
                    className="
                        font-medium
                      "
                  >
                    {item.productName}
                  </div>

                  <div
                    className="
                        text-sm
                        text-slate-500
                      "
                  >
                    Quantity: {item.quantity}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="
      font-semibold
    "
                  >
                    रु {item.price}
                  </div>

                  {order.status === "Delivered" && (
                    <button
                      onClick={() => handleReturnRequest(item.productId)}
                      className="
        mt-2
        text-sm
        text-red-600
        hover:underline
      "
                    >
                      Request Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {order.status === "Delivered" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelete}
                className="
        rounded-xl
        bg-red-600
        px-5
        py-3
        font-medium
        text-white
        hover:bg-red-700
      "
              >
                Delete Order
              </button>
            </div>
          )}

          {(order.status === "Pending" || order.status === "Assigned") && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCancel}
                className="
        rounded-xl
        bg-slate-200
        text-slate-700
        px-5
        py-3
        font-medium
        hover:bg-slate-300
      "
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
