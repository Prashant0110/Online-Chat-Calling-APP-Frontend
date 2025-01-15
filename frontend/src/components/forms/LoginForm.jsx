import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  Alert,
} from "@mui/material";
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
    <Container
      maxWidth="xs"
      sx={{
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ mb: 2 }}>
              <Field
                name="email"
                type="email"
                as={TextField}
                label="Email"
                fullWidth
                variant="outlined"
                margin="dense"
                error={Boolean(ErrorMessage.name === "email")}
                helperText={<ErrorMessage name="email" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="password"
                type="password"
                as={TextField}
                label="Password"
                fullWidth
                variant="outlined"
                margin="dense"
                error={Boolean(ErrorMessage.name === "password")}
                helperText={<ErrorMessage name="password" />}
              />
            </Box>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default LoginForm;
