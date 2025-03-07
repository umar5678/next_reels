"use client";
import React, { useRef, useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploaderProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentageComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentageComplete));
    }
    setUploading(true);
    setError(null);
  };

  const handlestartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less then 100 MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("please upload a valid image type: (JPEG, PNG, WEBP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Video must be less then 5 MB");
        return false;
      }
    }

    return false;
  };

  const ikUploadRefTest = useRef(null);
  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handlestartUpload}
        onUploadProgress={handleProgress}
        useUniqueFileName={true}
        accept={fileType === "video" ? "video/*" : "image/*"}
        folder={fileType === "video" ? "videos" : "images"}
        className="file-input file-input-borderd w-full"
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
