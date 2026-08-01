import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

// face-api.js model weight files must live in /public/models (served at
// runtime from the site root). See the reference doc for exactly which
// files are needed and where to get them.
const MODEL_URL = "/models";

// Loaded once per page load and shared across every FaceScanner instance —
// re-downloading multi-megabyte model weights every time the component
// mounts would be wasteful (e.g. if the user hits Retake and this were
// re-created, or if two scanners ever end up on the same page).
let modelsLoadingPromise = null;
function loadModels() {
  if (!modelsLoadingPromise) {
    modelsLoadingPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  }
  return modelsLoadingPromise;
}

const STATUS = {
  LOADING_MODELS: "loading-models",
  STARTING_CAMERA: "starting-camera",
  READY: "ready", // camera live, waiting for the user to press Capture
  DETECTING: "detecting", // Capture pressed, face-api is running
  CAPTURED: "captured", // a good descriptor was extracted
  ERROR: "error", // unrecoverable — no camera, permission denied, etc.
};

// Minimum face-api detection confidence to accept. Below this, lighting or
// angle is probably too poor for a reliable descriptor.
const MIN_DETECTION_SCORE = 0.6;

/**
 * Renders a live camera preview and a Capture button. When a single,
 * clearly-detected face is captured, calls onCapture(descriptorArray) with
 * a plain 128-number array (already converted from face-api's
 * Float32Array so it's easy to JSON.stringify for the backend).
 *
 * Calls onCapture(null) if the user presses Retake, so the parent knows to
 * clear out any previously stored vector until a new one is captured.
 */
export default function FaceScanner({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState(STATUS.LOADING_MODELS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus(STATUS.ERROR);
        setMessage("This browser doesn't support camera access. Try Chrome or Edge.");
        return;
      }

      try {
        await loadModels();
        if (cancelled) return;

        setStatus(STATUS.STARTING_CAMERA);
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus(STATUS.READY);
      } catch (err) {
        if (cancelled) return;
        setStatus(STATUS.ERROR);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMessage("Camera access was denied. Allow camera permission in your browser and reload the page.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setMessage("No camera was found on this device.");
        } else {
          setMessage(`Could not start the face scanner: ${err.message}`);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // Only ever run once per mount — re-running this on every render would
    // repeatedly request the camera and reload models.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    setStatus(STATUS.DETECTING);
    setMessage("");

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setStatus(STATUS.READY);
        setMessage("No face detected. Make sure the face is well lit and centered, then try again.");
        return;
      }

      if (detections.length > 1) {
        setStatus(STATUS.READY);
        setMessage("More than one face detected. Make sure only one person is in frame.");
        return;
      }

      const [{ detection, descriptor }] = detections;

      if (detection.score < MIN_DETECTION_SCORE) {
        setStatus(STATUS.READY);
        setMessage("Face wasn't detected clearly. Improve lighting and face the camera directly, then try again.");
        return;
      }

      setStatus(STATUS.CAPTURED);
      onCapture(Array.from(descriptor));
    } catch (err) {
      setStatus(STATUS.READY);
      setMessage(`Face scan failed: ${err.message}`);
    }
  };

  const handleRetake = () => {
    setMessage("");
    onCapture(null);
    setStatus(STATUS.READY);
  };

  return (
    <div>
      {status === STATUS.LOADING_MODELS && <p>Loading face recognition models...</p>}
      {status === STATUS.STARTING_CAMERA && <p>Starting camera...</p>}

      <video ref={videoRef} autoPlay muted playsInline />

      {message && <p role="alert">{message}</p>}
      {status === STATUS.CAPTURED && <p>Face captured.</p>}

      {(status === STATUS.READY || status === STATUS.DETECTING) && (
        <button type="button" onClick={handleCapture} disabled={status === STATUS.DETECTING}>
          {status === STATUS.DETECTING ? "Scanning..." : "Capture Face"}
        </button>
      )}

      {status === STATUS.CAPTURED && (
        <button type="button" onClick={handleRetake}>
          Retake
        </button>
      )}
    </div>
  );
}
