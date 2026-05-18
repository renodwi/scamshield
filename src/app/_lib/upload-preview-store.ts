export type UploadedPreview = {
  name: string;
  url: string;
};

declare global {
  interface Window {
    scamShieldUploadedPreviews?: UploadedPreview[];
  }
}

export function saveUploadedPreviews(files: File[]) {
  if (typeof window === "undefined") return;

  window.scamShieldUploadedPreviews?.forEach((preview) => {
    URL.revokeObjectURL(preview.url);
  });

  window.scamShieldUploadedPreviews = files.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}

export function getUploadedPreviews() {
  if (typeof window === "undefined") return [];

  return window.scamShieldUploadedPreviews ?? [];
}

export function clearUploadedPreviews() {
  if (typeof window === "undefined") return;

  window.scamShieldUploadedPreviews?.forEach((preview) => {
    URL.revokeObjectURL(preview.url);
  });

  window.scamShieldUploadedPreviews = [];
}
