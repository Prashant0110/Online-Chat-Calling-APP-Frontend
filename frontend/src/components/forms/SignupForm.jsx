import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState(null);

  // Validation Schema
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

  const handleRegister = (values) => {
    dispatch(registerUser(values))
      .then(() => {
        // Redirect or show success message
      })
      .catch((err) => {
        setFormError(err.message);
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "900px",
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Left Side Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "block" },
            backgroundImage:
              "url('/assets/kunal-pandit-5w9D2ZqZxLw-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right Side Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Create Your Account
          </Typography>
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
              <Form style={{ width: "100%", maxWidth: 400 }}>
                <Field
                  name="username"
                  as={TextField}
                  label="Username"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="username" />}
                  error={Boolean(<ErrorMessage name="username" />)}
                />
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(<ErrorMessage name="email" />)}
                />
                <Field
                  name="password"
                  as={TextField}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(<ErrorMessage name="password" />)}
                />
                <Field
                  name="confirmPassword"
                  as={TextField}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="confirmPassword" />}
                  error={Boolean(<ErrorMessage name="confirmPassword" />)}
                />
                {formError && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ textAlign: "center", mt: 1 }}
                  >
                    {formError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SignUpForm;
