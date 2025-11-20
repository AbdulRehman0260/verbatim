import axios from "axios";

export async function getUploadUrl(file: File) {
  const res = await axios.get(
    `http://localhost:3000/upload-url?fileName=${encodeURIComponent(
      file.name
    )}`,
    { withCredentials: true }
  );

  return res.data as {
    uploadUrl: string;
    fileUrl: string;
  };
}

export async function uploadImage(file: File) {
  const { uploadUrl, fileUrl } = await getUploadUrl(file);

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    transformRequest: (data) => data, // don't transform the file
  });

  return fileUrl; // <- S3 URL
}
