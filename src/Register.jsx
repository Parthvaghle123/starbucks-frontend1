import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Signup.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    country_code: "+91",
    gender: "",
    dob: "",
    address: "",
  });

  const [password, setPassword] = useState("");
  const [strengthMessage, setStrengthMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  // ===============================
  // HANDLE CHANGE (REAL-TIME)
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // PHONE
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setForm((prev) => ({ ...prev, phone: value }));
        setErrors((prev) => ({
          ...prev,
          phone: value.length !== 10 ? "Phone must be exactly 10 digits." : "",
        }));
      }
    }

    // USERNAME
    else if (name === "username") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, username: value }));
        setErrors((prev) => ({
          ...prev,
          username:
            value.length < 3
              ? "Username must be at least 3 characters."
              : "",
        }));
      }
    }

    // EMAIL (REAL-TIME @gmail.com)
    else if (name === "email") {
      setForm((prev) => ({ ...prev, email: value }));
      setErrors((prev) => ({
        ...prev,
        email:
          value === ""
            ? "Email is required."
            : !gmailRegex.test(value)
            ? "Only valid @gmail.com email allowed."
            : "",
      }));
    }

    // GENDER
    else if (name === "gender") {
      setForm((prev) => ({ ...prev, gender: value }));
      setErrors((prev) => ({ ...prev, gender: "" }));
    }

    // DOB
    else if (name === "dob") {
      setForm((prev) => ({ ...prev, dob: value }));

      const today = new Date();
      const dobDate = new Date(value);
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;

      setErrors((prev) => ({
        ...prev,
        dob: age < 14 ? "You must be at least 14 years old." : "",
      }));
    }

    // ADDRESS
    else if (name === "address") {
      setForm((prev) => ({ ...prev, address: value }));
      setErrors((prev) => ({
        ...prev,
        address:
          value.length < 5
            ? "Address must be at least 5 characters."
            : "",
      }));
    }
  };

  // ===============================
  // PASSWORD REAL-TIME
  // ===============================
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (value.length < 4) {
      setStrengthMessage("Weak password ❌");
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char.",
      }));
    } else if (passwordRegex.test(value)) {
      setStrengthMessage("Strong password ✅");
      setErrors((prev) => ({ ...prev, password: "" }));
    } else {
      setStrengthMessage("Moderate password ⚠️");
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char.",
      }));
    }
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err !== "")) return;

    axios
      .post("https://starbucks-backend1.onrender.com/register", {
        ...form,
        password,
      })
      .then((res) => {
        if (res.data.success) {
          setToastMessage("Registration successful ✅");
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
          setTimeout(() => navigate("/login"), 1000);
        }
      })
      .catch(() => {
        setErrorMessage("User Already Exists.");
      });
  };

  return (
    <>
      {showSuccessToast && (
        <div className="toast-popup bg-success">{toastMessage}</div>
      )}

      <div className="body">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="signup-container bg-white p-4 shadow">
            <h2 className="text-success text-center mb-3 h2">Sign-Up</h2>
            <hr />

            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* USERNAME */}
              <input
                className="form-control mb-1"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
              <small className="text-danger">{errors.username}</small>

              {/* EMAIL */}
              <input
                className="form-control mt-2 mb-1"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
              <small className="text-danger">{errors.email}</small>

              {/* PHONE */}
              <input
                className="form-control mt-2 mb-1"
                name="phone"
                placeholder="1234567890"
                value={form.phone}
                onChange={handleChange}
              />
              <small className="text-danger">{errors.phone}</small>

              {/* GENDER */}
              <select
                className="form-select mt-2"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <small className="text-danger">{errors.gender}</small>

              {/* ADDRESS */}
              <textarea
                className="form-control mt-2"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />
              <small className="text-danger">{errors.address}</small>

              {/* DOB */}
              <input
                type="date"
                className="form-control mt-2"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              <small className="text-danger">{errors.dob}</small>

              {/* PASSWORD */}
              <input
                type="password"
                className="form-control mt-2"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <small className="text-muted">{strengthMessage}</small>
              <small className="text-danger d-block">{errors.password}</small>

              <button
                type="submit"
                className="btn7 fw-bold w-100 rounded mt-3"
                disabled={Object.values(errors).some((e) => e !== "")}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
