import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        // Log the submitted form values
        console.log("Form submitted with values:", values);

        // Get the token from localStorage (check if it exists)
        const token = localStorage.getItem("token");
        console.log("Token retrieved from localStorage:", token);

        // If no token is found, handle accordingly (you could also add a warning)
        if (!token) {
          alert("No token found. Please login again.");
          return;
        }

        // Log the request URL and headers for the login request
        console.log("Sending request to login API...");
        const response = await axios.post(
          "http://localhost:3000/api/users/login",
          values,
          {
            withCredentials: true, // Ensure credentials (cookies) are included if needed
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token to headers
            },
          }
        );

        // Log the response data
        console.log("Login successful. Response data:", response.data);

        alert("Login successful!");
        navigate("/dashboard");
      } catch (error) {
        if (error.response) {
          // Log the error response
          console.log("Error response:", error.response);
          alert(error.response.data.message || "Login failed");
        } else {
          // Log network or other errors
          console.log("Error message:", error.message);
          alert("An error occurred. Please try again.");
        }
      }
    },
  });

  return (
    <div className="h-screen flex">
      <div
        className="hidden lg:flex w-full lg:w-1/2 justify-around items-center"
        style={{
          background: `linear-gradient(rgba(2,2,2,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1650825556125-060e52d40bd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
          <h1 className="text-white font-bold text-4xl font-sans">
            Simple App
          </h1>
          <p className="text-white mt-1">The simplest app to use</p>
          <a
            href="#"
            className="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-indigo-800 mt-4 px-4 py-2 rounded-2xl font-bold"
          >
            Get Started
          </a>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-md shadow-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            Hello Again!
          </h1>
          <p className="text-sm text-gray-600 mb-8">Welcome Back</p>

          <div className="flex flex-col space-y-4">
            <div>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email Address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Login
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Don't have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
