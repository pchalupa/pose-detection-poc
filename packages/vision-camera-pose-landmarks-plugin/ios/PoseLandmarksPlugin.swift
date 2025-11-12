import VisionCamera

@objc(PoseLandmarksPlugin)
public class PoseLandmarksPlugin: FrameProcessorPlugin {
    private lazy var mediaPipeFrameProcessor = {
        return MediaPipeFrameProcessor()
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
        return mediaPipeFrameProcessor.process(frame)
    }
}
