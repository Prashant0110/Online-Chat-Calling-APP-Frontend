import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState(null);

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  // Handle form submission
  const handleRegister = (values) => {
    dispatch(registerUser(values))
      .then(() => {
        // Redirect or show success message
      })
      .catch((err) => {
        setFormError(err.message); // Set error message
      });
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <Field
              name="username"
              type="text"
              as={TextField}
              label="Username"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="username" component="div" className="error" />
          </div>
          <div>
            <Field
              name="email"
              type="email"
              as={TextField}
              label="Email"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <Field
              name="password"
              type="password"
              as={TextField}
              label="Password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <div>
            <Field
              name="confirmPassword"
              type="password"
              as={TextField}
              label="Confirm Password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error"
            />
          </div>
          {formError && <div className="error-message">{formError}</div>}
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
