import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { PromptInputSchema } from "../schemas/job";
import { ScreenWrapper } from "./ScreenWrapper";
import { StepIndicator } from "./StepIndicator";
import { useLogoUpload } from "../hooks/useLogoUpload";

interface PromptInputProps {
  onSubmit: (prompt: string, logoUrl: string | null) => void;
  isLoading: boolean;
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { logoUri, pickLogo, uploadLogo, clearLogo, isUploading } =
    useLogoUpload();

  const characterCount = prompt.length;
  const isOverLimit = characterCount > 500;
  const canSubmit =
    !isLoading && !isUploading && !isOverLimit && characterCount >= 3;

  const handleSubmit = async () => {
    const result = PromptInputSchema.safeParse(prompt);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input");
      return;
    }
    setError(null);

    const logoUrl = await uploadLogo();
    onSubmit(prompt, logoUrl);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-5 pt-2 pb-3">
          <StepIndicator currentStep={1} />
          <Text className="text-3xl font-bold text-slate-900">
            Describe your icon
          </Text>
          <Text className="text-slate-500 mt-1">
            Tell us what kind of app icon you want to create.
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-28"
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-slate-50 rounded-2xl border border-slate-200 mt-2">
            <TextInput
              className="p-4 text-base text-slate-900 min-h-[140px]"
              style={{ textAlignVertical: "top" }}
              placeholder="e.g. Minimal rocket icon, flat design, indigo gradient, subtle shadow"
              placeholderTextColor="#94a3b8"
              value={prompt}
              onChangeText={(text) => {
                setPrompt(text);
                if (error) setError(null);
              }}
              multiline
            />
          </View>

          <View className="flex-row justify-between mt-2">
            <Text
              className={`text-xs ${isOverLimit ? "text-red-500" : "text-slate-400"}`}
            >
              {characterCount}/500
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Reference logo (optional)
            </Text>
            {logoUri ? (
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: logoUri }}
                  className="w-16 h-16 rounded-xl"
                />
                <Pressable
                  onPress={clearLogo}
                  className="px-3 py-2 rounded-lg bg-slate-200 active:bg-slate-300"
                >
                  <Text className="text-slate-700 text-sm">Remove</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={pickLogo}
                className="h-16 rounded-xl border-2 border-dashed border-slate-300 items-center justify-center active:bg-slate-100"
              >
                <Text className="text-slate-500 text-sm">
                  Tap to add a logo
                </Text>
              </Pressable>
            )}
          </View>

          {/* <View className="px-4 pb-4">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Quick styles
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {[
                  "Minimal",
                  "3D glossy",
                  "Flat + bold",
                  "Line icon",
                  "Gradient",
                  "Cute mascot",
                ].map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => setPrompt((p) => (p ? `${p}, ${tag}` : tag))}
                    className="px-3 py-2 rounded-full bg-slate-100 active:bg-slate-200"
                  >
                    <Text className="text-slate-700 text-sm">{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View> */}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
          <Pressable
            className={`h-14 rounded-2xl items-center justify-center ${
              canSubmit ? "bg-indigo-600 active:bg-indigo-700" : "bg-slate-300"
            }`}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            {isLoading || isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Generate candidates
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
