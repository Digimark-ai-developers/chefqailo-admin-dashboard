import { useCallback } from "react";

import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "./button";

interface ImageUploadProps {
  image: File | string | null;
  setImage: React.Dispatch<React.SetStateAction<File | string | null>>;
}

const ImageUploader = ({ image, setImage }: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed border-primary bg-muted p-5"
    >
      <input {...getInputProps()} />
      <Upload className="size-14 text-primary" />
      <div className="flex w-full flex-col items-center justify-center gap-1">
        {isDragActive ? (
          <span className="w-full text-center text-sm text-primary">
            Drop the files here ...
          </span>
        ) : image ? (
          <div className="relative">
            <Button
              onClick={() => setImage(null)}
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-0.5 top-0.5 text-red-500"
            >
              <X />
            </Button>
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image!)
              }
              alt="Uploaded"
              className="h-32 w-32 rounded-lg object-cover"
            />
          </div>
        ) : (
          <span className="w-full text-center text-sm">
            <span className="text-primary">Drag & Drop</span> or&nbsp;
            <br />
            <span className="text-primary">Click</span> to Upload
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
