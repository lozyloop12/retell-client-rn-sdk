import { useEffect, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RetellWebClient } from "retell-client-rn-sdk";

const RetellCallExample = () => {
  const [client] = useState(new RetellWebClient());
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [callStatus, setCallStatus] = useState("Disconnected");

  useEffect(() => {
    // Set up event listeners
    client.on("call_started", () => {
      setIsConnected(true);
      setCallStatus("Connected");
    });

    client.on("call_ended", () => {
      setIsConnected(false);
      setIsMuted(false);
      setIsAgentTalking(false);
      setCallStatus("Disconnected");
    });

    client.on("call_ready", () => {
      setCallStatus("Ready");
    });

    client.on("agent_start_talking", () => {
      setIsAgentTalking(true);
    });

    client.on("agent_stop_talking", () => {
      setIsAgentTalking(false);
    });

    client.on("error", (error) => {
      Alert.alert("Call Error", error);
      setCallStatus("Error");
    });

    // Request microphone permission on Android
    if (Platform.OS === "android") {
      requestMicrophonePermission();
    }

    return () => {
      // Cleanup
      client.removeAllListeners();
      if (isConnected) {
        client.stopCall();
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "This app needs access to your microphone for voice calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "Microphone permission is required for voice calls."
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startCall = async () => {
    try {
      setCallStatus("Connecting...");

      // Replace with your actual access token
      const accessToken = "your-retell-access-token-here";

      await client.startCall({
        accessToken,
        sampleRate: 48000,
        emitRawAudioSamples: false,
      });
    } catch (error) {
      Alert.alert("Failed to start call", error.message);
      setCallStatus("Error");
    }
  };

  const endCall = () => {
    client.stopCall();
  };

  const toggleMute = () => {
    if (isMuted) {
      client.unmute();
      setIsMuted(false);
    } else {
      client.mute();
      setIsMuted(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retell AI Voice Call</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusText, getStatusColor(callStatus)]}>
          {callStatus}
        </Text>
      </View>

      {isAgentTalking && (
        <View style={styles.talkingIndicator}>
          <Text style={styles.talkingText}>🤖 Agent is speaking...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!isConnected ? (
          <TouchableOpacity style={styles.startButton} onPress={startCall}>
            <Text style={styles.buttonText}>Start Call</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.muteButton, isMuted && styles.mutedButton]}
              onPress={toggleMute}
            >
              <Text style={styles.buttonText}>
                {isMuted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={endCall}>
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Connected":
    case "Ready":
      return { color: "#4CAF50" };
    case "Connecting...":
      return { color: "#FF9800" };
    case "Error":
      return { color: "#F44336" };
    default:
      return { color: "#757575" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#666",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  talkingIndicator: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  talkingText: {
    fontSize: 16,
    color: "#1976D2",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  muteButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mutedButton: {
    backgroundColor: "#757575",
  },
  endButton: {
    backgroundColor: "#F44336",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RetellCallExample;
