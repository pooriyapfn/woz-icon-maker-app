import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, Image } from 'react-native';
import { supabase } from './src/lib/supabase';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle'); // idle, pending, processing, completed
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Function to submit the job to Supabase
  const generateIcon = async () => {
    if (!prompt) return;
    setLoading(true);
    setStatus('pending');

    try {
      // 1. Insert row into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([{ prompt: prompt, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;
      
      setJobId(data.id);
      console.log('Job started:', data.id);
      
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // Realtime subscription to listen for updates from your Node.js Worker
  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'jobs',
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          console.log('Update received:', payload.new);
          setStatus(payload.new.status);
          
          if (payload.new.status === 'completed') {
            setDownloadUrl(payload.new.zip_download_url);
            setLoading(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>App Icon Generator</Text>
        <Text style={styles.subtitle}>Enter a description for your app icon.</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. A minimalist blue rocket ship"
          placeholderTextColor="#999"
          value={prompt}
          onChangeText={setPrompt}
          editable={!loading}
        />

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={generateIcon}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Generating...' : 'Generate Assets'}
          </Text>
        </Pressable>

        {/* Status Indicator */}
        {status !== 'idle' && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Status: {status.toUpperCase()}</Text>
            {status !== 'completed' && <ActivityIndicator size="small" color="#007AFF" />}
          </View>
        )}

        {/* Download Button (Only shows when Node worker is done) */}
        {status === 'completed' && downloadUrl && (
          <Pressable style={styles.downloadButton} onPress={() => window.open(downloadUrl, '_blank')}>
            <Text style={styles.downloadText}>Download Asset Bundle (.zip)</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Styles - Standard React Native StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500, // Keeps it looking good on Desktop
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statusText: {
    fontWeight: '600',
    color: '#333',
  },
  downloadButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  downloadText: {
    color: '#007AFF',
    fontWeight: 'bold',
  }
});