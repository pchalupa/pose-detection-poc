import VisionCamera
import MLKitPoseDetection
import MLKitVision

@objc(PoseDetectionPlugin)
public class PoseDetectionPlugin: FrameProcessorPlugin {
    private lazy var poseDetector = {
        let options = PoseDetectorOptions()
        options.detectorMode = .stream

        return PoseDetector.poseDetector(options: options)
    }()

    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable : Any]! = [:]) {
      super.init(proxy: proxy, options: options)
    }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any {
    let buffer = frame.buffer
    let orientation = frame.orientation

    let visionImage = VisionImage(buffer: buffer)
    visionImage.orientation = orientation

    var detectedPoses: [Pose]?
    var detectionError: Error?

    do {
      detectedPoses = try poseDetector.results(in: visionImage)
    } catch let error {
      detectionError = error
    }

    guard let pose = detectedPoses?.first, detectionError == nil else {
      return []
    }

    var landmarks: [[String: Any]] = []

    for landmark in pose.landmarks {
      landmarks.append([
        "type": getLandmarkType(landmark.type),
        "x": landmark.position.x,
        "y": landmark.position.y
      ])
    }

    return landmarks
  }

  private func getLandmarkType(_ type: PoseLandmarkType) -> String {
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
//    case .leftMouth: return "LEFT_MOUTH"
//    case .rightMouth: return "RIGHT_MOUTH"
    case .leftShoulder: return "LEFT_SHOULDER"
    case .rightShoulder: return "RIGHT_SHOULDER"
    case .leftElbow: return "LEFT_ELBOW"
    case .rightElbow: return "RIGHT_ELBOW"
    case .leftWrist: return "LEFT_WRIST"
    case .rightWrist: return "RIGHT_WRIST"
//    case .leftPinky: return "LEFT_PINKY"
//    case .rightPinky: return "RIGHT_PINKY"
//    case .leftIndex: return "LEFT_INDEX"
//    case .rightIndex: return "RIGHT_INDEX"
//    case .leftThumb: return "LEFT_THUMB"
//    case .rightThumb: return "RIGHT_THUMB"
    case .leftHip: return "LEFT_HIP"
    case .rightHip: return "RIGHT_HIP"
    case .leftKnee: return "LEFT_KNEE"
    case .rightKnee: return "RIGHT_KNEE"
    case .leftAnkle: return "LEFT_ANKLE"
    case .rightAnkle: return "RIGHT_ANKLE"
    case .leftHeel: return "LEFT_HEEL"
    case .rightHeel: return "RIGHT_HEEL"
//    case .leftFootIndex: return "LEFT_FOOT_INDEX"
//    case .rightFootIndex: return "RIGHT_FOOT_INDEX"
    default: return "UNKNOWN"
    }
  }
}
