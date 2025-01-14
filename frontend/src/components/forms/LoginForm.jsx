import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState(null);

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submission
  const handleLogin = (values) => {
    dispatch(loginUser(values))
      .then(() => {
        // Redirect or show success message
      })
      .catch((err) => {
        setFormError(err.message); // Set error message
      });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting }) => (
        <Form>
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
          {formError && <div className="error-message">{formError}</div>}
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
