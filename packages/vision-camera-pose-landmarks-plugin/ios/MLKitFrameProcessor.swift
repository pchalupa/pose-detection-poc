import MLKitPoseDetection
import MLKitVision
import VisionCamera

struct LandmarkType {

}

final class MLKitFrameProcessor {
    private lazy var poseDetector = {
        let options = PoseDetectorOptions()

        options.detectorMode = .stream

        return PoseDetector.poseDetector(options: options)
    }()

    func process(_ frame: Frame) -> [[String: Any]] {
        do {
            let visionImage = VisionImage(buffer: frame.buffer)

            visionImage.orientation = frame.orientation

            let detectedPoses = try poseDetector.results(in: visionImage)

            return detectedPoses.first?.landmarks.map { landmark in
                [
                    "x": landmark.position.x,
                    "y": landmark.position.y,
                    "type": normalizeLandmarkType(landmark.type),
                ]
            } ?? []
        } catch let error {
            return []
        }
    }

    private func normalizeLandmarkType(_ type: PoseLandmarkType) -> String {
        switch type {
        case .nose: return "NOSE"
        case .leftEyeInner: return "LEFT_EYE_INNER"
        case .leftEye: return "LEFT_EYE"
        case .leftEyeOuter: return "LEFT_EYE_OUTER"
        case .rightEyeInner: return "RIGHT_EYE_INNER"
        case .rightEye: return "RIGHT_EYE"
        case .rightEyeOuter: return "RIGHT_EYE_OUTER"
        case .leftEar: return "LEFT_EAR"
        case .rightEar: return "RIGHT_EAR"
        case .mouthLeft: return "LEFT_MOUTH"
        case .mouthRight: return "RIGHT_MOUTH"
        case .leftShoulder: return "LEFT_SHOULDER"
        case .rightShoulder: return "RIGHT_SHOULDER"
        case .leftElbow: return "LEFT_ELBOW"
        case .rightElbow: return "RIGHT_ELBOW"
        case .leftWrist: return "LEFT_WRIST"
        case .rightWrist: return "RIGHT_WRIST"
        case .leftPinkyFinger: return "LEFT_PINKY"
        case .rightPinkyFinger: return "RIGHT_PINKY"
        case .leftIndexFinger: return "LEFT_INDEX"
        case .rightIndexFinger: return "RIGHT_INDEX"
        case .leftThumb: return "LEFT_THUMB"
        case .rightThumb: return "RIGHT_THUMB"
        case .leftHip: return "LEFT_HIP"
        case .rightHip: return "RIGHT_HIP"
        case .leftKnee: return "LEFT_KNEE"
        case .rightKnee: return "RIGHT_KNEE"
        case .leftAnkle: return "LEFT_ANKLE"
        case .rightAnkle: return "RIGHT_ANKLE"
        case .leftHeel: return "LEFT_HEEL"
        case .rightHeel: return "RIGHT_HEEL"
        case .leftToe: return "LEFT_FOOT_INDEX"
        case .rightToe: return "RIGHT_FOOT_INDEX"
        default: return "UNKNOWN"
        }
    }
}
