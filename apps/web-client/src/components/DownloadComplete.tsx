import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { StepIndicator } from "./PromptInput";

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
    <View className="flex-1 bg-slate-50 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-lg items-center">
        <StepIndicator currentStep={3} />

        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">✓</Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-center text-slate-900">
          Your Icons Are Ready!
        </Text>
        <Text className="text-slate-500 mb-6 text-center">
          Download your complete icon package below
        </Text>

        <View className="bg-slate-50 p-4 rounded-xl mb-6 w-full">
          <Text className="text-sm font-semibold text-slate-700 mb-2">
            Package includes:
          </Text>
          <View className="gap-1">
            <Text className="text-slate-600">• iOS icons (all required sizes)</Text>
            <Text className="text-slate-600">• Android icons (mdpi to xxxhdpi)</Text>
            <Text className="text-slate-600">• Web favicons (16px to 512px)</Text>
            <Text className="text-slate-600">• Original master image (1024x1024)</Text>
          </View>
        </View>

        <Pressable
          className="p-4 rounded-xl items-center w-full bg-green-600 active:bg-green-700 mb-3"
          onPress={handleDownload}
        >
          <Text className="text-white font-semibold text-lg">
            Download ZIP
          </Text>
        </Pressable>

        <Pressable
          className="p-4 rounded-xl items-center w-full bg-slate-100 active:bg-slate-200"
          onPress={onStartOver}
        >
          <Text className="text-slate-700 font-semibold text-lg">
            Create Another Icon
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
