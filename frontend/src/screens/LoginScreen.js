import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        try {
            await login(username, password);
        } catch (error) {
            Alert.alert('เข้าสู่ระบบไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>📚 ห้องสมุดออนไลน์</Text>
                <Text style={styles.subtitle}>เข้าสู่ระบบเพื่อใช้งาน</Text>

                <TextInput
                    style={styles.input}
                    placeholder="ชื่อผู้ใช้"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', backgroundColor: '#f8f9fa', padding: 20 },
    card: { backgroundColor: '#ffffff', padding: 30, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 30 },

    input: { backgroundColor: '#f0f2f5', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16, color: '#2c3e50' },

    loginButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },

    registerLink: { color: '#3498db', textAlign: 'center', marginTop: 20, fontWeight: '500' }
});

export default LoginScreen;
