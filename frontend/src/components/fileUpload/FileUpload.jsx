import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Input } from "@mui/material";

const FileUploadForm = () => {
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("File is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("file", values.file);
      // Submit formData to your backend
      console.log("Submitted file:", values.file);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        type="file"
        name="file"
        onChange={(event) =>
          formik.setFieldValue("file", event.currentTarget.files[0])
        }
        error={formik.touched.file && Boolean(formik.errors.file)}
      />
      {formik.touched.file && formik.errors.file && (
        <div style={{ color: "red" }}>{formik.errors.file}</div>
      )}
      <Button type="submit" variant="contained" color="primary">
        Upload
      </Button>
    </form>
  );
};

export default FileUploadForm;
