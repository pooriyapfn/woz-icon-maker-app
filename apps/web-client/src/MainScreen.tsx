import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "./lib/supabase";

export default function MainScreen() {
  const [prompt, setPrompt] = useState("");

  const mutation = useMutation({
    mutationFn: async (newPrompt: string) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert([{ prompt: newPrompt, status: "pending" }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("Job created!", data);
    },
  });

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-xl w-full max-w-lg shadow-lg">
        <Text className="text-2xl font-bold mb-2 text-center text-gray-900">
          App Icon Generator
        </Text>
        <Text className="text-gray-500 mb-6 text-center">
          Powered by React Native & Supabase
        </Text>

        <TextInput
          className="border border-gray-200 rounded-lg p-4 text-lg mb-4 bg-gray-50 focus:border-blue-500 outline-none"
          placeholder="e.g. A futuristic cyberpunk cat"
          value={prompt}
          onChangeText={setPrompt}
        />

        <Pressable
          className={`p-4 rounded-lg items-center ${mutation.isPending ? "bg-gray-400" : "bg-black"}`}
          onPress={() => mutation.mutate(prompt)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Generate Assets
            </Text>
          )}
        </Pressable>

        {mutation.isError && (
          <Text className="text-red-500 mt-4 text-center">
            Error: {mutation.error.message}
          </Text>
        )}
      </View>
    </View>
  );
}
