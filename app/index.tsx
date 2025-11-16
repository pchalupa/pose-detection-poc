import { View } from 'react-native';
import { Preview } from '~/features/body-pose/Preview';

export default function TabOneScreen() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}
    >
      <Preview />
    </View>
  );
}
