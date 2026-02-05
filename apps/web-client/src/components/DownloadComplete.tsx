import React from "react";
import { View, Text, Pressable, Linking, ScrollView } from "react-native";
import { StepIndicator } from "./StepIndicator";
import { ScreenWrapper } from "./ScreenWrapper";

interface DownloadCompleteProps {
  downloadUrl: string;
  onStartOver: () => void;
}

export default function DownloadComplete({
  downloadUrl,
  onStartOver,
}: DownloadCompleteProps) {
  const handleDownload = () => {
    Linking.openURL(downloadUrl);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-5 pt-2 pb-3">
          <StepIndicator currentStep={3} />
          <Text className="text-3xl font-bold text-slate-900">
            Your icons are ready
          </Text>
          <Text className="text-slate-500 mt-1">
            Download your complete package below
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-32">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Text className="text-4xl text-green-700">✓</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl border border-slate-200 p-5">
            <Text className="text-sm font-semibold text-slate-700 mb-3">
              Package includes
            </Text>

            <View className="space-y-2">
              <Text className="text-slate-600">• iOS icons (all sizes)</Text>
              <Text className="text-slate-600">
                • Android icons (mdpi → xxxhdpi)
              </Text>
              <Text className="text-slate-600">
                • Web favicons (16 → 512px)
              </Text>
              <Text className="text-slate-600">• 1024×1024 master image</Text>
            </View>
          </View>

          <View className="mt-4 bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
            <Text className="text-indigo-700 text-sm text-center">
              Tip: Save the ZIP to your computer and drag directly into Xcode or
              Android Studio.
            </Text>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
          <Pressable
            className="h-14 rounded-2xl items-center justify-center bg-green-600 active:bg-green-700 mb-3"
            onPress={handleDownload}
          >
            <Text className="text-white font-semibold text-lg">
              Download ZIP
            </Text>
          </Pressable>

          <Pressable
            className="h-14 rounded-2xl items-center justify-center bg-slate-200 active:bg-slate-300"
            onPress={onStartOver}
          >
            <Text className="text-slate-700 font-semibold">
              Create another icon
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
