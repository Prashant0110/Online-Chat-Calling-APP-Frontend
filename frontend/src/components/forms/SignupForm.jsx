import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

// Validation Schema using Yup
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignupForm = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500"
      p={4}
    >
      <Box
        className="max-w-sm w-full bg-white p-6 rounded-xl shadow-lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography
          variant="h5"
          component="h1"
          className="text-center mb-6 font-semibold text-gray-800"
        >
          Create Account
        </Typography>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form submitted with values: ", values);
            // Redirect to login page after successful signup
            navigate("/login");
          }}
        >
          <Form className="space-y-4">
            <div>
              <Field
                name="username"
                as={TextField}
                label="Username"
                variant="outlined"
                fullWidth
                size="small"
                className="block"
                error={false}
                helperText={<ErrorMessage name="username" />}
              />
            </div>

            <div>
              <Field
                name="email"
                as={TextField}
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                className="block"
                error={false}
                helperText={<ErrorMessage name="email" />}
              />
            </div>

            <div>
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                size="small"
                className="block"
                error={false}
                helperText={<ErrorMessage name="password" />}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-6"
            >
              Create Account
            </Button>

            <Typography className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Sign In
              </Link>
            </Typography>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
};

export default SignupForm;
