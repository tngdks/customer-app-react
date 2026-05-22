import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:3000/customers";

  useEffect(() => {
    fetchCustomers();
  }, []);

  function fetchCustomers() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log("Error fetching customers:", error));
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function addCustomer() {
    if (name.trim() === "" || email.trim() === "") {
      alert("Please enter name and email");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const customerData = {
      name: name,
      email: email,
    };

    if (editId === null) {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchCustomers();
          setName("");
          setEmail("");
        })
        .catch((error) => console.log("Error adding customer:", error));
    } else {
      fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchCustomers();
          setName("");
          setEmail("");
          setEditId(null);
        })
        .catch((error) => console.log("Error updating customer:", error));
    }
  }

  function deleteCustomer(id) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => fetchCustomers())
      .catch((error) => console.log("Error deleting customer:", error));
  }

  function editCustomer(customer) {
    setName(customer.name);
    setEmail(customer.email);
    setEditId(customer.id);
  }

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h1>Customer App</h1>

      <input
        type="text"
        placeholder="Enter customer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter customer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={addCustomer}>
        {editId === null ? "Add Customer" : "Update Customer"}
      </button>

      <div className="preview">
        <h3>Customer Preview</h3>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Customer List</h3>

      {customers.length === 0 ? (
        <p>No customers added</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No matching customers found</p>
      ) : (
        <ul>
          {filteredCustomers.map((customer) => (
            <li key={customer.id}>
              <span>
                <strong>{customer.name}</strong> - {customer.email}
              </span>

              <div>
                <button onClick={() => editCustomer(customer)}>Edit</button>
                <button onClick={() => deleteCustomer(customer.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;