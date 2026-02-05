import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StepIndicator } from "./StepIndicator";
import { ScreenWrapper } from "./ScreenWrapper";

export default function CandidateSelector({
  candidates,
  onSelect,
  isLoading,
}: {
  candidates: string[];
  onSelect: (index: number) => void;
  isLoading: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const canConfirm = selectedIndex !== null && !isLoading;

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-5 pt-2 pb-3">
          <StepIndicator currentStep={2} />
          <Text className="text-3xl font-bold text-slate-900">
            Pick a favorite
          </Text>
          <Text className="text-slate-500 mt-1">
            Tap one option to finalize the icon pack.
          </Text>
        </View>

        <ScrollView contentContainerClassName="px-5 pb-28" className="flex-1">
          <View className="flex-row flex-wrap justify-between">
            {candidates.map((url, index) => {
              const selected = selectedIndex === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedIndex(index)}
                  className={`mb-4 w-[48%] rounded-2xl overflow-hidden border ${
                    selected ? "border-indigo-600" : "border-slate-200"
                  }`}
                >
                  <View className="aspect-square bg-slate-100">
                    <Image
                      source={{ uri: url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="p-3 flex-row items-center justify-between">
                    <Text className="text-slate-700 font-medium">
                      Option {index + 1}
                    </Text>
                    {selected && (
                      <View className="px-2 py-1 rounded-full bg-indigo-600">
                        <Text className="text-white text-xs font-semibold">
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
          <Pressable
            className={`h-14 rounded-2xl items-center justify-center ${
              canConfirm ? "bg-indigo-600 active:bg-indigo-700" : "bg-slate-300"
            }`}
            disabled={!canConfirm}
            onPress={() => selectedIndex !== null && onSelect(selectedIndex)}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Use this design
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
