import { StyleSheet, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import { Button } from '~/components/Button';
import { frameProcessor } from '~/frame-processor';

export default function TabOneScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [{ videoResolution: { width: 1920, height: 1080 } }]);

  return (
    <View style={styles.container}>
      {hasPermission && device ? (
        <Camera
          device={device}
          isActive
          style={StyleSheet.absoluteFillObject}
          frameProcessor={frameProcessor}
          fps={30}
          format={format}
          pixelFormat="rgb"
          enableFpsGraph
          videoStabilizationMode="off"
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button text="Request Camera Permission" onPress={requestPermission} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
