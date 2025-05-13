import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AuthManager } from "./AuthManager";

const REGION = "eu-north-1";
const BUCKET_NAME = "attila-videos";

const VideoUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Seleziona un file.");
      return;
    }

    const token = AuthManager.getIdToken();
    if (!token) {
      setMessage("Token non disponibile. Fai login di nuovo.");
      return;
    }

    try {
      const s3 = new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: REGION },
          identityPoolId: "eu-north-1:d9c77661-c4dc-4658-8631-0464cf074b6c",
          logins: {
            "cognito-idp.eu-north-1.amazonaws.com/eu-north-1_ORp0swOLt": token,
          },
        }),
      });

    const arrayBuffer = await file.arrayBuffer();
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `video/${file.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
    };

      await s3.send(new PutObjectCommand(uploadParams));
      setMessage("✅ Upload completato!");
    } catch (err: any) {
      console.error("Errore durante l'upload:", err);
      setMessage(`❌ Upload fallito: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Carica un video</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Carica su S3</button>
      <button onClick={AuthManager.logout} style={{ marginLeft: "1rem" }}>
        Logout
      </button>
      <p style={{ color: message.startsWith("❌") ? "red" : "green" }}>{message}</p>
    </div>
  );
};

export default VideoUploader;
