import MediaPipeTasksVision
import VisionCamera

final class MediaPipeFrameProcessor {
    private lazy var poseLandmarker: PoseLandmarker? = {
        guard
            let modelPath = Bundle.main.path(
                forResource: "pose_landmarker_full",
                ofType: "task"
            )
        else {
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
            return nil
        }
    }()

    func process(_ frame: Frame) -> [[String: Any]] {
        guard let poseLandmarker = poseLandmarker else {
            return []
        }

        do {
            let image = try MPImage(
                sampleBuffer: frame.buffer,
                orientation: frame.orientation
            )
            let result = try poseLandmarker.detect(
                videoFrame: image,
                timestampInMilliseconds: Int(frame.timestamp)
            )
            guard let firstPose = result.landmarks.first else {
                return []
            }
            let landmarks = firstPose.enumerated().map { (index, landmark) in
                [
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "type": index,
                ]
            }

            return landmarks
        } catch {
            return []
        }
    }
}
