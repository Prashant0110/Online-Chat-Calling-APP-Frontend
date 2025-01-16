import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "", // Ensure initial value is an empty string
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Sign-up data submitted:", values);

      try {
        // Send the signup data to the backend
        const response = await axios.post(
          "http://localhost:3000/api/users/register",
          {
            username: values.username,
            email: values.email,
            password: values.password,
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Registration successful and token stored!");

          // Navigate to login page
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "Error during registration:",
          error.response ? error.response.data : error.message
        );
      }
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-md shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-gray-800 font-bold text-2xl mb-1">
          Create Account
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Join us and start your journey!
        </p>

        <div className="flex flex-col space-y-4">
          <div>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username} // Ensure it's controlled
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            ) : null}
          </div>

          <div>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email} // Ensure it's controlled
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
              value={formik.values.password} // Ensure it's controlled
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
