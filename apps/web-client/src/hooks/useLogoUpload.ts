import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export function useLogoUpload() {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoUri) return null;

    setIsUploading(true);
    try {
      const response = await fetch(logoUri);
      const blob = await response.blob();

      const fileName = `logos/${Date.now()}.png`;

      const { error } = await supabase.storage
        .from("assets")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("assets").getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const clearLogo = () => {
    setLogoUri(null);
  };

  return { logoUri, pickLogo, uploadLogo, clearLogo, isUploading };
}
