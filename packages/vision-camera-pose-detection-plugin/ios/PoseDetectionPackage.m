#if __has_include(<VisionCamera/FrameProcessorPlugin.h>)
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraPoseDetectionPlugin-Swift.h"

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(PoseDetectionPlugin, detectPose)

#endif
