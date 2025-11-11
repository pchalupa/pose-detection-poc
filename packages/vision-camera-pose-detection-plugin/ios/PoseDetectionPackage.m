#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>
#import "VisionCameraPoseDetectionPlugin-Swift.h"

@interface PoseDetectionPlugin (FrameProcessorPluginLoader)
@end

@implementation PoseDetectionPlugin (FrameProcessorPluginLoader)
+ (void) load {
  [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"detectPose"
    withInitializer:^FrameProcessorPlugin*(VisionCameraProxyHolder* proxy, NSDictionary* options) {
    return [[PoseDetectionPlugin alloc] initWithProxy:proxy withOptions:options];
  }];
}
@end
