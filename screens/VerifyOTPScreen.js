import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyOTPScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP === '1234') {
      // Mock user data - replace with your actual user data
      const userData = {
        name: 'Prasanna Anil Deshmukhhh',
        mobile: '6723211225',
        address: 'At Post Saigaon Tal Jawali Dist Satara',
        dob: '02 Dec 2024',
        email: email,
        aadhar: '333333333333',
        restaurant: 'Jagadamb (741283)',
      };

      try {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        // Navigate to home screen with bottom tabs
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } catch (error) {
        console.error('Error storing user data:', error);
        alert('Something went wrong. Please try again.');
      }
    } else {
      alert('Invalid OTP! Please enter 1234');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={otp[index]}
              onChangeText={(value) => handleOtpChange(value, index)}
            />
          ))}
        </View>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleVerifyOTP}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 