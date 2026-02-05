import React from "react";
import { View, Text } from "react-native";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View className="flex-row justify-center mb-6 mt-10">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step === currentStep
                ? "bg-indigo-600"
                : step < currentStep
                  ? "bg-indigo-400"
                  : "bg-slate-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                step <= currentStep ? "text-white" : "text-slate-500"
              }`}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              className={`w-12 h-1 mx-1 ${
                step < currentStep ? "bg-indigo-400" : "bg-slate-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
}
