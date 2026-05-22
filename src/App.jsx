import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  });

  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  function addCustomer() {
    if (name.trim() === "" || email.trim() === "") {
      alert("Please enter name and email");
      return;
    }

    const newCustomer = {
      name: name,
      email: email,
    };

    if (editIndex === null) {
      setCustomers([...customers, newCustomer]);
    } else {
      const updatedCustomers = customers.map((customer, index) => {
        if (index === editIndex) {
          return newCustomer;
        } else {
          return customer;
        }
      });

      setCustomers(updatedCustomers);
      setEditIndex(null);
    }

    setName("");
    setEmail("");
  }

  function deleteCustomer(indexToDelete) {
    const updatedCustomers = customers.filter((customer, index) => {
      return index !== indexToDelete;
    });

    setCustomers(updatedCustomers);
  }

  function editCustomer(indexToEdit) {
    setName(customers[indexToEdit].name);
    setEmail(customers[indexToEdit].email);
    setEditIndex(indexToEdit);
  }

  const filteredCustomers = customers
    .map((customer, index) => ({
      ...customer,
      originalIndex: index,
    }))
    .filter((customer) => {
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
        {editIndex === null ? "Add Customer" : "Update Customer"}
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
            <li key={customer.originalIndex}>
              <span>
                <strong>{customer.name}</strong> - {customer.email}
              </span>

              <div>
                <button onClick={() => editCustomer(customer.originalIndex)}>
                  Edit
                </button>
                <button onClick={() => deleteCustomer(customer.originalIndex)}>
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