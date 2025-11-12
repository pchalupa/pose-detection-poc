import VisionCamera
import MediaPipeTasksVision

final class MediaPipeFrameProcessor {
    private lazy var poseLandmarker: PoseLandmarker? = {
        guard let modelPath = Bundle.main.path(forResource: "pose_landmarker_full", ofType: "task") else {
            print("MediaPipe: pose_landmarker.task model file not found")
            return nil
        }

        let options = PoseLandmarkerOptions()
        options.baseOptions.modelAssetPath = modelPath
        options.runningMode = .video
        options.numPoses = 1
        options.minPoseDetectionConfidence = 0.5
        options.minPosePresenceConfidence = 0.5
        options.minTrackingConfidence = 0.5

        do {
            return try PoseLandmarker(options: options)
        } catch {
            print("MediaPipe: Failed to create pose landmarker: \(error)")
            return nil
        }
    }()

    private var frameCounter: Int64 = 0

    func process(_ frame: Frame) -> [[String: Any]] {
        guard let poseLandmarker = poseLandmarker else {
            return []
        }

        do {
            let image = try MPImage(sampleBuffer: frame.buffer, orientation: frame.orientation)
            let result = try poseLandmarker.detect(videoFrame: image, timestampInMilliseconds: Int(frame.timestamp) )

            guard let firstPose = result.landmarks.first else {
                return []
            }


            return firstPose.enumerated().map { (index, landmark) in
                [
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "visibility": landmark.visibility?.floatValue ?? 0.0,
                    "type": normalizeLandmarkType(index),
                ]
            }
        } catch {
            print("MediaPipe: Error processing frame: \(error)")
            return []
        }
    }

    private func normalizeLandmarkType(_ index: Int) -> String {
        switch index {
        case 0: return "NOSE"
        case 1: return "LEFT_EYE_INNER"
        case 2: return "LEFT_EYE"
        case 3: return "LEFT_EYE_OUTER"
        case 4: return "RIGHT_EYE_INNER"
        case 5: return "RIGHT_EYE"
        case 6: return "RIGHT_EYE_OUTER"
        case 7: return "LEFT_EAR"
        case 8: return "RIGHT_EAR"
        case 9: return "LEFT_MOUTH"
        case 10: return "RIGHT_MOUTH"
        case 11: return "LEFT_SHOULDER"
        case 12: return "RIGHT_SHOULDER"
        case 13: return "LEFT_ELBOW"
        case 14: return "RIGHT_ELBOW"
        case 15: return "LEFT_WRIST"
        case 16: return "RIGHT_WRIST"
        case 17: return "LEFT_PINKY"
        case 18: return "RIGHT_PINKY"
        case 19: return "LEFT_INDEX"
        case 20: return "RIGHT_INDEX"
        case 21: return "LEFT_THUMB"
        case 22: return "RIGHT_THUMB"
        case 23: return "LEFT_HIP"
        case 24: return "RIGHT_HIP"
        case 25: return "LEFT_KNEE"
        case 26: return "RIGHT_KNEE"
        case 27: return "LEFT_ANKLE"
        case 28: return "RIGHT_ANKLE"
        case 29: return "LEFT_HEEL"
        case 30: return "RIGHT_HEEL"
        case 31: return "LEFT_FOOT_INDEX"
        case 32: return "RIGHT_FOOT_INDEX"
        default: return "UNKNOWN"
        }
    }
}
