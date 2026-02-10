import { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AuthHeader from '@/components/AuthHeader';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import { apiFetch } from '@/lib/api';
import { saveToken } from '@/lib/auth';

type Step = 'phone' | 'otp' | 'name';

export default function Auth() {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function sendOtp() {
        setLoading(true);
        try {
            await apiFetch('/auth/request-otp', {
                method: 'POST',
                body: JSON.stringify({ phone }),
            });
            setStep('otp');
        } catch {
            Alert.alert('Error', 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    }

    async function finishLogin(token: string) {
        await saveToken(token);

        const societies = await apiFetch('/societies/mine');
        console.log('SOCIETIES:', societies);

        if (societies.length === 0) {
            router.replace('/society-choice');
        } else {
            router.replace('/home/(tabs)/notices');
        }
    }


    async function verifyOtp() {
        setLoading(true);
        try {
            const res = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phone, otp }),
            });

            // Existing user
            await finishLogin(res.token);
        } catch (err: any) {
            const message = typeof err?.message === 'string' ? err.message : '';

            // 👇 NEW USER PATH (THIS WAS MISSING)
            if (message.includes('Name required')) {
                setStep('name');
                return;
            }

            if (message.includes('expired')) {
                Alert.alert('OTP expired', 'Please request a new OTP');
                setStep('phone');
                return;
            }

            if (message.includes('attempts')) {
                Alert.alert('Too many attempts', 'Please request a new OTP');
                setStep('phone');
                return;
            }

            Alert.alert('Error', 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    }

    async function submitName() {
        setLoading(true);
        try {
            const res = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phone, otp, name }),
            });

            await finishLogin(res.token);
        } catch {
            Alert.alert('Error', 'Signup failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            {step === 'phone' && (
                <>
                    <AuthHeader title="Welcome to Barite" subtitle="Enter your phone number" />
                    <TextField
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <PrimaryButton title="Continue" onPress={sendOtp} disabled={loading} />
                </>
            )}

            {step === 'otp' && (
                <>
                    <AuthHeader title="Verify OTP" subtitle="We sent a code to your phone" />
                    <TextField
                        placeholder="6-digit OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                    />
                    <PrimaryButton title="Verify" onPress={verifyOtp} disabled={loading} />
                </>
            )}

            {step === 'name' && (
                <>
                    <AuthHeader title="Almost done" subtitle="Tell us your name" />
                    <TextField placeholder="Your name" value={name} onChangeText={setName} />
                    <PrimaryButton title="Finish" onPress={submitName} disabled={loading} />
                </>
            )}
        </View>
    );
}
