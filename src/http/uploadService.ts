// uploadService.ts
import axios from "axios";

export async function enviarParaApi(formData: FormData) {
  return axios.post(
    "https://apisubaulas.onrender.com/api/v1/aulas",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}
