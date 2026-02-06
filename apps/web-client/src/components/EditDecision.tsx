import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StepIndicator } from "./StepIndicator";
import { ScreenWrapper } from "./ScreenWrapper";

interface EditDecisionProps {
  imageUrl: string;
  onEdit: (editPrompt: string) => void;
  onStartFresh: () => void;
  onFinalize: () => void;
  isLoading: boolean;
}

export default function EditDecision({
  imageUrl,
  onEdit,
  onStartFresh,
  onFinalize,
  isLoading,
}: EditDecisionProps) {
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const handleSubmitEdit = () => {
    if (editPrompt.trim()) {
      onEdit(editPrompt.trim());
    }
  };

  if (editMode) {
    return (
      <ScreenWrapper>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1">
            <View className="px-5 pt-2 pb-3">
              <StepIndicator currentStep={2} />
              <Text className="text-3xl font-bold text-slate-900">
                Edit your design
              </Text>
              <Text className="text-slate-500 mt-1">
                Describe what changes you'd like to make.
              </Text>
            </View>

            <View className="flex-1 px-5">
              <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <View className="aspect-square bg-slate-100">
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>

              <View className="mt-4">
                <TextInput
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 min-h-[100px]"
                  placeholder="e.g., Make the background blue, add a shadow..."
                  placeholderTextColor="#94a3b8"
                  value={editPrompt}
                  onChangeText={setEditPrompt}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                />
              </View>
            </View>

            <View className="px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
              <View className="flex-row gap-3">
                <Pressable
                  className="flex-1 h-14 rounded-2xl items-center justify-center border border-slate-300 bg-white active:bg-slate-100"
                  onPress={() => {
                    setEditMode(false);
                    setEditPrompt("");
                  }}
                  disabled={isLoading}
                >
                  <Text className="text-slate-700 font-semibold text-lg">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 h-14 rounded-2xl items-center justify-center ${
                    editPrompt.trim() && !isLoading
                      ? "bg-indigo-600 active:bg-indigo-700"
                      : "bg-slate-300"
                  }`}
                  disabled={!editPrompt.trim() || isLoading}
                  onPress={handleSubmitEdit}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-lg">
                      Apply Edit
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-5 pt-2 pb-3">
          <StepIndicator currentStep={2} />
          <Text className="text-3xl font-bold text-slate-900">
            Review your selection
          </Text>
          <Text className="text-slate-500 mt-1">
            Edit, start fresh, or finalize your icon.
          </Text>
        </View>

        <View className="flex-1 px-5">
          <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <View className="aspect-square bg-slate-100">
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          <View className="mt-4 bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
            <Text className="text-indigo-700 text-center text-sm">
              Tip: You can edit this design as many times as you like before
              finalizing.
            </Text>
          </View>
        </View>

        <View className="px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
          <View className="flex-row gap-3 mb-3">
            <Pressable
              className="flex-1 h-14 rounded-2xl items-center justify-center border border-slate-300 bg-white active:bg-slate-100"
              onPress={onStartFresh}
              disabled={isLoading}
            >
              <Text className="text-slate-700 font-semibold">Start Fresh</Text>
            </Pressable>
            <Pressable
              className="flex-1 h-14 rounded-2xl items-center justify-center border border-indigo-600 bg-white active:bg-indigo-50"
              onPress={() => setEditMode(true)}
              disabled={isLoading}
            >
              <Text className="text-indigo-600 font-semibold">
                Edit Design
              </Text>
            </Pressable>
          </View>
          <Pressable
            className={`h-14 rounded-2xl items-center justify-center ${
              !isLoading
                ? "bg-indigo-600 active:bg-indigo-700"
                : "bg-slate-300"
            }`}
            disabled={isLoading}
            onPress={onFinalize}
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
    </ScreenWrapper>
  );
}
