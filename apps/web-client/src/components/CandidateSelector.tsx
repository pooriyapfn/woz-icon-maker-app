import React, { useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { StepIndicator } from "./PromptInput";

interface CandidateSelectorProps {
  candidates: string[];
  onSelect: (index: number) => void;
  isLoading: boolean;
}

export default function CandidateSelector({
  candidates,
  onSelect,
  isLoading,
}: CandidateSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onSelect(selectedIndex);
    }
  };

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-lg">
        <StepIndicator currentStep={2} />

        <Text className="text-2xl font-bold mb-2 text-center text-slate-900">
          Choose Your Favorite
        </Text>
        <Text className="text-slate-500 mb-6 text-center">
          Select one of the generated candidates to finalize
        </Text>

        <View className="flex-row flex-wrap justify-center gap-4 mb-6">
          {candidates.map((url, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedIndex(index)}
              className={`rounded-xl overflow-hidden border-4 ${
                selectedIndex === index
                  ? "border-indigo-600"
                  : "border-transparent"
              }`}
            >
              <Image
                source={{ uri: url }}
                className="w-36 h-36"
                resizeMode="cover"
              />
              {selectedIndex === index && (
                <View className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <Pressable
          className={`p-4 rounded-xl items-center ${
            selectedIndex === null || isLoading
              ? "bg-slate-300"
              : "bg-indigo-600 active:bg-indigo-700"
          }`}
          onPress={handleConfirm}
          disabled={selectedIndex === null || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Use This Design
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
