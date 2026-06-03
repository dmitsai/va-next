import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
import { FileUploadRouter } from "~/server/api/routers/fileUpload";

  export const UploadButton = generateUploadButton<FileUploadRouter>();
  export const UploadDropzone = generateUploadDropzone<FileUploadRouter>();
  