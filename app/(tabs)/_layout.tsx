import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Posture</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="head">
        <Icon sf="person.fill" drawable="custom_settings_drawable" />
        <Label>Head</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
