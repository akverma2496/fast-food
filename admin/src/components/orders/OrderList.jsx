import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { db } from "../../firebase.config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { toast } from "react-toastify";
import OrderDetails from "./OrderDetails";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statuses = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(orderData)
      setOrders(orderData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast.success("Order status updated!");
      fetchOrders(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <div>
      <h3 className="mb-4">Orders</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id}>
                <td>{idx + 1}</td>
                <td>{order.id}</td>
                <td>
                  <ul className="mb-0">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleView(order)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <OrderDetails
        show={showDetails}
        handleClose={() => setShowDetails(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderList;
