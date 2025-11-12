import MLKitPoseDetection
import MLKitVision
import VisionCamera

@objc(PoseLandmarksPlugin)
public class PoseLandmarksPlugin: FrameProcessorPlugin {
    private lazy var mlKitFrameProcessor = {
        return MLKitFrameProcessor()
    }()

    public override init(
        proxy: VisionCameraProxyHolder,
        options: [AnyHashable: Any]! = [:]
    ) {
        super.init(proxy: proxy, options: options)
    }

    public override func callback(
        _ frame: Frame,
        withArguments arguments: [AnyHashable: Any]?
    ) -> Any {
        return mlKitFrameProcessor.process(frame)
    }
}
