import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RetellWebClient } from "retell-client-rn-sdk";

const RetellCallDemo = () => {
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [isGlobalsRegistered, setIsGlobalsRegistered] = useState(false);

  useEffect(() => {
    initializeRetell();
    return () => {
      if (client) {
        client.stopCall();
      }
    };
  }, []);

  const initializeRetell = async () => {
    try {
      // Step 1: Register WebRTC globals
      console.log("Registering WebRTC globals...");
      await RetellWebClient.registerGlobals();
      setIsGlobalsRegistered(true);
      console.log("WebRTC globals registered successfully");

      // Step 2: Create client
      const retellClient = new RetellWebClient();

      // Step 3: Set up event listeners
      retellClient.on("call_started", () => {
        console.log("Call started");
        setIsConnected(true);
      });

      retellClient.on("call_ended", () => {
        console.log("Call ended");
        setIsConnected(false);
        setIsAgentTalking(false);
      });

      retellClient.on("call_ready", () => {
        console.log("Agent is ready");
      });

      retellClient.on("agent_start_talking", () => {
        console.log("Agent started talking");
        setIsAgentTalking(true);
      });

      retellClient.on("agent_stop_talking", () => {
        console.log("Agent stopped talking");
        setIsAgentTalking(false);
      });

      retellClient.on("error", (error) => {
        console.error("Retell error:", error);
        Alert.alert("Error", error);
        setIsConnected(false);
      });

      setClient(retellClient);
    } catch (error) {
      console.error("Failed to initialize Retell:", error);
      Alert.alert(
        "Initialization Error",
        `Failed to setup WebRTC: ${error.message}`
      );
    }
  };

  const startCall = async () => {
    if (!client) {
      Alert.alert("Error", "Client not initialized");
      return;
    }

    try {
      await client.startCall({
        accessToken: "YOUR_ACCESS_TOKEN_HERE", // Replace with your actual token
        sampleRate: 48000,
        emitRawAudioSamples: false,
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      Alert.alert("Call Error", error.message);
    }
  };

  const stopCall = () => {
    if (client) {
      client.stopCall();
    }
  };

  const toggleMute = () => {
    if (client && isConnected) {
      // This is a simple toggle - in real app you'd track mute state
      client.mute(); // or client.unmute();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retell AI Voice Call Demo</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          WebRTC Globals:{" "}
          {isGlobalsRegistered ? "✅ Registered" : "❌ Not Registered"}
        </Text>
        <Text style={styles.statusText}>
          Call Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}
        </Text>
        <Text style={styles.statusText}>
          Agent: {isAgentTalking ? "🗣️ Talking" : "🤐 Silent"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startCall}
          disabled={!isGlobalsRegistered || isConnected}
        >
          <Text style={styles.buttonText}>Start Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopCall}
          disabled={!isConnected}
        >
          <Text style={styles.buttonText}>Stop Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.muteButton]}
          onPress={toggleMute}
          disabled={!isConnected}
        >
          <Text style={styles.buttonText}>Toggle Mute</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  statusContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  muteButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RetellCallDemo;
